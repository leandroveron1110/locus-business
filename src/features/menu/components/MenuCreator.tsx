import React, { useState } from "react";
import axios from "axios";
import { Menu, MenuProduct, Section } from "../types/menu";

export default function MenuCreator({ businessId, ownerId }: { businessId: string; ownerId: string }) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [menuName, setMenuName] = useState("");

  const createMenu = async () => {
    const res = await axios.post("/menus", { name: menuName, businessId, ownerId });
    setMenu(res.data);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {!menu ? (
        <div className="flex gap-2">
          <input
            className="border p-2 rounded flex-1"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Nombre del menú"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={createMenu}
          >
            Crear Menú
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">{menu.name}</h2>
          <SectionManager menu={menu} businessId={businessId} ownerId={ownerId} />
        </div>
      )}
    </div>
  );
}


function SectionManager({ menu, businessId, ownerId }: { menu: Menu; businessId: string; ownerId: string }) {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionName, setSectionName] = useState("");

  const addSection = async () => {
    const res = await axios.post("/menu/secciones", {
      name: sectionName,
      index: sections.length + 1,
      menuId: menu.id,
      businessId,
      ownerId,
      imageUrls: []
    });
    setSections([...sections, res.data]);
    setSectionName("");
  };

  return (
    <div className="mt-4 space-y-3">
      {sections.map((s) => <SectionItem key={s.id} section={s} />)}

      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Nueva sección"
        />
        <button className="bg-green-600 text-white px-3 rounded" onClick={addSection}>
          Agregar Sección
        </button>
      </div>
    </div>
  );
}

function SectionItem({ section }: { section: Section }) {
  return (
    <div className="border p-3 rounded bg-gray-50">
      <h3 className="font-semibold">{section.name}</h3>
      <MenuProductManager section={section} />
    </div>
  );
}

function MenuProductManager({ section }: { section: Section }) {
  const [products, setProducts] = useState<MenuProduct[]>([]);
  const [productName, setProductName] = useState("");

  const addProduct = async () => {
    const res = await axios.post("/menu-products", {
      name: productName,
      seccionId: section.id,
      finalPrice: "0.00",
      businessId: "", // opcional si tu endpoint lo requiere
      menuId: section.menuId,
      ownerId: ""
    });
    setProducts([...products, res.data]);
    setProductName("");
  };

  return (
    <div className="mt-2 ml-4 space-y-2">
      {products.map((p) => (
        <div key={p.id} className="border p-2 rounded bg-white">
          {p.name} - ${p.finalPrice}
        </div>
      ))}

      <div className="flex gap-2">
        <input
          className="border p-1 rounded flex-1"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Nuevo producto"
        />
        <button className="bg-purple-600 text-white px-3 rounded" onClick={addProduct}>
          Agregar Producto
        </button>
      </div>
    </div>
  );
}
