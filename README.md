# Getting Started with Image Annotation with ReactJS & Flask

This project was created using ReactJS as Front-end and Flask as Backend

## Image Annotation

Image annotation is the process of labeling images of a dataset to train a machine learning model. Therefore, image annotation is used to label the features you need your system to recognize.

## Prerequisits

To initialize with this project the following software packages should be installed in the host machine
* Python v3.9.6
* Node JS v14.17.0
* npm v6.14.13

## Installation

To install the ReactJS Application, download the zip of this repository or clone it to your system and go to the **annotation** directory and run the following command to install all the dependancies of this project.

```npm install```

To setup the Flask Application, go to **api** directory under **annotation** directory and with the help of [requirement.txt](https://github.com/HostFuture/Image-Annotation/blob/master/annotation/api/requirements.txt) file install all the dependancies. It is recommended to setup a virtual environment for the flast application before installing requirement.txt

```pip install -r requirement.txt```

## Demo Preview

[![SmartCow - Full Stack Assignment](http://img.youtube.com/vi/m90JMlI1UsY/0.jpg)](http://www.youtube.com/watch?v=m90JMlI1UsY)

## Running the Code

Once the prerequisits are met and the environment is setup you can run the following commands. By default Flask application runs at port 5000 and reactjs in post 3000, if you have to modify it, you can do it in the code and also please note that if the default port is changed for Flask, please update the changed port to [package.json](https://github.com/HostFuture/Image-Annotation/blob/master/annotation/package.json) under **proxy** configuration.

### Start the application

First you have to start the backend application (Flask) before starting ReactJS. To start the application you can use the shortcut (__the defination is updated under package.json__).

```
yarn start-api
```

Once the backend code is up, then execute the following command to start the front end code.

```
yarn start
```

## User Guide

Once the site is up and running, your default browser will start presenting the application. At this stage, the application is ready to use. 

### Sign In

The default initial page is Sign In, a user have to signin to the application, before accessing it's contents. If the user doesn't have a email or password to login, they can signup and create an account for them.

![Sign In Page](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/sign-in.png)

### Sign Up

The sign up page will validate is there are duplicate accounts with the same email id or not, if not will create an account and will redirect you to the sign in page

![Sign Up Page](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/sign-up.png)

### Forgot Password 

A default forgot password page is also provided, that will let you reset the password and redirect you to the login page.

![Forgot Password](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/forgot-password.png)

### Dashboard

Once a user successfully logs in, they will be provided with a blank dashboard, where the user can create a project with a suitable name, and it will create a directory in the backend associated with the project. A user can only create one project. Once a project is created, the next screen will be available to the user to upload images.

![Dashboard](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/dashboard.png)

### New Project 

Post creating a project, a user can upload upto 10 images to annonate the vehicles within that. There is a counter in the dashboard, that indicates how many images has been uploaded out of ten images. Once the user reaches their threshold, the upload button got removed from the dashboard. An user can upload multiple images at a time and during that if they cross their threshold the user will be notified using a toast notification.

![New Project](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/new-project.png)

### Creating Annotation

Once an image is uploaded it can be annotated. The user have to click on the image, it will open the image in a larger scale and then the annotation can be performed. To annotate, the user have to click on the image and create a box on the image object. Upon selection, the user will be provided with a dropdown menu from where they can choose the type of the vehicle in the image. After creating the selection, using the delete button they can delete individual annotation or they can reset the form. If the submit button is pressed, then the annotation details are same, and can be accessed later. 

![Creating Annotation](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/creating-annonition.png)

### Saved Annotations

As mentioned in the **Created Annotation** section, once the annotation is saved, it can be accessed any time. If the same image is opened all the annotations will be visible and that can be extracted as a CSV file. The CSV file option is only available if there is atleast one annotation in the image available.

![Saved Annotations](https://raw.githubusercontent.com/HostFuture/Image-Annotation/master/screenshots/saved-annotition.png)


## Developer Contact

#### Debjit Sadhukhan
#### +91 83358 39446
#### debjit95@engineer.com
#### Bangalore, India