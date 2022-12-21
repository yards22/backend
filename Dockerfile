FROM node:14
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY src/infra/db/schema.prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma
RUN npx prisma generate
RUN npm run build
RUN npm prune --production
COPY .env ./
EXPOSE 4000
CMD ["node","dist/cmd/http_api/main.js"]
