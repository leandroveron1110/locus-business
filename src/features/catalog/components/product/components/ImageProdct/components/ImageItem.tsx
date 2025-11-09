import { IGlobalImage } from "@/types/global-image";

interface ImageItemProps {
  img: IGlobalImage;
  handleSelectImage: (img: IGlobalImage) => void;
}

export function ImageItem({ img, handleSelectImage }: ImageItemProps) {
  return (
    <div
      key={img.id}
      onClick={() => handleSelectImage(img)}
      className="
        flex items-center gap-3 cursor-pointer p-2 sm:p-3
        hover:bg-gray-50 active:bg-gray-100 transition-all
      "
    >
      {/* Imagen miniatura */}
      <div
        className="
          flex-shrink-0 w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]
          rounded-md overflow-hidden
        "
      >
        <img
          src={img.url}
          alt={img.altText || img.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Información */}
      <div className="flex-1 min-w-0">
        {/* Nombre */}
        <div
          className="
            text-sm sm:text-base font-medium text-gray-800 truncate
            leading-tight
          "
        >
          {img.name}
        </div>

        {/* Tags */}
        {img.tags?.length > 0 && (
          <div
            className="
              flex flex-wrap gap-1 mt-1
              max-w-full overflow-hidden
            "
          >
            {img.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="
                  text-[10px] sm:text-[11px]
                  px-2 py-[1px] bg-gray-200 text-gray-600
                  rounded-full truncate max-w-[80px] sm:max-w-[100px]
                "
              >
                {tag}
              </span>
            ))}
            {img.tags.length > 3 && (
              <span className="text-[10px] sm:text-[11px] text-gray-400">
                +{img.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
