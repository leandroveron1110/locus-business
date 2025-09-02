import { Mail, MapPin, Phone } from "lucide-react";

interface BusinessContactProps {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  onEdit?: () => void;
}

export default function BusinessContact({
  address,
  email,
  phone,
  whatsapp,
  onEdit,
}: BusinessContactProps) {
  return (
    <section className="mt-8 relative" aria-labelledby="contact-heading">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-0 right-0 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200"
        >
          Editar
        </button>
      )}
      <h2 id="contact-heading" className="text-xl font-semibold text-gray-800 mb-4">
        Contacto
      </h2>
      <ul className="grid sm:grid-cols-2 gap-6 text-gray-700 text-base">
        <li className="flex items-center gap-3">
          <MapPin className="text-blue-600" size={20} aria-hidden="true" />
          <address className="not-italic">{address}</address>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="text-green-600" size={20} aria-hidden="true" />
          <a href={`tel:${phone}`} className="hover:underline">
            {phone}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="text-green-500" size={20} aria-hidden="true" />
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {whatsapp}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Mail className="text-red-600" size={20} aria-hidden="true" />
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </li>
      </ul>
    </section>
  );
}
