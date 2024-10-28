/*
  Warnings:

  - You are about to drop the column `TransactionId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_transactionId_fkey";

-- DropIndex
DROP INDEX "Payment_TransactionId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "TransactionId",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_transactionId_key" ON "File"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Payment"("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE;
