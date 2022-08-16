postgres:
	docker rm -f node_postgres
	docker run --name node_postgres -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=mypassword -v ${PWD}/../dbdata:/var/lib/postgresql/data -d postgres:12-alpine

createdb:
	docker exec -it node_postgres createdb --username=root --owner=root node_app_db

dropdb:
	docker exec -it node_postgres dropdb node_app_db

migratecreate:
	migrate create -ext sql -dir db/migrations -seq init

migrateup:
	migrate -path db/migrations -database "postgresql://root:mypassword@localhost:5432/node_app_db?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://root:mypassword@localhost:5432/node_app_db?sslmode=disable" -verbose down

redis:
	docker rm -f node_redis
	docker run --name node_redis -p 6379:6379 -d redis

dbreset:
	make migratedown
	make migrateup
pmu:
	npx prisma migrate dev -n init --schema ./src/infra/db/schema.prisma
pgen:
	npx prisma generate --schema ./src/infra/db/schema.prisma

.PHONY: postgres createdb dropdb migrateup migratedown sqlc test migratecreate seed genprivatekey genpublickey err test_fail