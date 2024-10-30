import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeDollarSign, Clock3Icon, Video } from "lucide-react";
import { DropZone } from "./DropZone";
import FilesTable from "./FilesTable";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom/userAtom";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function DashboardMain() {
  const user = useRecoilValue(userAtom);

  const totalProjects: any = user?.files.length || 0;
  // return sum of all payments
  const solSpent: any =
    (user?.payments?.reduce(
      (total: number, payment: any) => total + (payment.amount || 0),
      0
    ) || 0) / LAMPORTS_PER_SOL;

  return (
    <main className="container mx-auto px-4 py-6 space-y-6 sm:py-8 sm:space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Welcome to your dashboard. Here you can see all your data and manage
          your account.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TopCard title="Total Projects" Icon={Video} content={totalProjects} />
        <TopCard title="Minutes Processed" Icon={Clock3Icon} content="257" />
        <TopCard title="SOL spent" Icon={BadgeDollarSign} content={solSpent + " SOL"} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop your files here or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DropZone />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Files</CardTitle>
            <CardDescription>
              A list of your recently uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <FilesTable />
          </CardContent>
        </Card>
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{content}</div>
      </CardContent>
    </Card>
  );
}
