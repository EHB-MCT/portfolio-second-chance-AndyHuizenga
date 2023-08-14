

#FROM node:latest 

#WORKDIR /usr/src/app

#COPY package*.json .

# Clear npm cache
#RUN npm cache clean --force

#RUN npm install --quiet

#COPY ./ ./


#CMD ["node", "app.js"]



FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY images/api/package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY images/api/src ./src

EXPOSE 3000
CMD [ "node", "src/app.js" ]

