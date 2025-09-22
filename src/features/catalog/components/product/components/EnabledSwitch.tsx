"use client";
import React from "react";

interface Props {
  enabled?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  hint?: string;
}

export default function EnabledSwitch({
  enabled = false,
  onChange,
  label = "Visible en la carta",
  hint = "Si está activo, el producto se muestra a los clientes.",
}: Props) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-gray-800">{label}</span>
        {hint && <span className="text-xs text-gray-500">{hint}</span>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => onChange(!enabled)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!enabled);
          }
        }}
        className={[
          "relative flex-shrink-0 inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500",
          enabled ? "bg-green-500" : "bg-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            enabled ? "translate-x-5" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
