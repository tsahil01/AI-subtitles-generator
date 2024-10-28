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
import { toast } from "@/hooks/use-toast";
import { saveToS3 } from "@/actions/saveToS3";

export function DropZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*,video/*";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        handleFile(target.files[0]);
      }
    };
    input.click();
  }, []);

  const handleFile = (file: File) => {
    console.log("File to upload:", file);
    setUploadedFile(file);
    setOpenDialog(true);
  };

  return (
    <>
      <Card
        className={`cursor-pointer transition-colors max-w-5xl mx-auto ${
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
            Drag and drop your audio and video file here or click to upload.
          </CardDescription>
        </CardContent>
      </Card>

      {uploadedFile && (
        <UploadDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          file={uploadedFile}
        />
      )}
    </>
  );
}

function UploadDialog({
  open,
  onOpenChange,
  file,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: File;
}) {
  const [name, setName] = useState("");
  const [audio, setAudio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!audio || !name) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive"
      })
      return
    };
    onOpenChange(false);

    const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    const sanitizedFileName = `${name.trim().replace(/\s+/g, "_")}.${fileExtension}`;
  
    file = new File([file], sanitizedFileName, { type: file.type });
    console.log("Renamed file:", file);
  
    try {
      const response = await fetch(
        `/api/upload?filename=${sanitizedFileName}&contentType=${file.type}`
      );

      if (!response.ok) {
        console.error("Failed to get pre-signed URL.");
        return;
      }

      const { url, fields } = await response.json(); // Get the pre-signed URL and fields

      console.log("Pre-signed URL:", url);

      const newFormData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        newFormData.append(key, value as string);
      });
      newFormData.append("file", file);

      console.log("Full form data: ", newFormData);

      const uploadResponse = await saveToS3(newFormData, url, name, audio); // Upload the file to S3

      if (uploadResponse) {
        console.log(uploadResponse);
        setMessage("Upload successful!");
        toast({
          title: "Success",
          description: "File uploaded successfully",
          className: "bg-green-300 text-white"
        })

      } else {
        console.error("S3 Upload Error:", uploadResponse);
        setMessage("Upload failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <Dialog open={open}>
      <DialogContent className="border-0">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <CardDescription>Configure your project settings.</CardDescription>
        </DialogHeader>
        <form onSubmit={handleConfirm}>
          <div className="grid w-full items-center gap-4 my-3">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Name of your project"
                onChange={(e) => setName(e.target.value)}
                maxLength={10}
                required = {true}
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
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              onClick={handleConfirm}
              className="w-full mx-auto"
            >
              Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
