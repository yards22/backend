#!/bin/sh
# This is a comment!
echo Starting to Deploy ....
yarn
npx prisma generate --schema ./src/infra/db/schema.prisma
npx prisma migrate deploy --schema ./src/infra/db/schema.prisma
