---
layout: post
title: "CAS with Spring Security for both server and client"
date: 2016-11-20
---
<h3>Overview</h3>
CAS(Central Authentication Service) is a good mechanism for having one single point of login to avoid duplicated authentications on different applications using the same credentials. 

<h3>Background</h3>
CAS is an implementation of the single sign-on(SSO) protocol. It provides the enterprise single sign-on service for web based applications.

The CAS contains two components, server component and client component. The server component works just like a server, which authenticate users with their credentials. The client component works as a library in the applications that need to redirect the users to the CAS server for authentication.

The CAS client first redirect user to the CAS server if there is no valid authentication for users. CAS server gives the user a TGT(Ticket Granting Ticket) to identify himself and meanwhile asks the user to go back to the CAS client with a specified TS(Service Ticket). When the CAS client gets the TS, it needs to confirm with CAS server that this is a valid TS, if so then proceed with the original request.

This is the document from <a href="https://apereo.github.io/cas/4.0.x/protocol/CAS-Protocol.html">Jasig CAS</a>

<h3>CAS with Spring Security</h3>
<h4>remember-me feature in Spring Security</h4>
Spring Security is a framework providing authentication and authorization for Spring based applications. It simplifies the authentication process for applications and is easily and well integrated with Spring framework.

Spring Security supports the functionality of "remember-me" login, which is a auto-login feature and can work exactly like the TGT in CAS.  

> "Remember-me" feature issues a cookie with a specified expiration time period(for special purpose, it can also be set as a session cookie) on the first login, with this cookie, users can be identified on the next visit and  can be auto authenticated.
  
My idea is to make use of the "remember-me" feature to simplify the CAS server. In Spring Security, in order to enable the remember-me login, we need to set it up in the security config.

```
    public class SecureConfig extends WebSecurityConfigurerAdapter {
    ...
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    // "CASTGC" is the cookie name for TGT, which is the same as the "remember-me" cookie
                    .logout().deleteCookies("JSESSIONID", "CASTGC") 
                    .invalidateHttpSession(true)
                .and()        
                    .anyRequest().authenticated()
                .and()
                    .formLogin()
                    .loginPage("/login")
                    .defaultSuccessUrl("/")
                    .failureUrl("/login?error")        
                .and()
                    .authenticationProvider(myAuthenticationProvider)
                    // Here set the "CASTGC" as the "remember-me" cookie name
                    .rememberMe().rememberMeCookieName("CASTGC").rememberMeServices(mySphicTokenBasedRememberMeServices)
                    .tokenValiditySeconds(1209600)
                .and()
                    .httpBasic();            
        }
    ...
```

After setting up the security config, we can customize the "remember-me" cookie settings by extending the *TokenBasedRememberMeServices* (There are also other ways to set up the "remember-me" cookie, please refer to the Spring Security manual)

```
    public class MyTokenBasedRememberMeServices extends
            TokenBasedRememberMeServices {
    
        public MyTokenBasedRememberMeServices(String key, UserDetailsService userDetailsService) {
            super(key, userDetailsService);
            this.setCookieName("CASTGC");
        }
    
        /** Copy of code of inherited class + setting cookieExpiration, */
        @Override
        protected void setCookie(String[] tokens, int maxAge,
                                 HttpServletRequest request, HttpServletResponse response) {
            String cookieValue = encodeCookie(tokens);
            Cookie cookie = new Cookie("CASTGC", cookieValue);
            cookie.setPath("/");
            cookie.setMaxAge(604800); // here I set the expiration time to one week
    
            response.addCookie(cookie);
        }
    
        @Override
        protected void cancelCookie(HttpServletRequest request, HttpServletResponse response) {
            logger.debug("Cancelling cookie");
            Cookie cookie = new Cookie("CASTGC", null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
        }
    }
```

After these two are set, the "remember-me" feature is enabled. 

For the CAS server, another important feature is to check the TS sent by clients and return the authentication information if it is valid.

```
    @RestController
    @RequestMapping(value = "/authenticate")
    public class AuthenticateController {
    
        @RequestMapping(value = "")
        public Authentication validateTicket(@RequestParam String ticket) {
            if (MyAuthenticationSuccessHandler.authenticatedUsers.containsKey(ticket)) {
                Authentication authentication = MyAuthenticationSuccessHandler.authenticatedUsers.get(ticket);
                MyAuthenticationSuccessHandler.authenticatedUsers.remove(ticket);
                return authentication;
            }
    
            return null;
        }
    }
```

