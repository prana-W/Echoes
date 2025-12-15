FROM node:20-alpine

WORKDIR /app

ENV TZ=Asia/Kolkata
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "run", "start"]
