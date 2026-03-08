"use client";

import { use } from "react";
import MobileSession from "@/components/MobileSession";

interface JoinClientProps {
  searchParamsPromise: Promise<{ code?: string }>;
  dict: any;
}

export default function JoinClient({ searchParamsPromise, dict }: JoinClientProps) {
  const params = use(searchParamsPromise);
  const code = params.code?.replace(/\D/g, "").slice(0, 8) || "";

  return <MobileSession initialCode={code} dict={dict} />;
}
