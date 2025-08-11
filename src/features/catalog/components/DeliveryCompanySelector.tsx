// components/DeliveryCompanySelector.tsx
import React, { useState } from "react";

interface Props {
  companies: { id: string; name: string }[];
  onCancel: () => void;
  onConfirm: (companyId: string) => void;
}

export function DeliveryCompanySelector({ companies, onCancel, onConfirm }: Props) {
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Seleccione compañía de delivery</h2>
        <select
          className="w-full border p-2 rounded"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Seleccionar --</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            disabled={!selectedId}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={() => onConfirm(selectedId)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
