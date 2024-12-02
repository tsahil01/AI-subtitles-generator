"use server";

import prisma from '@/lib/db';
import { LanguageCodeEnum } from '@/lib/types';
import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;
const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET;

const transcribeService = new TranscribeClient({
  region: `${region}`,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  }
});

export async function subtitleDBCall(fileNamePath: string, fileDbId: string, status?: string) {
  const user = fileNamePath.split('/')[0];
  const jobName = user + '-' + Date.now();
  const OutputFilePath = fileNamePath.split('/').slice(0, 2).join('-');
  const outputFolder = `transcription-results/${OutputFilePath}/`;
  try {
    const saveTranscription = await prisma.subtitlesFile.create({
      data: {
        name: OutputFilePath,
        url: `${CLOUDFRONT_URL}/${outputFolder}${jobName}`,
        fileId: fileDbId,
        transcriptionJobName: jobName,
      }
    })
    if (!saveTranscription) {
      console.error("Failed to save transcription to database");
      return false;
    }
    console.log("Pending Transcription saved to database: ", saveTranscription);
    return true;
  } catch (error) {
    console.error("Transcription job error:", error);
    return false;
  }

}

export async function processFile(fileNamePath: string, fileDbId: string, language?: LanguageCodeEnum) {
  const user = fileNamePath.split('/')[0];
  const jobName = user + '-' + Date.now();

  const mediaFormat = fileNamePath.split('.').pop();
  const OutputFilePath = fileNamePath.split('/').slice(0, 2).join('-');
  const outputFolder = `transcription-results/${OutputFilePath}/`;

  console.log("User:", user);
  console.log("Job name:", jobName);
  console.log("Media format:", mediaFormat);
  console.log("Output file path:", OutputFilePath);
  console.log("Output folder:", outputFolder);

  const params = {
    TranscriptionJobName: jobName,
    // english language code
    LanguageCode: language,
    MediaFormat: mediaFormat,
    Media: {
      MediaFileUri: `s3://${S3_BUCKET}/${fileNamePath}`,
    },
    OutputBucketName: S3_BUCKET,
    OutputKey: outputFolder + jobName + ".json",

    Settings: {
      ChannelIdentification: false,
      MaxSpeakerLabels: 4,
      ShowAlternatives: false,
      ShowSpeakerLabels: true,
    },
    Subtitles: {
      Formats: ['srt', 'vtt'],
    },
  };

  try {
    // @ts-ignore
    const command = new StartTranscriptionJobCommand(params);

    await transcribeService.send(command);
    console.log(`Started transcription job: ${jobName}`);

    // do db update here
    const saveTranscription = await prisma.subtitlesFile.update({
      where: {
        fileId: fileDbId
      },
      data: {
        name: OutputFilePath,
        url: `${CLOUDFRONT_URL}/${outputFolder}${jobName}`,
        fileId: fileDbId,
        transcriptionJobName: jobName,
        transcriptionStatus: 'IN_PROGRESS',
      }
    })

    if (!saveTranscription) {
      console.error("Failed to save transcription to database");
      return false;
    }
    console.log("Transcription saved to database: ", saveTranscription);
    await checkTranscriptionJob(jobName);
  } catch (error) {
    console.error("Transcription job error:", error);
  }
};

export const checkTranscriptionJob = async (jobName: string) => {
  const params = { TranscriptionJobName: jobName };
  const pollInterval = 3000; // Poll every 5 seconds

  while (true) {
    const command = new GetTranscriptionJobCommand(params);
    const data = await transcribeService.send(command);
    if (!data.TranscriptionJob) {
      console.error("Transcription job data is undefined");
      return { status: 'FAILED' };
    }

    const jobStatus = data.TranscriptionJob.TranscriptionJobStatus;
    console.log("Transcription job status:", jobStatus);

    if (jobStatus === 'COMPLETED') {
      await prisma.subtitlesFile.update({
        where: { transcriptionJobName: jobName },
        data: { transcriptionStatus: 'SUCCESS' },
      });

      // Get the transcript file URI
      const transcriptFileUri = data.TranscriptionJob.Transcript?.TranscriptFileUri;
      console.log("Transcript file URI:", transcriptFileUri);

      return { status: 'COMPLETED', uri: transcriptFileUri };
    } else if (jobStatus === 'FAILED') {
      console.error("Transcription job failed:", data.TranscriptionJob.FailureReason);
      await prisma.subtitlesFile.update({
        where: { transcriptionJobName: jobName },
        data: { transcriptionStatus: 'FAILED' },
      });
      return { status: 'FAILED' };
    }

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
};

