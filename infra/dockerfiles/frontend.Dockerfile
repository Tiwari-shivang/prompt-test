FROM node:12 as build

WORKDIR /app

COPY package.json .
COPY . .

RUN npm install 
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
