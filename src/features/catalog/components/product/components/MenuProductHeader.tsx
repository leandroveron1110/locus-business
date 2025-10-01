import { useState, useEffect } from "react";

interface Props {
  name: string;
  description: string;
  onUpdate: (data: { name?: string; description?: string }) => void;
}

export default function MenuProductHeader({ name, description, onUpdate }: Props) {
  const [editingField, setEditingField] = useState<"name" | "description" | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  useEffect(() => {
    if (!editingField) {
      setTempValue("");
    }
  }, [name, description]);

  const handleEdit = (field: "name" | "description") => {
    setEditingField(field);
    setTempValue(field === "name" ? name : description);
  };

  const handleSave = () => {
    if (editingField) {
      onUpdate({ [editingField]: tempValue });
      setEditingField(null);
      setTempValue("");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {/* NAME */}
      {editingField === "name" ? (
        <input
          className="text-lg font-bold text-gray-900 border-b border-gray-300 outline-none px-1 py-0.5"
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <h2
          className="text-lg font-bold text-gray-900 cursor-pointer hover:opacity-80"
          onClick={() => handleEdit("name")}
        >
          {name || "Nuevo producto"}
        </h2>
      )}

      {/* DESCRIPTION */}
      {editingField === "description" ? (
        <textarea
          className="text-sm text-gray-700 w-full border-b border-gray-300 outline-none px-1 py-0.5 resize-none"
          value={tempValue}
          autoFocus
          rows={2}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSave()}
        />
      ) : (
        <p
          className="text-sm text-gray-700 cursor-pointer hover:opacity-80"
          onClick={() => handleEdit("description")}
        >
          {description || "Agregar descripción"}
        </p>
      )}
    </div>
  );
}
