import Link from "next/link";
import { Network } from "lucide-react"; // Ensure lucide-react is installed

export function BottomTag() {
  return (
    <div className="fixed bottom-4 right-4 flex items-center z-20 bg-blue-600 text-white rounded-full px-4 py-2 shadow-md">
      <p className="text-sm flex items-center">
        Currently on Beta (
        <span className="flex items-center ml-1 mr-1 text-yellow-300">
          <Network size={16} className="mr-1" />
          Devnet
        </span>
        ) —{" "}
        <Link href="https://github.com/tsahil01/ai-subtitles-generator/issues">
          <span className="underline hover:text-blue-300">Report issues</span>
        </Link>
      </p>
    </div>
  );
}
