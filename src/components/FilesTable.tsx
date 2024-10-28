"use client"

import { useRecoilState } from "recoil"
import {
  Download,
  Trash2,
  Play,
  ExternalLink,
  FileAudio,
  FileVideo,
  FileText,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, File, SubtitlesFile } from "@/lib/types"
import { userAtom } from "@/atoms/userAtom/userAtom"

export default function FilesTable() {
  const [user, setUser] = useRecoilState<User | null>(userAtom)

  if (!user) return null

  const onDelete = (fileId: string) => {
    setUser((prevUser) => {
      if (!prevUser) return null
      return {
        ...prevUser,
        files: prevUser.files.filter((file) => file.id !== fileId),
      }
    })
    console.log(`File with ID ${fileId} deleted.`)
  }

  const onStartTranscription = (fileId: string) => {
    console.log(`Transcription started for file with ID ${fileId}.`)
    setUser((prevUser) => {
      if (!prevUser) return null
      return {
        ...prevUser,
        files: prevUser.files.map((file) =>
          file.id === fileId
            ? {
                ...file,
                subtitles: [
                  ...file.subtitles,
                  {
                    id: `temp-${Date.now()}`,
                    name: `${file.name}-subtitles`,
                    url: "",
                    transcriptionJobName: `job-${file.id}`,
                    transcriptionStatus: "IN_PROGRESS",
                  },
                ],
              }
            : file
        ),
      }
    })
  }

  const onDownload = (fileId: string) => {
    console.log(`Download started for file with ID ${fileId}.`)
    // Add your download logic here
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "audio/mpeg":
      case "audio/wav":
        return <FileAudio className="h-5 w-5" />
      case "video/mp4":
        return <FileVideo className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "FAILED":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableCaption>A list of your files with actions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Transcribe</TableHead>
            <TableHead>Delete</TableHead>
            <TableHead>Transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.files.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span className="capitalize">{file.type}</span>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(
                  file.subtitles[0]?.transcriptionStatus || "PENDING"
                )}
              </TableCell>
              <TableCell>
                {!file.subtitles.length ||
                file.subtitles[0]?.transcriptionStatus === "PENDING" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => onStartTranscription(file.id)}
                  >
                    <Play className="h-4 w-4" />
                    Start Transcription
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => onDownload(file.id)}
                  >
                    <Download className="h-4 w-4" />
                    Start Download
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onDelete(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open transaction details</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}