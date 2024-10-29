"use server";

import prisma from '@/lib/db';
// const AWS = require('aws-sdk');
import TranscribeService from 'aws-sdk/clients/transcribeservice';

const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const transcribeService = new TranscribeService({
  region: `${process.env.AWS_REGION}`,
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

export async function processFile(fileNamePath: string, fileDbId: string) {
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
    LanguageCode: 'en-IN',
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
    await transcribeService.startTranscriptionJob(params).promise();
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
  const params = {
    TranscriptionJobName: jobName,
  };

  while (true) {
    const data = await transcribeService.getTranscriptionJob(params).promise() as any;
    const jobStatus = data.TranscriptionJob.TranscriptionJobStatus;

    console.log(`Transcription job status: ${jobStatus}`);

    if (jobStatus === 'COMPLETED') {
      console.log("Transcription job completed.");
      await prisma.subtitlesFile.update({
        where: {
          transcriptionJobName: jobName
        },
        data: {
          transcriptionStatus: 'SUCCESS',
        }
      })

      // Get the transcript file URI
      const transcriptFileUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
      console.log("Transcript file URI:", transcriptFileUri);
      return true;

    } else if (jobStatus === 'FAILED') {
      console.error("Transcription job failed:", data.TranscriptionJob.FailureReason);
      return false;
    }

    // Wait before checking again (5 seconds interval)
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
};
