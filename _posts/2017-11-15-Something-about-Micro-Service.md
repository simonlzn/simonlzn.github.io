---
layout: post
title: "Something about Micro Service"
description : "Nowadays, web applications become more and more complex. Some apps become enormous after several generations. Every release is a nightmare for both devs and ops and could last for over a week. The old way to solve this is modularity. Divide the whole application into several modules and then assemble them to form an application. In this way, the logic of the application is separated. When some issues occur, it is much easier to locate them and only modification of some parts of the code instead of the whole application is required."
date: 2017-11-15
created: 2017-11-15
---

Nowadays, web applications become more and more complex. Some apps become enormous after several generations. Every release is a nightmare for both devs and ops and could last for over a week. The old way to solve this is modularity. Divide the whole application into several modules and then assemble them to form an application. In this way, the logic of the application is separated. When some issues occur, it is much easier to locate them and only modification of some parts of the code instead of the whole application is required.

So far everything seems all right. But when a application is composed of several hundred-thousands of lines or even millions of lines, this is no longer that great. Every time compiling the code and deploying an artifact becomes very painful. Now enters a different answer to this question - Micro-Service.

<br>
<h3>1. Micro-Service</h3>
<h4>1.1 What is Micro-Service</h4>
Micro-Service is just a normal service that usually handles to several specific requests. They can response to HTTP or any other type of requests. Each Micro-Services is usually limited to certain functionalities and separated with other services. Some services may depend on each other.

<br>
<h4>1.2 Micro-Service vs Modularity</h4>
Micro-Service is much smaller (that's why it is called "micro") compared to the conventional Monolith. In Monolith, the code is also separated, but it is usually known as Modularity. Namely, the whole Monolith is divided into some modulus and each module handles some functions. Modularity can separate the business logic and make the code more readable. Every time changes may occur only in certain modulus and won't affect other modulus. Modulus call each other via function invoke.

In the architecture of Micro-Service, the modulus are wrapped in services. All of them communicate with each other via requests. This architecture requires a connecting network where the services reside.

Clearly, in Micro-Service, the network plays an important role. If the network connection is slow, service requests may have considerable latency. Modulus don't have this problem, but they all live in the same application, which means, whenever one of the modulus needs to be compiled or deployed, all of the modulus will have to be compiled and deployed. This may take a lot of unnecessary time.

In conclusion, in a small application, Modularity (or in a mini application, maybe one module) is enough to separate the logic of the code, no need to suffer from the overhead of complex architecture (such as Micro-Service). When the application grows to a certain size, compiling of the whole application takes some time that you can't bear any more, or you want to deploy one or more modulus without turning down others, you should consider Micro-Service. It provides you the possibility to have each sub-application small and controllable. It is much easier to replace each of the services without others being aware of the change (e.g. blue green deployment).

<img src="/images/ms-vs-md.png" style="padding: 10px">

<br>
<h3>2. Micro-Service architecture</h3>
<h4>2.1 Structure of Micro-Service</h4>
Micro-Services are usually distributed on different servers. When one service wants to request another service, it can find it via ip. This is the most straight-forward way to find other services, but what if there are thousands of services in the system and they are dynamically deployed on different servers?

In this circumstances, looking for a service via IP is clearly not possible. Then how can we solve this? The answer is registration and discovery. So the idea is to use a third-party platform to record all the services and their IPs, so every time a service wants to send a request, it first looks up the service on this platform and then decide where to send the request.

<br>
<h4>2.2 Registration and discovery</h4>
As introduced above, a Micro-Service system can make use of a third-party platform to organize service registration. Every time when a service starts up, it register itself on this platform with its unique name and IP, so that some other service can find it. Then when a service wants to call this service, it will first ask the platform where to find its expected service and then send the request to it.

The registration and discovery can be further optimized. Retrieving IP and requesting may be wrapped into a common tool. Eureka is such a framework that deals with the service registry and discovery.

<img src="/images/reg-dis.gif" style="padding: 10px">

<br>
<h3>3. Docker</h3>
<h4>3.1 What is Docker</h4>
Docker is an implementation of the container technology. Container technology makes use of the kernel of the operating systems to create some isolated user-space. In each of this space, applications can run in their own "environment". The user-space provides the basic system runtime like running on a normal machine.

<br>
<h4>3.2 Docker vs VM</h4>
VM does the virtualization on the OS level and Docker virtualize the platform over the OS level. The following diagram illustrate the difference between them.

<img src="/images/docker-vs-vm.png" style="padding: 10px">

As shown above, Docker is much more lightweight than VM, which means it is much more flexible than VM. It is very easy to provision and kill a docker instance.

<br>
<h4>3.3 Docker and Micro-Service</h4>
Since Docker can create a isolated runtime for applications, it suits well for Micro-Service. Each Micro-Service can be deployed in a separate Docker container and then several of them can reside on the same machine. In this manner, each service can be independently and easily deployed, started and shut down.

Docker has another advantage that can be perfectly exploited by Micro-Service - Docker Image. When a Docker container is created, a list of commands are executed and some software is installed to create an environment to run the application. All these operations can be extracted into a file called Dockerfile and built as a Docker Image. You can always get to the state as you execute all the commands by loading the Docker Image. So it will be very easy to restore to a specific state of the environment with Docker Image. When applying Micro-Service, an application shipped with Docker can be launched very easily and quickly with the help of Docker Image. So dynamically scaling the number of the services is not only feasible but also very easy.

<br>
<h3>4. Kubernetes</h3>
<h4>4.1 What is Kubernetes</h4>
Kubernetes is a tool for orchestrating dockers. In Kubernetes, one can define a deployment template called <i>Deployment</i>. In Deployment, all deployment related parameters are pre-defined, such as, which image to deploy for which application, how many replicas are required for this application, etc. With these parameters pre-defined, executing a Deployment will lead to the launch of several docker instances on different Kubernetes Nodes(machines or VMs). It also handles the network controlling of all instances.

<br>
<h4>4.2 Kubernetes and Docker</h4>
After setting up the Deployment in Kubernetes, Kubernetes will then take the control of these docker instances, automatically take down failed nodes and launch some new instances. It is also possible to scale up and down docker instances based on the traffic.
