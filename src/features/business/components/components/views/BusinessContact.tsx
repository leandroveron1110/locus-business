"use client";

import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Facebook,
  Instagram,
} from "lucide-react";

interface BusinessContactProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  whatsapp?: string;
  email?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  onEdit?: () => void;
}

export default function BusinessContact({
  address,
  latitude,
  longitude,
  email,
  phone,
  whatsapp,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  onEdit,
}: BusinessContactProps) {
  const contacts = [
    address && {
      label: "Dirección",
      value: (
        <div>
          <span className="line-clamp-2 break-words" title={address}>
            {address}
          </span>
          {latitude !== undefined && longitude !== undefined && (
            <span className="block text-gray-400 text-xs mt-1">
              Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
            </span>
          )}
        </div>
      ),
      icon: <MapPin size={20} className="text-blue-600" />,
      link: null,
    },
    phone && {
      label: "Teléfono",
      value: phone,
      icon: <Phone size={20} className="text-green-600" />,
      link: `tel:${phone}`,
    },
    whatsapp && {
      label: "WhatsApp",
      value: whatsapp,
      icon: <MessageCircle size={20} className="text-green-500" />,
      link: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      external: true,
    },
    email && {
      label: "Correo",
      value: email,
      icon: <Mail size={20} className="text-red-600" />,
      link: `mailto:${email}`,
    },
    websiteUrl && {
      label: "Sitio web",
      value: websiteUrl.replace(/^https?:\/\//, ""),
      icon: <Globe size={20} className="text-indigo-600" />,
      link: websiteUrl,
      external: true,
    },
    facebookUrl && {
      label: "Facebook",
      value: "Perfil de Facebook",
      icon: <Facebook size={20} className="text-blue-700" />,
      link: facebookUrl,
      external: true,
    },
    instagramUrl && {
      label: "Instagram",
      value: "Perfil de Instagram",
      icon: <Instagram size={20} className="text-pink-500" />,
      link: instagramUrl,
      external: true,
    },
  ].filter(Boolean);

  if (contacts.length === 0) return null;

  return (
    <section aria-labelledby="contact-heading" className="mt-8 relative">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact, idx) => (

          contact && (
                      <div
            key={idx}
            className="flex items-start gap-4 p-4 bg-white shadow-sm rounded-lg hover:shadow-md transition"
          >
            <div className="flex-shrink-0">{contact.icon}</div>
            <div className="flex flex-col min-w-0">
              <span className="text-gray-500 text-sm">{contact.label}</span>
              {contact.link ? (
                <a
                  href={contact.link}
                  target={contact.external ? "_blank" : "_self"}
                  rel={contact.external ? "noopener noreferrer" : undefined}
                  className="text-gray-800 font-medium hover:text-blue-600 transition truncate"
                  title={
                    typeof contact.value === "string" ? contact.value : undefined
                  }
                >
                  {contact.value}
                </a>
              ) : (
                <span
                  className="text-gray-800 font-medium truncate"
                  title={typeof contact.value === "string" ? contact.value : undefined}
                >
                  {contact.value}
                </span>
              )}
            </div>
          </div>
          )

        ))}
      </div>
    </section>
  );
}
