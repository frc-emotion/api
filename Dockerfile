# NOTE: Environment variables MUST BE SET before deploying.
# use node 20
FROM node:20

# set working directory
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package*.json ./
COPY /src ./src
RUN npm install

# expose port api will run on
EXPOSE 3000

# start api
CMD npm start
