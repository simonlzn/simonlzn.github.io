---
layout: post
title: "What is happening, when you open a page"
description : "This article is aimed to give a brief introduction of how different parts of web applications cope with each other to display the content of a web site. The whole flow of the request and response will be described here with an example of a web browser(e.g. Chrome), a web server(e.g. Tomcat) and a database(e.g. Oracle)."
date: 2016-01-12
created: 2016-01-12
---

This article is aimed to give a brief introduction of how different parts of web applications cope with each other to display the content of a web site. The whole flow of the request and response will be described here with an example of a web browser(Chrome), a web server(Tomcat) and a database(Oracle).

A typical way of implementing a web application is to follow the B/S structure. Requests and responses following the HTTP/S protocol come and go between the browser and server to pass along information.

<h3>Browser</h3>
On the browser side, when the user types an URL in the browser address bar, the browser will send a GET request to the server asking for the resource indicated by the URL. Usually the resource is an HTML page. If the server responses correctly, the browser will start to download this page. 
  
Once the page is fully downloaded, the browser will start to render the content. HTML CSS and JS will be sequentially executed, the browser will try to parse the HTML to build the DOM. If a JS file is loaded then the code will be executed immediately, so the process of building the DOM will stay on put and continue after the JS is executed. So it is recommended to put the links to JS files at the end of HTML file and execute the logic after the document.ready or window.onload events are fired.

When all the codes are executed, then the page rendering is finished, now the user can see the page in the browser. If now the user clicks on some button and the page is not completely loaded, but only some content on the page is updated, that means, the browser has fired an Ajax call to the server. The Ajax makes use of the embedded XMLHttpRequest to make an asynchronous call to the server and changes something in the DOM when the call is returned. Meanwhile you can still see the page and operate on other parts of the page.  

<h3>Server</h3>
On the server side, requests are handled by the server application. The server application is also an application running on the server machine, it often contains an infinite loop that listens to a particular port. When a request from the browser reaches the server (if there is a reverse proxy, it will first get to the proxy and get distributed to the real server), a socket is created and based on the different protocols(here we are talking about HTTP, so the network protocol is usually TCP), the data will be transferred from the browser to the server application.
 
Here we take Tomcat/Servlet as an example (for Windows server, IIS will handle this). Tomcat is a server application or also called servlet container. It parses the transmitted data and form it into some objects that HTTP can understand. Since Tomcat is a servlet container, it will start up some servlets and pass the HTTP objects to the servlets (servlets need to configure themselves to tell Tomcat which URLs they are capable to handle, this is usually done via xml configuration or annotation). Up to now the worked has been handed over to servlet. Servlet will call the internal functions to handle different requests (usually the container will call the service() function to distribute the calls to doGet() doPost() based on the type of the requests).

The above description shows how a servlet gets to process requests. Nowadays, there are some MVC frameworks like Spring that wrap up the servlet and give the devs an easy interface to manipulate the distribution of the requests and transmission of the parameters. For example, the Spring MVC creates a servlet called DispatcherServlet internally, all the devs need to do is to map the URLs to certain processing functions. Please see my other article for details about Spring Boot.

When the request is processed, the response needs to be constructed. HTML code with data is filled into the response, then the response is sent back to the browser. With a MVC framework, it is much easier to put some data in a pre-defined HTML page and the templating technology is often used to reduce the duplicated code and better adjust the layout.

<h3>Database</h3>
In the processing functions, the majority of requests need to query the database to retrieve data and then show some formatted data info on the page. In order to do that, a connection between the application and the database server needs to be established. There are several ways to set these connections up. The easiest way would be to use the JDBC or ADO.NET to connect to the database server. Once the connection is set, SQL queries can be used to retrieve data from the database. 

ORM is another way to set up the connection between the application and the database server. Hibernate is one example, it can manage all the connections with database and cache the query results. The devs can manipulate data as objects instead of database tables. All the relationship between tables are mapped by annotation or xml configurations. 

<h3>Summary</h3>
To sum up, the simplest model of the BS structure would be that the browser take responsibility to render the UI in HTML, the server is responsible for processing the requests and construct the response, in the meantime the server queries database for persisted data. 

It is indeed a simple model for web applications, but it has a lot of possibilities and advantages. For example, if the traffic is growing fast and one server can not handle this, a load balancer can be introduced to distribute traffic to different servers. In order to make the servers more secure, a reverse proxy is used not to expose the servers directly, but instead hide them behind the proxy. If the connections between applications and databases are slow, an in-memory database can be added to increase the IO performance. These are all extensions of this model and solve problems caused by requirements of high availability, intensive traffic and so on.