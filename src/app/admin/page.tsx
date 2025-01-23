// src/app/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/login");
  }, [router]);

  return null; // You can also display a loading indicator if you want
}
