"use client";

import { use } from "react";
import MobileSession from "@/components/MobileSession";

interface JoinClientProps {
  searchParamsPromise: Promise<{ code?: string }>;
}

export default function JoinClient({ searchParamsPromise }: JoinClientProps) {
  const params = use(searchParamsPromise);
  const code = params.code?.replace(/\D/g, "").slice(0, 8) || "";

  return <MobileSession initialCode={code} />;
}
