"use client";

import Link from "next/link";
import { ArrowLeft, Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { printResumeFromUrl } from "@/lib/resume/client-actions";
import type { ResumeSource, ResumeWordInfo } from "@/lib/resume/repository";

export function ResumeActions({
  resumeUrl,
  resumeDownloadName,
  source,
  word,
}: {
  resumeUrl: string;
  resumeDownloadName: string;
  source: ResumeSource;
  word: ResumeWordInfo | null;
}) {
  const handlePrint = () => {
    if (source === "pdf") {
      printResumeFromUrl(resumeUrl);
      return;
    }

    window.print();
  };

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
          <a href={resumeUrl} download={resumeDownloadName}>
            <Download className="h-4 w-4" />
            {source === "pdf" ? "Download PDF" : "Download Resume"}
          </a>
        </Button>
        {word ? (
          <Button variant="outline" size="sm" asChild>
            <a href={word.url} download={word.downloadName}>
              <FileText className="h-4 w-4" />
              Download Word
            </a>
          </Button>
        ) : null}
        <Button variant="gradient" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          {source === "pdf" ? "Print PDF" : "Print / Save as PDF"}
        </Button>
      </div>
    </div>
  );
}
