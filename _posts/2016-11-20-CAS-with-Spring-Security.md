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
Spring Security is a framework providing authentication and authorization for Spring based applications. It simplifies the authentication process for applications and is easily and well integrated with Spring framework.

Spring Security supports the 

<h3>Conclusion</h3>
In summary, medical image viewer can also be built with web, which means HTML can be easily used to build the UI and all kinds of web servers can be used to handle concurrent requests. Users don't need to install any applications, instead all they need is just a browser to open the viewer. 
 
Although web based medical image viewer has these advantages, it also has drawbacks. In order to give users good user experience, the application needs to be customized and optimized for browsers. Images need to be pre-processed, the only data transmitted over internet will be the YUV values. This data should be set to be cache-enabled for the browser. On the browser side, as soon as getting all transverse images, a 3D array can be constructed as a stack of 2D images. It is used to store all the image data as an image volume. When an image on any view needs to be displayed, just fix one dimension of the 3D array and get the other two dimensions. 