Web based medical image viewer

<h3>Overview</h3>
Traditional medical image viewers are either CS based or running on a single machine, but according to the recent work, I have found out the image viewer can also be implemented on web. This approach can exploit the benefit of web based applications, such as cross platform, easy to use(only via browser). Meanwhile, it also has some drawbacks. The major difficulties of a web based image viewer are the performance issues caused by the limited computation power of the browser and the latency of internet transmission.

<h3>Data format for images</h3>
The intuitive way of displaying images on web is to transfer images in JPG, PNG format, it is naturally supported by browsers and can be easily cached. However, this is not so efficient for displaying medical images. For images like CT, usually they are displayed in 3 planes, a.k.a. transverse, sagittal and coronal views. The most often used way to display such images is to display the YUV values, because they are more easily manipulated via some image processing algorithm. So in my application, I have set up a couple of REST APIs to return the data of the images for all 3 views. Here is an example response of such requests.

 ```
        {"@id":"1", "row":512,"column":512,"rowspacing":0.5111907,"columnspacing":0.5111907,"sliceLocation":0.0,"zPosition":null,"data":"45,43,54,53,53,27,8,23,0,54,83,76,50,24,53,23,23,24,63,87,50,62,60.....","intercept":1000}
 ```

<h3>Speed up the image display</h3>
In the daily work, the physicians are likely to constantly scroll over images to find the tumors, so instantly switching between images is one of the key points of applications with good user experience. As I mentioned before, web application has some potential performance issues caused by the latency of internet and browser. In order to have a user friendly web application with good performance, we need to overcome these problems.

To solve the problem of the latency of the internet transmission, a common approach is to cache the often requested resource locally, so only the first request will get to the server, all the repeating requests will be retrieved from the cache directly. There are some ways to set the cache policy for a HTTP request. Here I have set the "cache-control" to "public" and the "max-age" to "87640". After setting the cache for all image related HTTP requests, we can guarantee the performance after the first visit.

Let's then take one step further. Since the original CT only has the transverse view, the images for sagittal and coronal views are simply calculated by reconstructing the image volume and slicing the volume. In the traditional medical image viewer, this process is done with the help of some tools such as ITK. ITK provides features to easily convert original CT images(DICOM files) to a 3D volume and get the images for sagittal and coronal views. So an easy way to reduce the number of the requests would be, only request the data for the transverse view and then get the other two views locally, which will be introduced in the following sections.

<h3>Reconstruct and slicing locally</h3>
The idea of slicing the image volume locally is to create the functionality to simulate ITK in JS. ITK does a lot of work for reconstructing the image volume taking plenty of properties of the images into account. If we want to implement everything in JS, that will be quite complicate, but if we first pre-process the CT images and only consider the voxel value, that will be fairly easy. So in the pre-process step, all transverse images are retrieved from the server as an array of YUV values. Maintain a 3D array as a volume for a particular set of transverse images. As soon as the images for the other two views are displayed, fix one dimension of the image volume and get the data for the other two dimensions. This can easily be done with JS. Example code is like this,

```
        var a = sliceImage.imagePixelData;
        var index = sliceImage.index;
        var width = sliceImage.width;
        for(var i = 1; i < a.length; i++){
            module.cache[index][parseInt(i/width)][i%width] = a[i];
        }
```

In this way, major data of the images is already stored locally in the memory of the browser, then switching between images will be really fast, because the switching only means moving the index of the 3D array. In my experiment, the sliding over images can give a desktop application-like user experience.