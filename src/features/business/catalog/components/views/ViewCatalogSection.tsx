"use client";

import React, { useCallback, useState } from "react";
import CatalogProduct from "../CatalogProduct";
import MenuProduct from "../product/MenuProduct";
import { IMenuProduct, IMenuSectionWithProducts } from "../../types/catlog";
import NewMenuProduct from "../product/news/NewMenuProduct";
import EditCatalogSection from "../edits/EditCatalogSection";

interface Props {
  menuId: string;
  section: IMenuSectionWithProducts;
  businessId: string;
  ownerId: string;
  onSectionChange?: (s: Partial<IMenuSectionWithProducts>) => void;
  onSectionDelete?: (id: string) => void;
}

export default function ViewCatalogSection({
  section,
  menuId,
  businessId,
  ownerId,
  onSectionChange,
  onSectionDelete,
}: Props) {
  const [selectedProduct, setSelectedProduct] = useState<IMenuProduct | null>(
    null
  );
  const [products, setProducts] = useState<IMenuProduct[]>(section.products);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEditSectionModal, setShowEditSectionModal] = useState(false);

  const handleSelectProduct = useCallback((product: IMenuProduct) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleProductChange = (updatedProduct: IMenuProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductCreated = (newProduct: IMenuProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowNewProductModal(false);
  };

  const handleSectionSave = (data:{ section: Partial<IMenuSectionWithProducts>}) => {
    onSectionChange?.(data.section);
    setShowEditSectionModal(false);
  };

  const handleSectionDelete = (id: string) => {
    onSectionDelete?.(id);
    setShowEditSectionModal(false);
  };

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">{section.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewProductModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Nuevo Producto
          </button>
          <button
            onClick={() => setShowEditSectionModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar Sección
          </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <CatalogProduct
            key={product.id}
            product={product}
            onClick={() => handleSelectProduct(product)}
          />
        ))}
      </ul>

      {/* Modal para editar producto existente */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onChange={handleProductChange}
        />
      )}

      {/* Modal para crear nuevo producto */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowNewProductModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <div className="p-6">
              <NewMenuProduct
                sectionId={section.id}
                onClose={() => setShowNewProductModal(false)}
                onCreated={handleProductCreated}
                businessId={businessId}
                menuId={menuId}
                ownerId={ownerId}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar sección */}
      {showEditSectionModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full relative p-6">
            <button
              onClick={() => setShowEditSectionModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Cerrar modal"
            >
              ✕
            </button>
            <EditCatalogSection
              section={section}
              onUpdate={handleSectionSave}
              onCancel={() => setShowEditSectionModal(false)}
              onDelete={handleSectionDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ModalProps {
  product: IMenuProduct;
  onClose: () => void;
  onChange: (p: IMenuProduct) => void;
}

function ProductModal({ product, onClose, onChange }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        <div className="p-6">
          <MenuProduct
            product={product}
            onClose={onClose}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}