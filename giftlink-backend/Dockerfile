FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3060

EXPOSE 3060

CMD ["node", "util/import-mongo/index.js"]

