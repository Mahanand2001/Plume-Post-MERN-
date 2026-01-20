# Plume-Post-MERN-

https://plumepost.netlify.app/

A full-stack MERN blog application built with React, Express, and MongoDB. Features user registration/login (JWT), create/edit posts with a rich-text editor, image uploads, author profiles, and RESTful APIs. Designed for easy local development and extensibility.
I'm using netlify for frontend deployment and Render for backend deployemt.
Unfortunately Render does not allow local file system which I've used for storing the profile images and post thumbnails, Using MongoDB to store images and post thumbnails wouldn've have been too hectic, increasing the API response time and also taking up too much space in MongoDB database(I'm using the free plan). so whenever you upload a profile image and post thumbnail and refresh the instance it will vanish, running the same code on localhost will upload both in the uploads folder
take note of it:- 
Client folder needs to a .env file which will contain two Global environment variable REACT_APP_BASE_URL and REACT_APP_ASSETS_URL.

=================================Thank You=================================================
