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

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test migratecreate seed genprivatekey genpublickey err test_fail


# -v ${PWD}/../dbdata:/var/lib/mysql