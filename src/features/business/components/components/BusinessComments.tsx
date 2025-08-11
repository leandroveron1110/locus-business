import { useRatingComments } from "../../hooks/useRating";
import { Star } from "lucide-react";

interface Props {
  businessId: string;
  currentUserId: string | null;
}

export const BusinessComments = ({ businessId, currentUserId }: Props) => {
  const {
    data: comments = [],
    isLoading,
    isError,
    refetch,
  } = useRatingComments(businessId);

  const yaComento = comments.some((c) => currentUserId && c.user.id === currentUserId);

  if (isLoading) return <p className="text-gray-500">Cargando comentarios...</p>;
  if (isError) return <p className="text-red-500">Error al cargar los comentarios.</p>;

  return (
    <div className="mt-4 space-y-6">
      {!yaComento && (
        <form className="p-4 border border-gray-300 rounded-lg shadow-sm">
          {/* Aca iría el formulario para comentar */}
          <p className="text-sm text-gray-500">Formulario para dejar tu comentario...</p>
        </form>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-600">Este negocio aún no tiene comentarios.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl shadow-sm bg-white"
            >
              {/* Avatar o iniciales */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                {c.user.fullName?.charAt(0).toUpperCase()}
              </div>

              {/* Contenido del comentario */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-800">{c.user.fullName}</h4>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    <Star size={16} fill="currentColor" />
                    <span className="font-medium">{c.value}</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-1 text-sm">{c.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
