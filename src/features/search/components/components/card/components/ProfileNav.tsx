"use client";

import { Phone, ShoppingCart, Package, Users, Pencil } from "lucide-react";

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  activeSection: string;
  onChange: (section: string) => void;

}

// Actualiza la lista para incluir el menú como un elemento que se puede filtrar
const sections: Section[] = [
  { id: "productos", label: "Productos", icon: <Package className="h-6 w-6" /> },
  { id: "ordenes", label: "Ordenes", icon: <ShoppingCart className="h-6 w-6" /> },
  { id: "personal", label: "Personal", icon: <Users className="h-6 w-6" /> },
  { id: "edit", label: "Editar Perfil", icon: <Pencil className="h-6 w-6" /> },
];

export default function ProfileNav({ activeSection, onChange }: Props) {
  // Filtra las secciones para mostrar u ocultar el menú

  return (
    <div className="flex justify-around py-4 overflow-x-auto">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onChange(section.id)}
          className={`flex flex-col items-center gap-1 min-w-[70px] ${
            activeSection === section.id ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border ${
              activeSection === section.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
            {section.icon}
          </div>
          <span className="text-xs font-medium">{section.label}</span>
        </button>
      ))}
    </div>
  );
}