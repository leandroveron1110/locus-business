import { useState, useEffect } from "react";

interface Props {
  name: string;
  description: string;
  onUpdate: (data: { name?: string; description?: string }) => void;
}

export default function MenuProductHeader({ name, description, onUpdate }: Props) {
  const [editingField, setEditingField] = useState<"name" | "description" | null>(null);
  const [tempValue, setTempValue] = useState<string>("");

  // Sincronizamos el valor temporal con el prop cada vez que cambian
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
    <div>
      {/* NAME */}
      {editingField === "name" ? (
        <input
          className="text-3xl font-bold text-gray-900 mb-2 border-b border-gray-400 outline-none"
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <h2
          className="text-3xl font-bold text-gray-900 mb-2 cursor-pointer hover:opacity-70"
          onClick={() => handleEdit("name")}
        >
          {name || "Nuevo producto"}
        </h2>
      )}

      {/* DESCRIPTION */}
      {editingField === "description" ? (
        <textarea
          className="text-gray-700 text-base mb-6 w-full border-b border-gray-400 outline-none"
          value={tempValue}
          autoFocus
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSave()}
        />
      ) : (
        <p
          className="text-gray-700 text-base mb-6 cursor-pointer hover:opacity-70"
          onClick={() => handleEdit("description")}
        >
          {description || "Agregar descripción"}
        </p>
      )}
    </div>
  );
}
