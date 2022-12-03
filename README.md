# ![Header Image](docs/assets/header.png)

This repository contains the backend code for the Team 2658 [Scouting App](https://github.com/frc-emotion/scouting-frontend). It is built using [express.js](https://expressjs.com) and [mongoose](https://mongoosejs.com/), with a [MongoDB](https://mongodb.com) database.

## Contribution Guidelines

As a reminder before contributing to this repository, please keep in mind that multiple people may be contributing to the repository at the same time. The best practice to allow for maximum collaboration and productivity in the project is to create a new branch for each feature or change that is made. This allows the entire team to review the code through pull requests and code reviews before it is pushed to the master branch, where a breaking change may be automatically deployed.

## Get Started

This guide will teach you how to clone the repository and start a development server on your local machine.

### Prerequisites

Please ensure that you have installed [node.js](https://nodejs.org/en/) and [git](https://git-scm.com/downloads). The Node installer will automatically install NPM for you.

To check if you already have node and npm installed, open a terminal window and run `node -v` and `npm -v`.

To check for a git installation, open a new terminal window and run `git -v`. If you have these programs installed, a version number will print out in your terminal.

You will also need access ot the MongoDB Atlas Organization. If you don't have this, or you are unsure, go to a lead for help.

### Clone the Repository

In your terminal, navigate to where you would like to clone the repository. Run `git clone https://github.com/frc-emotion/scouting-backend.git` to clone the repository.

To navigate to the newly cloned repository in your terminal use `cd scouting-backend`.

### Install Dependencies

Before we run the server, we have to install its dependencies and libraries. In a terminal, run ```npm i```.

### Create Environment Variables

The server requires four environment variables in order to run properly. To store these, create a new file in the root folder of the repository named `.env`. To edit this, open the .env file in a text editor, such as Visual Studio Code.

#### Environment

The first three environment variables are very straightforward, you can copy and paste these.

```shell
NODE_ENV = development
PORT = 5000
API_URL = /api/v1
```

**NODE_ENV** sets the environment you are in. You must be in the development environment in order to receive error messages that are logged to the console.

**PORT** sets the port that the server will run on in your local machine. While it is set to default to port 5000, it is better to set the variable here so we can easily change it if we have to.

**API_URL** sets the url under the domain that the api will run under. The app will see any request made to this path under the domain, but not one made to `[domain]/store`, for example.

#### The Blue Alliance API

You will need an API Key to access data from [The Blue Alliance](https://www.thebluealliance.com/). The TBA API is directly used in the backend, so make sure you generate an API Key and add it to your environment variables. If you don't know how to do this, you can find a guide [here](https://www.thebluealliance.com/apidocs#:~:text=api/v3.-,Authentication,by%20simply%20navigating%20to%20an%20API%20URL%20in%20your%20web%20browser,-Caching).

```shell
TBA_KEY = <key>
```

Replace **\<key>** with the key you generated from **The Blue Alliance**.

#### Database Access

The last environment variable is used to connect to the MongoDB Database. This example will teach you how to connect to the development database.

First, log in to MongoDB Atlas. Select the **team2658** organization and navigate to the **scouting** project.

![MongoDB Project Selection](docs/assets/mongo-select-project.png)

Under the scouting project, navigate to the **Network Access** tab.

![MongoDB Network Access Tab](docs/assets/network-1.png)

Under the Network Access tab, click on **Add IP Address**.

![MongoDB Add IP Address](docs/assets/network-2.png)

Enter your IP Address into the Access List entry field, and your name into the comments field so that we know who the IP Address belongs to and don't accidentally remove your access. Ensure that you do **not** set your IP Access to temporary.

To find your IP Address, navigate to [whatismyip.com](https://www.whatismyip.com/). Copy and paste your **Public IPv4 Address**  into the prompt.

![MongoDB Enter IP Address](docs/assets/network-3.png)

---

Next, you will need to get a username and password in order to access the database. On the sidebar, select **Database Access**.

![MongoDB Database Access Tab](docs/assets/access-1.png)

Under the Database Access tab, click on **Add Database User**.

![MongoDB Add Database User](docs/assets/access-2.png)

Create a username and password for your account. Make sure to write it down or save it in a password manager so that you have access to it, as you will need it every time you need to connect to the database.

![MongoDB Create Database Access Account](docs/assets/access-3.png)

Give the user read and write permissions to the database. Then click **Add User** to save your changes.

![MongoDB User Permissions](docs/assets/access-4.png)

#### Database Connection

Finally, we need to connect our express app to the database. In the **.env** file, add the variable below, replacing **[username]** and **[password]** with the username and password associated with the database account you just created.

```shell
MONGO_URI = "mongodb+srv://[username]:[password]@development.hh3ieam.mongodb.net/games?retryWrites=true&w=majority"
```

### Run Server

To run the server in a development environment, run `npm run dev` in a terminal window. This command runs your server in nodemon, and it will continue to refresh as you make changes to the files.

If you'd like to run the server without nodemon, run `npm run start`. Note that the server will not refresh automatically

## Next Steps

You're now ready to help contribute to the server-side half of the project! Remember to abide by the contribution guidelines and create a new branch before pushing new commits.
