FROM node:alpine
WORKDIR /usr/express
COPY package.json .
RUN npm install\
    && npm i -g typescript
COPY . .
RUN tsc ./src/main.ts
CMD ["node", "./dist/main.js"]
