

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

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]