---
layout: post
title: "Communication between different applications in different languages"
date: 2015-11-10
---
In many scenarios, communication between applications in different languages are required. There are plenty of ways to solve this issue. For example, using Jython to compile the python code into JVM-compatible binary code, so that the code can be called by Java directly. Using messaging to communicate between applications is another way of doing “Remote Procedure Call” or simply pushing a message to the counterpart. Here I want to introduce how to send and receive messages between Java and python via RabbitMQ.

<h3>RabbitMQ</h3>
RabbitMQ is a messaging broker. It passes along all messages sent by different clients to different targets. In the RabbitMQ’s terminology, the clients are called providers, and the targets are called consumers. Since RabbitMQ offers quite many clients in almost all popular languages, we can write providers and consumers in almost any language. (Please see <a href="https://www.rabbitmq.com/features.html">RabbitMQ</a> for more details.)

<h3>Context</h3>
The project shown in this article is written within the Spring framework on the Java side and pika for implementation of the AMPQ protocol (RabbitMQ uses AMPQ as the messaging protocol) on the python side. 

Since the project was originally aimed to offer the possibility to a web application based on Spring to talk to a python application, so I chose Spring Boot to set up the web server. If you are only interested in the communication between a Java application and a python application, please skip the next section and jump to the “Messaging Setup” section.

<h3>Web Application Setup</h3>
Here I chose Spring Boot to build a simple stand-alone application to provide the UI for the communication. The code is almost the same as the sample code in <a href="http://spring.io/guides/gs/serving-web-content/">Spring Boot</a>. Clone the code from <a href="https://github.com/simonlzn/SpringWithGradle">here</a> and input the following command to run it. 
``` bash gradle run ```

After this step, you should be able to see “hello” on the page, when you type in http://localhost:8080/home

<h3>Messaging Setup</h3>
Since I am using Spring as the IoC container, so the code looks like this.
If you want to write everything in pure Java, just new all instances represented by each function.
Here I have defined the ConnectionFactory to set up the connection between my application and the RabbitMQ server. Two exchanges are declared here, one for sending messages and one for receiving messages (the exchanges can be defined on both provider and consumer side, it would be safer to define them on both sides). A queue and its corresponding binding are also declared to receive messages (the same declaration policy as exchanges can be applied here). In the last part, a container and a listener are declared to define the logic for processing messages when they arrive. 

Let’s see the code on the python side. 
It is almost the same as on the Java side. 

<h3>Run it</h3>
Now let’s run both the Java application and python application and see how they communicate with each other.

