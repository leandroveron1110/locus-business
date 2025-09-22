"use client";

import React, { useCallback, useMemo, useState } from "react";
import MenuProduct from "../product/MenuProduct";
import { IMenuProduct, IMenuSectionWithProducts } from "../../types/catlog";
import NewMenuProduct from "../product/news/NewMenuProduct";
import EditCatalogSection from "../edits/EditCatalogSection";
import { useMenuStore } from "../../stores/menuStore";
import { Plus, Pencil, ChevronDown, ChevronUp } from "lucide-react"; // Importamos los nuevos iconos
import CatalogProduct from "./CatalogProduct";

interface Props {
  menuId: string;
  sectionId: string;
  businessId: string;
  ownerId: string;
  onSectionChange: (s: Partial<IMenuSectionWithProducts>) => void;
  onSectionDelete: (id: string) => void;
}

export default function ViewCatalogSection({
  sectionId,
  menuId,
  businessId,
  ownerId,
  onSectionChange,
  onSectionDelete,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<IMenuProduct | null>(
    null
  );
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Nuevo estado para el colapso

  const section = useMenuStore((state) =>
    state.menus
      .find((m) => m.id === menuId)
      ?.sections.find((s) => s.id === sectionId)
  );

  const handleSelectProduct = useCallback((product: IMenuProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleProductCreated = (newProduct: IMenuProduct) => {
    setShowNewProductModal(false);
  };

  const handleSectionSave = (data: {
    section: Partial<IMenuSectionWithProducts>;
  }) => {
    onSectionChange(data.section);
    setShowEditSectionModal(false);
  };

  const handleSectionDelete = (id: string) => {
    onSectionDelete(id);
    setShowEditSectionModal(false);
  };

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  if (!section) return <div />;

  const sortedProducts = useMemo(() => {
    return [...(section.products ?? [])];
  }, [section.products]);

  return (
    <div className="mb-12 relative">
      {/* Header con botón de colapsar/expandir */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-3 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-gray-800">{section.name}</h3>
            <span className="bg-gray-200 text-gray-600 text-sm font-semibold rounded-full px-3 py-1">
              {sortedProducts.length || 0} productos
            </span>
          </div>
          {sortedProducts.length > 0 && (
            <button
              onClick={handleToggleCollapse}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={
                isCollapsed ? "Expandir Productos" : "Colapsar Productos"
              }
            >
              {isCollapsed ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditSectionModal(true)}
            className="p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
            aria-label="Editar Sección"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCollapsed &&
        (sortedProducts.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <CatalogProduct
                key={product.id}
                product={product}
                onClick={() => handleSelectProduct(product)}
              />
            ))}
            <li
              onClick={() => setShowNewProductModal(true)}
              className="flex justify-center items-center p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <button
                className="flex flex-col items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                aria-label="Nuevo Producto"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-semibold">Agregar Producto</span>
              </button>
            </li>
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg font-medium">
              Aún no hay productos en esta sección.
            </p>
            <button
              onClick={() => setShowNewProductModal(true)}
              className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition-all"
            >
              Agregar el primero
            </button>
          </div>
        ))}

      {/* Modales */}
      {selectedProduct && (
        <Modal onClose={handleCloseModal}>
          <MenuProduct
            productId={selectedProduct.id}
            onClose={handleCloseModal}
            menuId={menuId}
            sectionId={sectionId}
          />
        </Modal>
      )}

      {showNewProductModal && (
        <Modal onClose={() => setShowNewProductModal(false)}>
          <NewMenuProduct
            sectionId={section.id}
            onClose={() => setShowNewProductModal(false)}
            onCreated={handleProductCreated}
            businessId={businessId}
            menuId={menuId}
            ownerId={ownerId}
          />
        </Modal>
      )}

      {showEditSectionModal && (
        <Modal onClose={() => setShowEditSectionModal(false)}>
          <EditCatalogSection
            section={section}
            onUpdate={handleSectionSave}
            onCancel={() => setShowEditSectionModal(false)}
            onDelete={handleSectionDelete}
          />
        </Modal>
      )}
    </div>
  );
}

/** Modal reutilizable y responsivo */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
