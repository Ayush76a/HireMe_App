## Hello 👋, This Web app is called "Hire Me".
## A platform to hire helpers to get your day to day work get done. (MERN Stack)
Note: All the frontend was build using chatgpt and other internet tools and the backened by myself. This is just a learning project of implementing some new features.

## Basic idea of functioning of this app:
There will be various helpers to hire. A user can choose any based on their skill and nearby locality, the user will then contact them using the app. Now, a email will be send to helper describing the task to be performed and details instructions and timing, address and fees detials. If helper is ready to do, on the mail he/she recieved, he will approve(or decline). Now, on any of the choices a notification will be send to the user. If approved user can do the payment(there will a button below the notification to do the payment). Once Payment is successful, the user can print the pdf from his previous transactions from the Transaction section in his dashboard.

## Features(to be implemented) 
1) Google recaptcha for overcoming Bot interferences.  ✅
2) Google Login, Signup using google auth. 
3) Payment integration using Cashfree SDk.  ✅
4) Pdf generation of the previous transaction.  ✅
5) Autherization middleware(protect) for controlling user access to data and resources.  ✅
6) Reset Password and Change Password functionality.  
7) Profile Updation functionality. 
8) Sending Email using Nodemailer.   ✅
9) Photo upload with Multer or Cloudinary.


## Env file setup 
1) PORT (i used 8080)
2) MONGO_URI

3) NODE_ENV (development)
4) JWT_SECRET

5) // Nodemailer setup
   1) EMAIL_HOST (smtp.gmail.com generally)
   2) EMAIL_USER (email to send the mails from)
   3) EMAIL_PASS (email pass)

6) GOOGLE_CLIENT_ID (needed to implement google login/signup)

7) FRONTEND_URL

8) // cashfree credentials 
   1) CLIENT_ID 
   2) CLIENT_SECRET 
