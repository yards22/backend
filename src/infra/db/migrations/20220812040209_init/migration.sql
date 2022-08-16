-- AlterTable
ALTER TABLE "services" ALTER COLUMN "created_at" SET DEFAULT extract(epoch FROM now());
