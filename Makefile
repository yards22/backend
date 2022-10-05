remove_pg:
	docker rm -f node_postgres

create_postgres:
	docker run --name node_postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=mypassword -v ${PWD}/../dbdata:/var/lib/postgresql/data -d postgres:12-alpine

create_pg_db:
	docker exec -it node_postgres createdb --username=root --owner=root node_app_db

remove_ms:
	docker rm -f node_mysql

create_mysql:
	docker run --name node_mysql -p 3456:3306 -e MYSQL_ROOT_PASSWORD=mypassword -v ${PWD}/../dbdata:/var/lib/mysql -d mysql:8

create_ms_db:
	docker exec -i node_mysql mysql -u root -pmypassword <<< 'create database node_app_db'

redis:
	docker rm -f node_redis
	docker run --name node_redis -p 6379:6379 -d redis
	
pmu:
	npx prisma migrate dev -n init --schema ./src/infra/db/schema.prisma
pgen:
	npx prisma generate --schema ./src/infra/db/schema.prisma
omg:
	rm -rf ./src/infra/db/migrations/*
	make pmu

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test migratecreate seed genprivatekey genpublickey err test_fail