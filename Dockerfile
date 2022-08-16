FROM node:14-alpine
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install --production=false; \
    else npm install --only=production; \ 
    fi

COPY . .
EXPOSE 3000
CMD ["node","app.js"]
