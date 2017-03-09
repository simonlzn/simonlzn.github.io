---
layout: post
title: "Something about JVM"
description : "As a developer, you must have heard of JVM even though you might not be a Java dev. Whenever you start with a Java related \"hello world\", the first thing you are asked to do is to install the JDK or JRE. You may wonder the relationship between these concepts or what exactly is JVM, why it is necessary for Java, what do we need to do with it when we develop a Java application. This article will answer all these questions." 
date: 2015-07-11
created: 2015-07-11
---

<h3>Overview</h3>
As a developer, you must have heard of JVM even though you might not be a Java dev. Whenever you start with a Java related "hello world", the first thing you are asked to do is to install the JDK or JRE. You may wonder the relationship between these concepts or what exactly is JVM, why it is necessary for Java, what do we need to do with it when we develop a Java application. This article will answer all these questions.

<h3>Introduction</h3>
JVM is a virtual machine on whick Java(-like) programs can be run. JVM is not an actual implementation but a specification. Usually we download the JDK or JRE from Oracle (of course there are other sources where you can download them), the JDK or JRE we download contains the Oracle's implementation of JVM, it is called HotSpot.
> JDK is short for Java Development Kit, so it contains the tools and libs for development. For example, javac(.exe) is the tool for compiling Java code to Class files. JDK also has a JRE in it. If your aim is to develop Java applications, then you must download JDK. If you only want to run some Java programs, then JRE is enough. 

In JRE, there is an executable(or more precisely a tool) called java(.exe). We use this tool to run the Java programs. When we type in java XXX, this tool starts a new JVM, it does all the initial work(explained later) and start to run the Java program.

The major reason why Java is called a platform independent language is JVM. If you have some knowledge about the compilation of C/C++, you should know that the compiler compiles the raw code to object code and link them to build the final executable files. These executable files are exe files on Windows, and binary files on Linux. These files cannot be run on a different platform(OS). For Java, JVM acts like an extra layer between the programming language and the machine(OS). Java compiler compiles raw code into Class files, these Class files can be run on different kinds of JVMs on different platforms. The JVMs would be responsible for interpreting the Class files to the code that a local platform can recognize. For example, Windows JVM would convert the code in Class files to the Windows-specific machine code and Linux JVM would do that for Linux machines.

<h3>Internal components of JVM</h3>
By far, we already know what JVM is and how it works while running a Java application. Let's dig a little deeper, take a look at the internal components of the JVM. Here I will take the HotSpot as an example to show the functionality of each component.

<img src="/images/jvm.png" />
<p><em>cite from the official documents of HotSpot</em></p>

Here I want to give a brief introduction about some of the main components.

<h4>Class Loader</h4>
Class Loader defines where to find the class files and how to resolve them to get the references of the classes. If you want to define your own searching and resolving rules, you can extend the ClassLoader class to define them. Usually a JVM provides a bootstrap class loader(a.k.a primordial class loader) and two user-defined class loader, extension class loader and application class loader (which is the parent of custom class loader). The bootstrap class loader loads the java core libs, extension class load loads the extended libs in JRE and the application class loader loads the classes in the system path.



<h4>Runtime data area</h4>
<img src="/images/jvm-1.gif" />
<img src="/images/jvm-2.gif" />
<p><em>cite from http://www.artima.com</em></p>

The method area holds the class data at the runtime. Once the classes are loaded by the class loader, their data is stored in the memory managed by the JVM, which is the method area. 
The Java objects are stored on the heap. So when a <i>new</i> keyword is used to instantiate an object, the object will be created on the heap.
We all know Java supports multi-threads. When a new thread is created, a new pc register is also created to record which instruction this thread will execute next.
The state of a Java thread is stored in the Java stacks. It holds the history of the execution of this thread including the local variables, parameters, return values and some intermediate values.

JVM offers a way to modify the heap size to better make your programs fit for it.
-Xms	Sets the initial heap size for when the JVM starts.
-Xmx	Sets the maximum heap size.

<h4>Garbage Collector(GC)</h4>
In the execution engine, there is a very important component called Garbage Collector(GC). It handles all unused objects on heap and recycle the memory of them. The basic idea of GC is to check all the references of this object at each round for garbage collection. If there is no reference to this object existing in the JVM, then this object will be marked as unused. The simplest algorithm to clean the memory is called Mark And Sweep(MAS). From the name we can easily see that it marks all the unused objects and sweep them out of the memory. In this case the memory will have many small fragments and can not hold big objects. Then an algorithm called mark-compact is introduced. It copies the survival objects to the beginning of the heap, so they will occupy a continuous chunk of memory.
     
From some statistics, people have found out that most of the objects are recycled very fast, only several of them stay long. Cleaning up all objects even the ones living very long is not so efficient. So categorizing them and treating them differently is necessary. This is when generations for GC are introduced. At the beginning, all objects are allocated in a area called Eden area on heap, when the Eden area is full, then they will be marked and copied to the survivor spaces. At the mean time, they will be marked as the age of 1. This is called a minor GC. After several times, the surviving objects will have a higher age. After they reach some aging threshold, they will be moved to another place for all objects in "old generation". Now the minor GC don't need to consider these objects any more. If the old generation is growing big and reach the limit of the old generation, it will trigger a major GC, which is much slower then a minor GC.

A full documentation from Oracle can be seen <a href="http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/gc01/index.html#t2">here</a>. 
For GC, there are also some parameters to adjust for specific programs.
-Xmn	                  Sets the size of the Young Generation.
-XX:PermSize	          Sets the starting size of the Permanent Generation.
-XX:MaxPermSize	          Sets the maximum size of the Permanent Generation
-XX:+UseSerialGC          To enable the Serial Collector use
-XX:+UseConcMarkSweepGC   To enable the Concurrent Mark Sweep(CMS) Collector use
