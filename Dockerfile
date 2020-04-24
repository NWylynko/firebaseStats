FROM node:14-alpine

WORKDIR /var/www/firebaseStats
COPY package.json yarn.lock ./
RUN yarn

COPY . .

CMD node index.js

EXPOSE 5000