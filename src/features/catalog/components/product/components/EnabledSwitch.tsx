// src/features/business/catalog/components/EnabledSwitch.tsx
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
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500">{hint}</div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={[
          "relative inline-flex h-7 w-12 items-center rounded-full transition",
          enabled ? "bg-green-600" : "bg-gray-300",
        ].join(" ")}
        title={enabled ? "Activo" : "Inactivo"}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white transition",
            enabled ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
