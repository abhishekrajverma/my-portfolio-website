"use client";

import dynamic from "next/dynamic";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";

const editorLoading = () => <PageSkeleton />;

export const LazyAboutContentEditor = dynamic(
  () =>
    import("@/components/admin/about-content-editor").then(
      (module) => module.AboutContentEditor
    ),
  { ssr: false, loading: editorLoading }
);

export const LazyContactContentEditor = dynamic(
  () =>
    import("@/components/admin/contact-content-editor").then(
      (module) => module.ContactContentEditor
    ),
  { ssr: false, loading: editorLoading }
);

export const LazyContentItemsAdmin = dynamic(
  () =>
    import("@/components/admin/content-items-admin").then(
      (module) => module.ContentItemsAdmin
    ),
  { ssr: false, loading: editorLoading }
);

export const LazyProjectEditor = dynamic(
  () =>
    import("@/components/admin/project-editor").then(
      (module) => module.ProjectEditor
    ),
  { ssr: false, loading: editorLoading }
);

export const LazyBlogEditor = dynamic(
  () =>
    import("@/components/admin/blog-editor").then((module) => module.BlogEditor),
  { ssr: false, loading: editorLoading }
);

export const LazyResumeAdminEditor = dynamic(
  () =>
    import("@/components/admin/resume-admin-editor").then(
      (module) => module.ResumeAdminEditor
    ),
  { ssr: false, loading: editorLoading }
);
