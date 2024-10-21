"use server";

const AWS = require('aws-sdk');

const S3_BUCKET = process.env.AWS_BUCKET_NAME;
const transcribeService = new AWS.TranscribeService({
    region: `${process.env.AWS_REGION}`,
});

export async function processFile(fileNamePath: string) {
    const jobName = fileNamePath.replace(/\//g, '_') + '-' + Date.now();
    
    const mediaFormat = fileNamePath.split('.').pop(); 
    const OutputFilePath = fileNamePath.split('/').slice(0, 2).join('/');
    const outputFolder = `transcription-results/${OutputFilePath}/`;

    const params = {
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US',
        MediaFormat: mediaFormat,
        Media: {
            MediaFileUri: `s3://${S3_BUCKET}/${fileNamePath}`, 
        },
        OutputBucketName: S3_BUCKET, 
        OutputKey: outputFolder + jobName + ".json"
    };

    try {
        await transcribeService.startTranscriptionJob(params).promise();
        console.log(`Started transcription job: ${jobName}`);

        await checkTranscriptionJob(jobName);
    } catch (error) {
        console.error("Transcription job error:", error);
    }
};

const checkTranscriptionJob = async (jobName: string) => {
    const params = {
      TranscriptionJobName: jobName,
    };
  
    while (true) {
      const data = await transcribeService.getTranscriptionJob(params).promise();
      const jobStatus = data.TranscriptionJob.TranscriptionJobStatus;
  
      console.log(`Transcription job status: ${jobStatus}`);
  
      if (jobStatus === 'COMPLETED') {
        console.log("Transcription job completed.");
  
        // Get the transcript file URI
        const transcriptFileUri = data.TranscriptionJob.Transcript.TranscriptFileUri;
  
        // Process the transcript (e.g., save to S3 or other actions)
        break;
      } else if (jobStatus === 'FAILED') {
        console.error("Transcription job failed:", data.TranscriptionJob.FailureReason);
        break;
      }
  
      // Wait before checking again (5 seconds interval)
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
};
