---
layout: post
title: "Something about HTTP session"
description : "As a web developer, you must have often heard about the words, session, cookie, session cookie, XSS, CSRF, etc. They are all related to the HTTP session. If you are confused with all these concepts, this is the right article for you to read."
date: 2016-02-15
created: 2016-02-15
---

<h3>Overview</h3>
As a web developer, you must have often heard about the words, session, cookie, session cookie, xss, csrf, etc. They are all related to the HTTP session. If you are confused with all these concepts, this is the right article for you to read.

<h3>Session and Cookie</h3>
In the early time of HTTP history, the pages were static and everything is stateless. So every time when you browse a page, it is just a page without any trace of your previous visits. This visit is totally independent of your previous visits or what ever pages you have viewed in this visit.

In order to give users a better user experience, web applications start to keep track of their users' identity and browsing history, so that in the same visit, users don't have to login again, some of their user info can be recognized and used to give the users a feeling that this site is serving them not any other customers. This is the time when the concept session was introduced. The Whole visit was defined as a session. In the real world, session starts from the time you open a page and ends at the time you close the tab or the browser (here I am talking about the browser session, so it is more specific to browsers).

Now, let's first take a look at the definition of session in wiki. 

> a session is a semi-permanent interactive information interchange between two or more communicating devices, or between a computer and user.

After the concept of session is introduced in the web world, devs were seeking a way to keep the session and better retrieve it. Since the session has some sensitive information about the users, it would be more secure to keep it on the server side. Then users will need to provide the web application some identity to prove which sessions stored on the server belong to them. This identity is also know as session ID. The most intuitive way would be attach this identity in the request URL, so this ID will be sent to the server, but this is neither secure nor clean. Then the concept of cookie comes into the picture.  

Cookie is a piece of information browsers keep locally. When the user requests the first page of a site, the server will create a unique ID for this user and browser will store it locally. After the first time, every time the user visits other pages on the same site, this ID will passed back and forth with all the requests and responses, so that the server can identify this user and shows him something based on his previous browsing history.

<h3>Session cookie and auto login</h3>
As described above, the session ID is stored in the cookie. By default, this entry is only valid for the current session, which means, if the user closes the browser, this cookie entry will be gone and the server will generate a new session ID for this user. The cookie entry that is only valid for a session is called session cookie. This kind of cookie don't get persisted. It expires after the user closes the tab or browser. Since there is session cookie, there is also persistent cookie. If a cookie entry is set with an expiration date time, then it will persist until it reaches the expiration time. The persistent cookie is usually used to store some long-term information, such as user preferences. Another usage of the persistent cookie is to store the authentication information so that the user can auto-log in the next time when he comes back.

The basic idea of auto-login is that the user logs in with his credentials at the first time and a cookie entry is stored with a predefined expiration date. Before this expiration date, if the user comes back again, this cookie will be sent along with his first request to the server. Depending on how the server implements the auto login (for a basic token based auto login, the cookie itself contains the user name. for a persistent token based auto login, the username will be retrieved from the database by the series stored in the cookie), the server can recognize the user and restore the user's principal, set it in a newly generated session. After all these, the server will send back the newly generated session ID and keep it in the cookie as a session cookie.

<h3>Security issue</h3>
It is obvious that cookie is very convenient for identifying sessions, but it is also noticeable that cookie is vulnerable for hacks for stealing the identity. There are two simple ways to hack a user's account by exploiting the session ID(or auto login cookie), XSS and CSRF.

<h4>XSS</h4>
XSS stands for cross-site scripting. It usually means, the attacker tries to inject some script into a trusted website to execute some code. 

One common way would be inject some code in the URL and send the URL to the user, if the user clicks on that URL, then the injected code will be triggered. Suppose a user logs in into a bank web site and the identity cookie is stored locally. Now he receives a malicious image with a URL of the bank site attached with some JS code. When he clicks on the image, browser will open a page with this modified URL. Once the page is open, the injected JS will be executed. Supposed the JS sends the cookie value to the attacker, then the attacker can use this cookie to impersonate the user to do everything he is authorized to on the back site.

The common way to defend XSS attack requires the server to strip out the script in the URL or encode the URL to skip the script.

<h4>CSRF</h4>
The full name of CSRF is cross-site request forgery. After the user logs in into some bank web site, he is tricked to open some fake page created by the attacker. The fake page contains some JS code to send a request to the bank site. Since the request is sent always with the cookie set to the same domain, the user's cookie will also be sent to the bank site and the request will be considered as a valid request. In this way, the attacker can forge the requests on the user's behalf and do whatever he is authorized to do.

The most effective way to defend CSRF is to generate some random token on the site and send critical requests with this token. In this way the fake site cannot forge this token and send any valid requests. 