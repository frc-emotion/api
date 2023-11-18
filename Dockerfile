# NOTE: Environment variables MUST BE SET before deploying.
# use node 20
FROM node:20

# set working directory
WORKDIR /src

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# expose port api will run on
EXPOSE 3000

# start api
CMD npm start
