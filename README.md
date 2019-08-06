# Welcome to eWallet Lite!
This is the mini version of an eWallet backend system built by [Vincent Chow](https://github.com/vincent0813) using his newly acquired skillsets, **Node.js** and [Express](https://expressjs.com/). 


# Endpoints
User
 - [**POST**] Register, Login, Logout, Activate Account
 - [**GET**] Get Profile
 - [**PATCH**] Update Profile
 - [**DEL**] Delete Account

Merchant
 - [**POST**] Register, Activate Merchant
 - [**GET**] Get Merchant
 - [**PATCH**] Update Merchant
 - [**DEL**] Delete Merchant

Transaction
 - [**GET**] Get Transactions
 - [**POST**] Reload, Transfer, Payment

# Features
 - **Maximum eWallet balance** of RM5000.00 (set by BNM, The Central Bank of Malaysia).
 - Tracking user eWallet **transaction limits**: daily, monthly, annual limit.
 - **Security**: User can only login on one device at the time. Once user login to a new device, old session will be expired and logout. 
 - eWallet PIN secure **password hashing**.
 - Send **welcome email** to new user upon registration using [SendGrid](https://sendgrid.com/).
 - Send **cancellation email** to user upon account has been deleted using [SendGrid](https://sendgrid.com/).

# Future Enhancements
 - **Verify user phone number** before registration (Integrate with [Twilio](https://www.twilio.com/) by sending SMS verification to user phone number).
 - Implement **refund** feature.
 - Implement **settlement** feature for merchant to release funds to merchant based on settlement period.
 - Implement **promotion, rewards & loyalty** related features.
 - Allow user to upload **profile picture**.
 - Enhance **error logging**.

# Playground
You can play around with the mini eWallet system by importing the following files to your [Postman](https://www.getpostman.com/) application.

 - [Node-eWallet-Lite Endpoints Collection](https://drive.google.com/open?id=1X08hvrLSS5mjFgrfXn3ooouXfqz7OdQL)
 - [Dev Environment](https://drive.google.com/open?id=1CYhTi5QQwMDhwtS9qFhWQVIumy-7yTLR)
 - [Prod Environment](https://drive.google.com/open?id=14KtF5g_N8eMsJAsVfbuWe1eGMcUqLX0n)
