#!/bin/sh
# This is a comment!
echo Local Setup ....
docker rm -f node_mysql
docker run --name node_mysql -p 3456:3306 -e MYSQL_ROOT_PASSWORD=mypassword -d mysql:8  
docker rm -f node_redis	
docker run --name node_redis -p 6379:6379 -d redis
# sleep 20
# npx prisma migrate dev -n init --schema ./src/infra/db/schema.prisma


