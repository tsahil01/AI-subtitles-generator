import React, { useCallback, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BadgeDollarSign,
  Clock3Icon,
  UploadCloudIcon,
  User,
  Video,
} from "lucide-react";
import { DropZone } from "./DropZone";
import FilesTable from "./FilesTable";

export function DashboardMain() {
  return (
    <main className="flex flex-col mx-auto container gap-8 p-5">
      <div className="flex flex-col">
        <h2 className="md:text-5xl text-4xl font-bold">Dashboard</h2>
        <p className="md:text-sm text-xs text-primary/70">
          Welcome to your dashboard. Here you can see all your data and manage
          your account.
        </p>
      </div>
      <div className="grid md:grid-cols-4 md:gap-7 gap-4 my-3">
        <TopCard title="Total Projects" Icon={Video} content="54" />
        <TopCard title="Minutes Processed" Icon={Clock3Icon} content="257" />
        <TopCard title="SOL spent" Icon={BadgeDollarSign} content="56.8 SOL" />
      </div>
      <DropZone />

      <div className="flex flex-col">
        <h2 className="md:text-3xl text-2xl font-bold">Your Files</h2>
        <FilesTable />
      </div>
    </main>
  );
}

interface TopCardProps {
  title: string;
  Icon: React.ElementType;
  content: string;
}

function TopCard({ title, Icon, content }: TopCardProps) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{content}</div>
      </CardContent>
    </Card>
  );
}
