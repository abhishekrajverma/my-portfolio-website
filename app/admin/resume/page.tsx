import { LazyResumeAdminEditor } from "@/components/admin/lazy-editors";
import { getAdminResumeAssets } from "@/lib/resume/repository";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const assets = await getAdminResumeAssets();
  return <LazyResumeAdminEditor initialAssets={assets} />;
}
