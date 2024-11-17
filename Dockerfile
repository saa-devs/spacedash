FROM node:20-alpine

WORKDIR /app

COPY . .

COPY package*.json ./

RUN npm install

RUN npm run build

EXPOSE 5100

CMD ["npm", "start"]
