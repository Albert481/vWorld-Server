FROM node
LABEL authors="Albert Yu"
# update dependencies and install curl
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Create app directory
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./ \
#     ./source ./

# This will copy everything from the source path
# --more of a convenience when testing locally.
COPY . .
# update each dependency in package.json to the latest version
RUN npm install -g npm-check-updates \
    ncu -u \
    npm install update \
    npm audit fix --force \
    npm install
# If you are building your code for production
RUN npm ci --only=production
# Bundle app source
COPY . /app
EXPOSE 5050
CMD [ "index.js" ]