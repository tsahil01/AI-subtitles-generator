import { Loader2, UploadCloudIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useCallback, useEffect, useState } from "react";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { saveToS3 } from "@/actions/saveToS3";
import { doTransaction } from "@/actions/doTransaction";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

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
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [audio, setAudio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { connection } = useConnection();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audio || !name) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        variant: "destructive",
      });
      return;
    }
    onOpenChange(false);

    const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
    const sanitizedFileName = `${name
      .trim()
      .replace(/\s+/g, "_")}.${fileExtension}`;

    file = new File([file], sanitizedFileName, { type: file.type });
    console.log("Renamed file:", file);

    try {
      setUploading(true);
      setIsDrawerOpen(true);
      setMessage("Starting upload process...");

      const response = await fetch(
        `/api/upload?filename=${sanitizedFileName}&contentType=${file.type}`
      );

      if (!response.ok) {
        throw new Error("Failed to get pre-signed URL.");
      }

      const { url, fields } = await response.json();
      console.log("Pre-signed URL:", url);

      const newFormData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        newFormData.append(key, value as string);
      });
      newFormData.append("file", file);
      console.log("Full form data: ", newFormData);

      if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
      }

      setMessage("Starting transaction...");
      toast({
        title: "Transaction",
        description: "Transaction starting....",
      });

      const sentTo = process.env.NEXT_PUBLIC_OWNER_SOL_ADDRESS;
      if (!sentTo) {
        throw new Error("Owner address not found");
      }

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(sentTo),
          lamports: 0 * LAMPORTS_PER_SOL, // currently 0 for first 100 users
        })
      );

      const txnID = await wallet.sendTransaction(transaction, connection);
      if (!txnID) {
        toast({
          title: "Transaction Error",
          description: "Failed to send transaction",
          variant: "destructive",
        });
        setMessage("Transaction failed.");
        throw new Error("Failed to send transaction");
      }
      console.log(txnID);
      toast({
        title: "Transaction Success",
        description: `Tx: ${txnID}`,
      });
      setMessage("Transaction successful. Processing...");

      const halfTnx = await doTransaction(0.5, txnID);
      if (!halfTnx) {
        throw new Error("Failed to do half transaction");
      }
      console.log("Half transaction done: ", halfTnx);

      setMessage("Uploading file to S3...");
      console.log("Uploading file to S3 initiated...");
      const uploadResponse = await saveToS3(
        newFormData,
        url,
        name,
        audio,
        txnID
      );
      console.log("Outside saveToS3...");
      console.log("Upload response: ", uploadResponse);
      
      if (uploadResponse) {
        console.log(uploadResponse);
        setMessage("Upload successful!");
        setMessage("");
        toast({
          title: "Success",
          description: "File uploaded successfully",
        });
        // Update the dashboard by refreshing the page
        window.location.reload();
      } else {
        console.error("S3 Upload Error:", uploadResponse);
        setMessage("Upload failed.");
        toast({
          title: "Error",
          description: "File upload failed",
          variant: "destructive",
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred during upload.");
      setMessage("");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setIsDrawerOpen(false);
        setMessage("");
      }, 3000);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  required={true}
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
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="kannada">Kannada</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                    <SelectItem value="bengali">Bengali</SelectItem>
                    <SelectItem value="gujarati">Gujarati</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                    <SelectItem value="punjabi">Punjabi</SelectItem>
                    <SelectItem value="urdu">Urdu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="submit"
                className="w-full mx-auto"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onClose={() => window.location.reload()}
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-center md:text-3xl text-xl">
                Upload Progress
              </DrawerTitle>
              <DrawerDescription className="text-center">
                {message || "Processing your upload..."}
              </DrawerDescription>
            <div className="pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
            </DrawerHeader>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DropZone;
