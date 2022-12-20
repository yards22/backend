remove_mysql:
	docker rm -f node_mysql

create_mysql:
	docker run --name node_mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mypassword -v ${PWD}/../dbdata:/var/lib/mysql -d mysql:8

create_db:
	docker exec -i node_mysql mysql -u root -pmypassword <<< 'create database node_app_db'

create_redis:
	docker run --name node_redis -p 6379:6379 -d redis

remove_redis:
	docker rm -f node_redis	

restart_deps:
	docker start node_mysql
	docker start node_redis

pmu:
	npx prisma migrate dev -n init --schema ./src/infra/db/schema.prisma
pgen:
	npx prisma generate --schema ./src/infra/db/schema.prisma
omg:
	rm -rf ./src/infra/db/migrations/*
	make pmu
di:
	docker build -t 22_yards_nodejs_app .
rdi:
	docker rm 22_yards_nodejs_app_container
	docker run -d -it -p 4000:4000 --name=22_yards_nodejs_app_container 22_yards_nodejs_app
.PHONY: postgres createdb dropdb migrateup migratedown sqlc test migratecreate seed genprivatekey genpublickey err test_fail


# -v ${PWD}/../dbdata:/var/lib/mysql