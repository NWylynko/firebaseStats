FROM node:13

WORKDIR /var/www/firebaseStats
COPY package.json yarn.lock ./
RUN yarn

COPY . .

CMD node index.js

EXPOSE 3000