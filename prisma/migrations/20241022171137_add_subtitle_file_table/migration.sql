-- CreateEnum
CREATE TYPE "transactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "SubtitlesFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "transcriptionJobName" TEXT NOT NULL,
    "transcriptionStatus" "transactionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SubtitlesFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubtitlesFile" ADD CONSTRAINT "SubtitlesFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
