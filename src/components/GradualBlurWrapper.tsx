"use client";

import React from "react";
import { usePathname } from "next/navigation";
import GradualBlur from "./GradualBlur";

export function GradualBlurWrapper() {
  const pathname = usePathname();

  // Remove bottom blur ONLY on dashboard course pages e.g. /dashboard/ap-biology, /dashboard/ap-chemistry
  // Course pages have pattern /dashboard/[slug] where slug != "" and slug != "progress" etc.
  const isCoursePage = pathname.startsWith("/dashboard/") && pathname !== "/dashboard";
  const isDashboardPage = pathname === "/dashboard";

  if (isCoursePage) {
    return null;
  }

  return (
    <GradualBlur
      target="page"
      position="bottom"
      height="6rem"
      strength={2}
      divCount={5}
      curve="bezier"
      exponential={true}
      opacity={1}
      // On the dashboard page, offset left by the collapsed sidebar width (56px)
      // so the blur doesn't cover the sidebar icons
      style={isDashboardPage ? { left: "56px" } : undefined}
    />
  );
}
