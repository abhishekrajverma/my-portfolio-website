"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { PortfolioAdminShell } from "@/components/admin/portfolio-admin-shell";
import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ResumePdfPreview,
  ResumePreviewToolbar,
} from "@/components/resume/resume-preview";
import type { ResumeAssets, ResumeWordInfo } from "@/lib/resume/repository";
import {
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_WORD_DOWNLOAD_NAME,
} from "@/lib/resume/constants";

export function ResumeAdminEditor({ initialAssets }: { initialAssets: ResumeAssets }) {
  const router = useRouter();
  const { showToast } = useAdminToast();
  const [resume, setResume] = useState(initialAssets.download);
  const [word, setWord] = useState<ResumeWordInfo | null>(initialAssets.word);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isUploadingWord, setIsUploadingWord] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/resume/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Resume upload failed.");
      }

      const nextUrl = data.url
        ? `${data.url}${data.url.includes("?") ? "&" : "?"}v=${Date.now()}`
        : resume.url;

      setResume({
        url: nextUrl,
        downloadName: RESUME_PDF_DOWNLOAD_NAME,
        source: "pdf",
      });
      setShowPreview(true);
      showToast("PDF resume uploaded successfully.");
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Resume upload failed."
      );
    } finally {
      setIsUploadingPdf(false);
      event.target.value = "";
    }
  };

  const handleWordUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingWord(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/resume/upload-word", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Word upload failed.");
      }

      const nextUrl = data.url
        ? `${data.url}${data.url.includes("?") ? "&" : "?"}v=${Date.now()}`
        : word?.url ?? "";

      setWord({
        url: nextUrl,
        downloadName: RESUME_WORD_DOWNLOAD_NAME,
      });
      showToast("Word resume uploaded successfully.");
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Word upload failed."
      );
    } finally {
      setIsUploadingWord(false);
      event.target.value = "";
    }
  };

  const isUploading = isUploadingPdf || isUploadingWord;

  return (
    <PortfolioAdminShell
      title="Resume"
      viewSiteHref="/resume"
      action={
        <Button variant="outline" disabled={isUploading} asChild>
          <label className="cursor-pointer">
            {isUploadingPdf ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload PDF
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </label>
        </Button>
      }
    >
      <GlassCard className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Resume files</h2>
              <p className="text-sm text-muted-foreground">
                Upload a PDF for the live resume page and an optional Word file for
                visitors who prefer .docx downloads.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
          <p className="text-sm font-medium">Current source</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {resume.source === "pdf"
              ? "Supabase PDF resume is live on your site."
              : "Using the built-in HTML resume fallback. Upload a PDF to replace it."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {word
              ? "Word resume is available for download."
              : "No Word file uploaded yet."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="gradient" disabled={isUploadingPdf} asChild>
            <label className="cursor-pointer">
              {isUploadingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload PDF
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
            </label>
          </Button>
          <Button variant="outline" disabled={isUploadingWord} asChild>
            <label className="cursor-pointer">
              {isUploadingWord ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload Word
              <input
                type="file"
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleWordUpload}
              />
            </label>
          </Button>
          <Button variant="outline" asChild>
            <a href="/resume" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View resume page
            </a>
          </Button>
          {resume.source === "pdf" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview((current) => !current)}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Close preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Show preview
                </>
              )}
            </Button>
          ) : null}
        </div>

        {resume.source === "pdf" && showPreview ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium">Preview</p>
              <div className="flex flex-wrap items-center gap-2">
                <ResumePreviewToolbar
                  pdfUrl={resume.url}
                  pdfDownloadName={resume.downloadName}
                  word={word}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <EyeOff className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
            <ResumePdfPreview pdfUrl={resume.url} title="Resume PDF preview" />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </GlassCard>
    </PortfolioAdminShell>
  );
}
