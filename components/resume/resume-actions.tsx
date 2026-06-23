"use client";

import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { siteConfig } from "@/constants/site";
import { Button } from "@/components/ui/button";

export function ResumeActions() {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <a
            href={siteConfig.resumeUrl}
            download={siteConfig.resumeDownloadName}
          >
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </Button>
        <Button variant="gradient" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
}
