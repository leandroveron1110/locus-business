"use client";

import { useAllMenuByBusinessId } from "../../hooks/useAllMenuByBusinessId";
import { IMenu, IMenuSectionWithProducts, IMenuProduct } from "../../types/menu";
import { Plus, Edit, Trash } from "lucide-react";

interface MenuProps {
  businessId: string;
}

export default function Menu({ businessId }: MenuProps) {
  const { data, isLoading, isError, error } = useAllMenuByBusinessId(businessId);

  // 🛠 Handlers (conectar con modales o API)
  const handleAddMenu = () => console.log("Agregar menú");
  const handleEditMenu = (menu: IMenu) => console.log("Editar menú:", menu);
  const handleDeleteMenu = (menuId: string) => console.log("Eliminar menú:", menuId);

  const handleAddSection = (menuId: string) => console.log("Agregar sección al menú:", menuId);
  const handleEditSection = (section: IMenuSectionWithProducts) => console.log("Editar sección:", section);
  const handleDeleteSection = (sectionId: string) => console.log("Eliminar sección:", sectionId);

  const handleAddProduct = (sectionId: string) => console.log("Agregar producto a sección:", sectionId);
  const handleEditProduct = (product: IMenuProduct) => console.log("Editar producto:", product);
  const handleDeleteProduct = (productId: string) => console.log("Eliminar producto:", productId);

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-12 text-lg font-medium">Cargando menús...</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="text-center text-red-600 mt-12 text-lg font-semibold">
        Error: {(error as Error).message}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center mt-12 space-y-4">
        <p className="text-gray-500 text-lg font-medium">No hay menús disponibles para este negocio.</p>
        <button onClick={handleAddMenu} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Agregar menú
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-8">
      {/* Botón global de crear menú */}
      <div className="flex justify-end">
        <button onClick={handleAddMenu} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" /> Nuevo menú
        </button>
      </div>

      {data.map((menu: IMenu) => (
        <section key={menu.id} className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          {/* Header del menú con acciones */}
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{menu.name}</h2>
              <p className="text-sm text-gray-500">{menu.sections.length} secciones</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEditMenu(menu)}>
                <Edit className="w-4 h-4 mr-1" /> Editar
              </button>
              <button onClick={() => handleDeleteMenu(menu.id)}>
                <Trash className="w-4 h-4 mr-1" /> Eliminar
              </button>
            </div>
          </header>

          {/* Listado de secciones */}
          <div className="space-y-4">
            {menu.sections.map((section) => (
              <article key={section.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-700">{section.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSection(section)}>
                      <Edit className="w-4 h-4 mr-1" /> Editar
                    </button>
                    <button onClick={() => handleDeleteSection(section.id)}>
                      <Trash className="w-4 h-4 mr-1" /> Eliminar
                    </button>
                  </div>
                </div>

                {section.imageUrls.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {section.imageUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={section.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Productos */}
                <ul className="mt-3 space-y-2">
                  {section.products.map((product) => (
                    <li key={product.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <span className="text-gray-700">{product.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {product.currencyMask}
                          {product.finalPrice}
                        </span>
                        <button  onClick={() => handleEditProduct(product)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)}>
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Botón para agregar producto */}
                <div className="mt-3">
                  <button onClick={() => handleAddProduct(section.id)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Agregar producto
                  </button>
                </div>
              </article>
            ))}

            {/* Botón para agregar sección */}
            <div className="pt-2">
              <button onClick={() => handleAddSection(menu.id)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" /> Agregar sección
              </button>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
