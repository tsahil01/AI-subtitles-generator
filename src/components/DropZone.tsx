import { UploadCloudIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const onClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = "audio/*,video/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        handleFiles(files);
      }
    };
    input.click();
  }, []);

  const handleFiles = (files: File[]) => {
    console.log("Files to upload:", files);
    setUploadedFiles(files);
    setOpenDialog(true);
  };

  return (
    <>
      <Card
        className={`cursor-pointer transition-colors ${
          isDragging ? "border-primary" : "border-border"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onClick}
      >
        <CardContent className="flex flex-col justify-center items-center mx-auto w-full md:h-[400px] h-[200px]">
          <UploadCloudIcon className="h-16 w-16 text-muted-foreground" />
          <CardTitle className="text-lg font-medium mt-4">Upload now</CardTitle>
          <CardDescription className="text-center text-primary/70 mt-2">
            Drag and drop your audio and video files here or click to upload.
          </CardDescription>
        </CardContent>
      </Card>
      <UploadDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        files={uploadedFiles}
      />
    </>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  files,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: File[];
}) {
  const [name, setName] = useState("");
  const [audio, setAudio] = useState("");

  const handleConfirm = () => {
    onOpenChange(false);
    // get data from the form like this -
    const formData = new FormData();
    formData.append("name", name);
    formData.append("audio", audio);
    formData.append("file", files[0]);
    console.log("Form data:", {
      name: formData.get("name"),
      audio: formData.get("audio"),
      file: formData.get("file"),
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="border-0">
        {/* <Card className="border-0"> */}
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <CardDescription>Configure your project settings.</CardDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="audio">Audio Language</Label>
              <Select onValueChange={(val) => setAudio(val)}>
                <SelectTrigger id="audio">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="japaneses">Japanese</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter className="flex justify-between">
          <Button
            onClick={() => {
              handleConfirm();
            }}
            className="w-full mx-auto"
          >
            Upload
          </Button>
        </DialogFooter>
        {/* </Card> */}
      </DialogContent>
    </Dialog>
  );
}
