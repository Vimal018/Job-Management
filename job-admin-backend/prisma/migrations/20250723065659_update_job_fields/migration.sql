/*
  Warnings:

  - You are about to drop the column `experience` on the `Job` table. All the data in the column will be lost.
  - Added the required column `applicationDeadline` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salaryRange` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "experience",
ADD COLUMN     "applicationDeadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "salaryRange" TEXT NOT NULL;
