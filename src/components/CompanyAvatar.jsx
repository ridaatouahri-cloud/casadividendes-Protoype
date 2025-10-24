import React from "react";

export default function CompanyAvatar({ ticker = "", size = "md" }) {
  const initials = String(ticker || "").slice(0, 2).toUpperCase() || "??";
  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-base",
    lg: "h-16 w-16 text-lg",
    xl: "h-20 w-20 text-xl",
  };
  const cls = sizes[size] || sizes.md;
  return (
    <div
      className={[
        "flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white/90 font-semibold",
        cls,
      ].join(" ")}
    >
      {initials}
    </div>
  );
}
