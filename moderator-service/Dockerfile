FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./ ./

EXPOSE 4004

CMD ["npm", "run", "dev"]