These are all the things we need to set up for CAS server, then we need to implement the CAS client for applications to authenticate users.

<h4>Implement CAS client</h4>
Spring Security is based on the concept of servlet filter(more precisely filter chain). In order to let the CAS client redirect the user to the CAS server when there he is not authenticated and validate the ticket with CAS server when users bring in the ticket, we just need to add on filter in the filter chain of Spring Security.

Spring Security provides an interface *AuthenticationEntryPoint* to respond to the failed authentication. When the authentication fails, we need to redirect the user to the login page on CAS server, so they can log in with their credentials. So to custom the behaviour after the failed authentication, we need implement the *AuthenticationEntryPoint* and add the redirection,

```
    public class MyAuthenticationEntryPoint implements AuthenticationEntryPoint {
    
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response,
                             AuthenticationException exception) throws IOException, ServletException {
    
            // add the current request url as a parameter of the redirection, so after the authentication, 
            // the CAS server can redirect the user back to this url
            String redirectUrl = request.getRequestURL().toString();
            if (request.getQueryString() != null)
                redirectUrl += "?" + request.getQueryString();
            response.sendRedirect("http://cas.server.com/login?url=" + URLEncoder.encode(redirectUrl, "utf-8"));        
        }
    
    }
```

Then we add our filter in the Spring Security filter chain.

```
    http
        .addFilterAfter(new TicketFilter(), SecurityContextPersistenceFilter.class) // add a filter after the SecurityContext is set
        .logout().deleteCookies("JSESSIONID", "SPHIC_ID")
        .invalidateHttpSession(true)
        ...
```

The filter itself should do just one thing, when there is a ST attached to the url in the request, it needs to validate this ticket with the CAS server to make sure this is valid ticket, otherwise just discard it. So the filter ends up with,

```java
    private class TicketFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
            String queryString = request.getQueryString();
            if (queryString != null && queryString.contains("ticket=")) {
                
                try {
                    URL url = new URL("http://cas.server.com/authenticate?ticket=" + queryString.substring(queryString.indexOf("ticket=") + 7));

                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    request.getCookies();
                    conn.setDoOutput(true);
                    conn.setDoInput(true);
                    conn.connect();

                    BufferedReader br = new BufferedReader(new InputStreamReader(
                            conn.getInputStream()));
                    String output = "";
                    String line;
                    while ((line = br.readLine()) != null) {
                        output += line;
                    }
                    HashMap authenticationProps = new ObjectMapper().readValue(output, HashMap.class);
                    String name = authenticationProps.get("name").toString();

                    // load and create a new security context with the information retrieved from the CAS server
                    UserInfo userinfo = (UserInfo) myLoginService.loadUserByUsername(name);
                    List authorities = (ArrayList)authenticationProps.get("authorities");
                    Object details = authenticationProps.get("details");

                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userinfo, null, authorities);
                    usernamePasswordAuthenticationToken.setDetails(details);
                    SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                    securityContext.setAuthentication(usernamePasswordAuthenticationToken);
                    SecurityContextHolder.setContext(securityContext);
                    
                    // reset the session
                    HttpSession session = request.getSession(true);
                    session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);
                    StringBuffer requestURL = request.getRequestURL();

                    // remove the ticket parameter and go back to the original request
                    Map<String, String> queryParams = QueryStringUtil.getQueryParams(requestURL.append('?').append(queryString).toString());
                    queryParams.remove("ticket");
                    String redirectUrl = request.getRequestURI()  + QueryStringUtil.constructQueryString(queryParams);
                    response.sendRedirect(redirectUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }

            chain.doFilter(request, response);
        }
    }
```

With the above filter, each authenticated request will validate the ticket with the CAS server and proceed to the original request.

<h3>Flow</h3>
To sum up the whole process for the CAS system, the entire flow of the the users' authentication would be like this,
 
<img src="/images/CAS_flow.jpg">

<h3>Conclusion</h3>
In summary, CAS is a good choice for single sign-on approach. With Spring Security it is very easy to implement the CAS server and client. 

This article only illustrates the basic flow to request a page. Some other issues like how to authenticate a REST request is not considered here.