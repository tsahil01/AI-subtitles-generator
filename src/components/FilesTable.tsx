"use client";

import { useRecoilState } from "recoil";
import {
  Download,
  Trash2,
  Play,
  ExternalLink,
  FileAudio,
  FileVideo,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, File as FileType } from "@/lib/types";
import { userAtom } from "@/atoms/userAtom/userAtom";
import { checkTranscriptionJob, processFile } from "@/actions/transcriptionJob";
import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "@/hooks/use-toast";

export default function FilesTable() {
  const [user, setUser] = useRecoilState<User | null>(userAtom);
  const [checking, setChecking] = useState(false);

  if (!user) return null;

  const onDelete = (fileId: string) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        files: prevUser.files.filter((file) => file.id !== fileId),
        // TODO: DO A DB AND S3 DELETE CALL HERE...
      };
    });
    console.log(`File with ID ${fileId} deleted.`);
  };

  const onStartTranscription = async (fileId: string) => {
    console.log(`Transcription started for file with ID ${fileId}.`);
    let currentFile: FileType | undefined = user.files.find(
      (file) => file.id === fileId
    );
    console.log("Current file: ", currentFile);

    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        files: prevUser.files.map((file) => {
          if (file.id === fileId) {
            return {
              ...file,
              subtitles: [
                {
                  id: file.subtitles[0]?.id || "",
                  name: file.subtitles[0]?.name || "",
                  url: file.subtitles[0]?.url || "",
                  fileId: file.id,
                  transcriptionJobName:
                    file.subtitles[0]?.transcriptionJobName || "",
                  transcriptionStatus: "IN_PROGRESS",
                  transcription: "",
                },
              ],
            };
          }
          return file;
        }),
      };
    });

    await processFile(currentFile?.key || "", currentFile?.id || "");
    console.log("Transcription job set to IN_PROGRESS");
  };

  const checkTranscriptionStatus = async (fileId: string) => {
    const jobName =
      user.files.find((file) => file.id === fileId)?.subtitles[0]
        ?.transcriptionJobName || "";
    if (!jobName) return;

    // Make a single call to the backend; backend handles the polling
    try {
      console.log("Checking transcription status for job:", jobName);
      const response = await checkTranscriptionJob(jobName);
      console.log("Transcription status response:", response);
      if (response.status === "COMPLETED") {
        setUser((prevUser) => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            files: prevUser.files.map((file) => {
              if (file.id === fileId) {
                return {
                  ...file,
                  subtitles: [
                    {
                      ...file.subtitles[0],
                      transcriptionStatus: "SUCCESS",
                      transcription: "This is a test transcription",
                      url: response.uri, // Transcript file URI
                    },
                  ],
                };
              }
              return file;
            }),
          };
        });
      } else if (response.status === "FAILED") {
        console.error("Transcription job failed.");
        // Optionally update the UI to indicate failure
      }
    } catch (error) {
      console.error("Error checking transcription status:", error);
      // Handle any error that occurs during the request
    }
  };

  const onDownload = async (fileId: string) => {
    const file = user.files.find((file) => file.id === fileId);
    const subtitle = file?.subtitles[0];
    const url = subtitle?.url;
    if (!url) return;

    console.log(`Download started for file ${file?.name}.`);
    toast({
      title: "Downloading...",
      description: "Your download will start shortly.",
    });
    console.log("URL: ", url);

    const srtUrl = `${url}.srt`;
    const vttUrl = `${url}.vtt`;
    const jsonUrl = `${url}.json`;

    try {
      const zip = new JSZip();

      // Fetch and add SRT
      const srtContent = await fetch(srtUrl).then((res) => res.text());
      zip.file(`${fileId}.srt`, srtContent);

      // Fetch and add VTT
      const vttContent = await fetch(vttUrl).then((res) => res.text());
      zip.file(`${fileId}.vtt`, vttContent);

      // Fetch and add JSON
      const jsonContent = await fetch(jsonUrl).then((res) => res.text());
      zip.file(`${fileId}.json`, jsonContent);

      // Generate the ZIP and trigger download
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${file?.name}_subtitles.zip`);

      console.log("Download complete.");
    } catch (error) {
      console.error("Failed to download files", error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "audio/mpeg":
      case "audio/wav":
        return <FileAudio className="h-5 w-5" />;
      case "video/mp4":
        return <FileVideo className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (
    status: "SUCCESS" | "FAILED" | "IN_PROGRESS" | "PENDING"
  ) => {
    const statusMap = {
      SUCCESS: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return (
      <Badge className={statusMap[status] || statusMap.PENDING}>
        {status === "IN_PROGRESS" ? "IN PROGRESS" : status}
      </Badge>
    );
  };

  return (
    <div className="container p-5 h-full w-auto">
      <Table>
        <TableCaption className="text-xs">
          Refresh the page to see the updated status of the transcription job.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">File Name</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Language</TableHead>
            <TableHead className="text-center">Uploaded at</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Transcribe</TableHead>
            <TableHead className="text-center">Delete</TableHead>
            <TableHead className="text-center">Transaction</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {user.files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium text-center">
                {file.name}
              </TableCell>
              <TableCell className="font-medium text-center capitalize">
                {file.audioLanguage}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  {getFileIcon(file.type)}
                  <span className="capitalize">{file.type.split("/")[0]}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium text-center">
                {file.updatedAt.split("T")[0]}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(
                  file.subtitles.length
                    ? (file.subtitles[0].transcriptionStatus as
                        | "SUCCESS"
                        | "FAILED"
                        | "IN_PROGRESS"
                        | "PENDING")
                    : "PENDING"
                )}
              </TableCell>

              <TableCell className="flex justify-center">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={checking}
                  onClick={() => {
                    if (
                      file.subtitles.length === 0 ||
                      file.subtitles[0]?.transcriptionStatus === "PENDING"
                    ) {
                      onStartTranscription(file.id);
                    } else if (
                      file.subtitles[0]?.transcriptionStatus === "IN_PROGRESS"
                    ) {
                      checkTranscriptionStatus(file.id);
                      setChecking(true);
                    } else {
                      onDownload(file.id);
                    }
                  }}
                >
                  {checking ? (
                    <span>Checking...</span>
                  ) : file.subtitles.length === 0 ||
                    file.subtitles[0]?.transcriptionStatus === "PENDING" ? (
                    <>
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Transcribe</span>
                    </>
                  ) : file.subtitles[0]?.transcriptionStatus ===
                    "IN_PROGRESS" ? (
                    <span>Check Status</span>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </>
                  )}
                </Button>
              </TableCell>

              <TableCell>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 mx-auto flex justify-center"
                  onClick={() => onDelete(file.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>

              <TableCell className="flex justify-center">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0 flex justify-center"
                  onClick={() =>
                    window.open(
                      `https://explorer.solana.com/tx/${file.transactionId}?cluster=devnet`
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open transaction details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
