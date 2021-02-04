FROM node:alpine
WORKDIR /usr/express
COPY package.json .
RUN npm install
COPY . .
RUN tsc
CMD ["node", "./dist/server.js"]
