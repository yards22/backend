-- CreateTable
CREATE TABLE "services" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" BIGINT NOT NULL DEFAULT extract(epoch FROM now()),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);
