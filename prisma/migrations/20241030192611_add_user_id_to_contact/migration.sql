/*
  Warnings:

  - Added the required column `userId` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
