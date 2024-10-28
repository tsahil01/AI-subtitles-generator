/*
  Warnings:

  - The `transcriptionStatus` column on the `SubtitlesFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `premium` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[TransactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `TransactionId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TransactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "transcriptionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "TransactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "TransactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubtitlesFile" DROP COLUMN "transcriptionStatus",
ADD COLUMN     "transcriptionStatus" "transcriptionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "premium";

-- DropEnum
DROP TYPE "transactionStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Payment_TransactionId_key" ON "Payment"("TransactionId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_TransactionId_fkey" FOREIGN KEY ("TransactionId") REFERENCES "Payment"("TransactionId") ON DELETE RESTRICT ON UPDATE CASCADE;
