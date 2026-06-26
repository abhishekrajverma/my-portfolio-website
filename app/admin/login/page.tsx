import { Suspense } from "react";
import AdminLoginPage from "./login-client";

export default function AdminLoginPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminLoginPage />
    </Suspense>
  );
}
