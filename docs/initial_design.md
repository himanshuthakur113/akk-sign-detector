# AKK Website

AKK Website is a web application that uses the camera of your computer.
You can view the website in your browser, give access to your camera and
make a sign with your hand. The application will process the video feed
from your camera, detect your hand and key points and use a machine
learning model to guess what sign you're making. The result will be
shown on the website.

The goal is to create an easy way for the user to test sign recognition
without having to install any desktop applications.

## Goals

-   Create a simple interface for the website with Start Camera and Stop
    Camera buttons.
-   Record the live feed from the webcam after giving access.
-   Use MediaPipe to detect the hand and key points.
-   Use a TensorFlow.js model to classify the hand sign.
-   Show the results clearly.
-   Try to keep everything in the browser so no need to upload the
    camera feed.

## User Flow

1.  User opens the URL of the website in their browser.
2.  Files are requested from a host service.
3.  User presses the start camera button and gives permission.
4.  Video frames are read in.
5.  MediaPipe detects the hand key points.
6.  Tensorflow.js classifies the sign.
7.  The website displays the result. The user can stop the camera
    whenever.

## 2. Initial Design

Shows the initial design of the website. The user inputs the URL of the
website into their browser. The browser will request the website files
from the host service like GitHub Pages or Vercel. The website files
(HTML, CSS, JavaScript and any model/library files) will then be sent
back to the browser.

The camera is turned on and the video frames are processed. MediaPipe
detects the hand key points and the Tensorflow.js model will classify
the sign. The result will be shown on the website.

![Initial design diagram](/AKK%20sign/docs/design_image.jpeg)

## 3. Component Information

### User

User of the website. Opens the site, gives access to the camera, makes a
sign and views the results. When finished they can stop the camera.

### Browser

Runs the website. Connects all the components together. Loads the files
for the page, displays the interface and result. Asks for permission to
the camera. Runs the JavaScript code. Examples are Chrome, Firefox and
Edge.

### Host Service

Stores the website files and makes them available to be accessed via a
URL. Could be GitHub Pages or Vercel as shown in the initial design.
When the project is ready to go public one of these can be chosen. The
hosting doesn't mean the camera will automatically send the video feed
to the host server.

### AKK Website Interface

Where the user will see the interface. The initial version should have a
clear heading, camera feed, start camera button, stop camera button,
result area and a brief description if there is no camera permission or
no sign recognised.

### Camera/Webcam

Provides the live feed. The JavaScript in the browser can ask for access
to the camera using the media device features. The user will have to
give permission. The website should tell the user what to do if they
don't have access.

### Hand Detection (MediaPipe)

Processes the video frames and detects the hand. Returns the key points
(landmarks). Landmarks are specific points on the hand, such as finger
and palm points. This means the input is more concise when classifying.

### Sign Classification (TensorFlow.js Model)

Takes the hand landmarks and guesses which sign it is. Using
TensorFlow.js the model can be run in the browser. The model will need
to be trained or obtained for the specific signs we want to recognise.
MediaPipe alone won't know the meaning of every sign.

### Output

The name/word of the guessed sign is shown on the website. Some
interfaces may show a confidence score. However, a high confidence score
doesn't guarantee the result will be correct. If the model isn't sure
what the sign is, the website can show "No clear sign detected."

## 4. Proposed Flow

### Load

Browser downloads and opens the website.

### Start Camera

User presses the start camera button and gives permission. The page
starts to read in video frames.

### Detect Hand

MediaPipe detects the hand in the frame and returns the landmarks.

### Prepare Input

The landmarks are organised into the format needed for the classifier.
Any normalisation needed for the model will happen here.

### Predict Sign

TensorFlow.js model guesses what the label is.

### Results

The website updates the result area. If there was no useful hand/sign
found a helpful message will appear.

### Stop

User presses stop camera. The camera tracks are stopped and camera
released.

## 5. Initial Technologies

-   HTML -- Website layout.
-   CSS -- Styling the website.
-   JavaScript -- Logic in the browser.
-   MediaPipe -- Hand landmark detection.
-   TensorFlow.js compatible model -- Sign classification.
-   GitHub Pages/Vercel -- Hosting.
-   Browser media device API -- Accessing the camera (with user
    permission).

## 7. Initial Requirements

-   Website opens with no errors in modern browsers.
-   User can start/stop webcam.
-   Clear message shown if no camera permissions or cameras.
-   Hand landmarks detected.
-   Classifier can recognise signs chosen.
-   Results shown.
-   Camera released when the user stops using the feature or leaves the
    page.
