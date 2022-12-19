#!/bin/sh
# This is a comment!
echo Starting to Deploy ....
npm install
mkdir dist
npx prisma generate --schema ./src/infra/db/schema.prisma
npx prisma migrate deploy --schema ./src/infra/db/schema.prisma
npm run build