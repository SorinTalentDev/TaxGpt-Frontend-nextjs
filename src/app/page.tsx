// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";

export default React.memo(function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("home");
  }, [router]);

  return null; // You can also display a loading indicator if you want
});
