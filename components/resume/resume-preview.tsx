"use client";

import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPdfEmbedUrl, printResumeFromUrl } from "@/lib/resume/client-actions";
import type { ResumeWordInfo } from "@/lib/resume/repository";

export function ResumePreviewToolbar({
  pdfUrl,
  pdfDownloadName,
  word,
}: {
  pdfUrl: string;
  pdfDownloadName: string;
  word: ResumeWordInfo | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => printResumeFromUrl(pdfUrl)}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={pdfUrl} download={pdfDownloadName}>
          <Download className="h-4 w-4" />
          Download PDF
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
    </div>
  );
}

export function ResumePdfPreview({
  pdfUrl,
  title,
  className = "h-[70vh] w-full rounded-xl border border-border bg-background",
}: {
  pdfUrl: string;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      src={getPdfEmbedUrl(pdfUrl)}
      title={title}
      className={className}
    />
  );
}
