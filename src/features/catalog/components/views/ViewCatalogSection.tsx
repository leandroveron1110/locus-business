"use client";

import React, { useCallback, useMemo, useState } from "react";
import MenuProduct from "../product/MenuProduct";
import { IMenuProduct, IMenuSectionWithProducts } from "../../types/catlog";
import NewMenuProduct from "../product/news/NewMenuProduct";
import EditCatalogSection from "../edits/EditCatalogSection";
import { useMenuStore } from "../../stores/menuStore";
import { Plus, Pencil, ChevronDown, ChevronUp } from "lucide-react";
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const section = useMenuStore((state) =>
    state.menus
      .find((m) => m.id === menuId)
      ?.sections.find((s) => s.id === sectionId)
  );

  const sortedProducts = useMemo(() => {
    if (!section) {
      return [];
    }
    return [...section.products];
  }, [section]);

  const handleSelectProduct = useCallback((product: IMenuProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleProductCreated = () => {
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

  return (
    <div className="mb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 border-b pb-3 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 mb-4">
            {/* El título de la sección se ajusta para ser más legible y consistente */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
              {section.name}
            </h3>
            {/* El contador de productos es más compacto en móvil */}
            <span className="bg-gray-200 text-gray-600 text-xs sm:text-sm font-semibold rounded-full px-2 py-0.5 sm:px-3 sm:py-1 whitespace-nowrap">
              {sortedProducts.length || 0} productos
            </span>
          </div>
          {sortedProducts.length > 0 && (
            <button
              onClick={handleToggleCollapse}
              className="p-1 sm:p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
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
            className="p-1 sm:p-2 rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors"
            aria-label="Editar Sección"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isCollapsed &&
        (sortedProducts.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <CatalogProduct
                key={product.id}
                product={product}
                onClick={() => handleSelectProduct(product)}
              />
            ))}
            <li
              onClick={() => setShowNewProductModal(true)}
              className="flex justify-center items-center p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <button
                className="flex flex-col items-center justify-center text-gray-500 hover:text-green-600 transition-colors"
                aria-label="Nuevo Producto"
              >
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                <span className="text-sm font-semibold">Agregar Producto</span>
              </button>
            </li>
          </ul>
        ) : (
          <div className="text-center text-gray-500 py-6 sm:py-10">
            {/* Ajuste de tamaño de fuente para el texto de no hay productos */}
            <p className="text-base sm:text-lg font-medium">
              Aún no hay productos en esta sección.
            </p>
            {/* Ajuste de padding para el botón */}
            <button
              onClick={() => setShowNewProductModal(true)}
              className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition-all"
            >
              Agregar el primero
            </button>
          </div>
        ))}

      {selectedProduct && (
        <Modal onClose={handleCloseModal} title="Producto">
          <MenuProduct
            productId={selectedProduct.id}
            onClose={handleCloseModal}
            menuId={menuId}
            sectionId={sectionId}
            businessId={businessId}
          />
        </Modal>
      )}

      {showNewProductModal && (
        <Modal
          onClose={() => setShowNewProductModal(false)}
          title="Nuevo Producto"
        >
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
        <Modal
          onClose={() => setShowEditSectionModal(false)}
          title="Editar Seccion"
        >
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

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}

function Modal({ children, onClose, title }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-4 sm:p-6">
        {/* Header del modal con título y botón de cerrar */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          {title && (
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg sm:text-xl p-1 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="">{children}</div>
      </div>
    </div>
  );
}
