/*
  Warnings:

  - A unique constraint covering the columns `[transcriptionJobName]` on the table `SubtitlesFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SubtitlesFile_transcriptionJobName_key" ON "SubtitlesFile"("transcriptionJobName");
