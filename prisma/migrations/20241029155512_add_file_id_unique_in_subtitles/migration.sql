/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `SubtitlesFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubtitlesFile_fileId_key" ON "SubtitlesFile"("fileId");
