FROM node:latest 

WORKDIR /usr/app

COPY package*.json .

# Clear npm cache
RUN npm cache clean --force

RUN npm install --quiet

COPY ./ ./

CMD ["node", "app.js"]