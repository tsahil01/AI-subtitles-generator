/*
  Warnings:

  - You are about to drop the column `TransactionId` on the `File` table. All the data in the column will be lost.
  - Added the required column `transactionId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_TransactionId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "TransactionId",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Payment"("TransactionId") ON DELETE RESTRICT ON UPDATE CASCADE;
