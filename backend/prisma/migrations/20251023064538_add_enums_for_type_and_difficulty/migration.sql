-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('reading', 'vocabulary', 'grammar', 'writing');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable: type 컬럼을 enum으로 변환 (데이터 손실 없이)
ALTER TABLE "problems"
  ALTER COLUMN "type" TYPE "ProblemType" USING ("type"::text::"ProblemType");

-- AlterTable: difficulty 컬럼을 enum으로 변환 (데이터 손실 없이)
ALTER TABLE "problems"
  ALTER COLUMN "difficulty" TYPE "Difficulty" USING ("difficulty"::text::"Difficulty");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "problems_type_idx" ON "problems"("type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "problems_difficulty_idx" ON "problems"("difficulty");
