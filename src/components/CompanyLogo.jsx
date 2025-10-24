import React from "react";
import CompanyAvatar from "./CompanyAvatar";

export default function CompanyLogo({ ticker, name, logo, size = "md", className = "" }) {
  const [failed, setFailed] = React.useState(false);
  const src = logo || `/logos/${String(ticker || "").toUpperCase()}.png`;
  const sizes = {
    sm: "h-10",
    md: "h-14",
    lg: "h-16",
    xl: "h-20",
  };
  const h = sizes[size] || sizes.md;

  if (!ticker) {
    return <CompanyAvatar ticker={ticker} size={size} />;
  }
  if (failed) {
    return <CompanyAvatar ticker={ticker} size={size} />;
  }

  return (
    <div className={["rounded-xl border border-white/10 bg-white/[0.03] p-2 shadow-card-light", className].join(" ")}>
      <img
        src={src}
        alt={`Logo ${name || ticker}`}
        className={[h, "w-auto object-contain"].join(" ")}
        onError={(e) => {
          if (e.currentTarget.dataset.fallback !== "default") {
            e.currentTarget.dataset.fallback = "default";
            e.currentTarget.src = "/logos/default.svg";
            return;
          }
          setFailed(true);
        }}
      />
    </div>
  );
}
