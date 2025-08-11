"use client";

import React from "react";
import { MapPin, Mail, Phone, Globe, Facebook, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonFollowButton } from "./components/Skeleton/SkeletonFollowButton";
import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";
import Rating from "./components/Rating";

interface Props {
  businessId: string;
}

const LazyCategoriesTags = withSkeleton(
  () => import("./components/CategoriesTags"),
  SkeletonCategories
);
const LazyFollowButton = withSkeleton(
  () => import("./components/FollowButton"),
  SkeletonFollowButton
);
const LazySchedule = withSkeleton(
  () => import("./components/Schedule"),
  SkeletonSchedule
);
const LazyGallery = withSkeleton(
  () => import("./components/Gallery"),
  SkeletonGallery
);

export default function BusinessProfile({ businessId }: Props) {
  const router = useRouter();
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  if (isLoading)
    return (
      <p className="text-center text-gray-500 mt-12 text-lg font-medium">
        Cargando perfil...
      </p>
    );

  if (isError)
    return (
      <p
        role="alert"
        className="text-center text-red-600 mt-12 text-lg font-semibold"
      >
        Error: {(error as Error).message}
      </p>
    );

  if (!data) return null;

  const hasMenu = data.modulesConfig.menu?.enabled ?? false;

  const handleGoToMenu = () => {
    router.push(`/business/${businessId}/catalog`);
  };

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <section className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 space-y-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={`${data.name} logo`}
              className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-3xl border border-gray-300 shadow-md"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {data.name}
            </h1>
            {data.shortDescription && (
              <p className="mt-3 text-gray-600 text-lg max-w-xl">
                {data.shortDescription}
              </p>
            )}
          </div>
        </header>

        {/* Descripción completa */}
        {data.fullDescription && (
          <section>
            <p className="text-gray-700 text-base leading-relaxed max-w-3xl mx-auto">
              {data.fullDescription}
            </p>
          </section>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-6 mt-6">
          {/* Follow Button con su propio contenedor para que respire */}
          <div className="w-full sm:w-auto">
            <LazyFollowButton businessId={businessId} />
          </div>

          {/* Botón Ver pedidos separado y con un ancho fijo para que no se estire */}
          {hasMenu && (
            <button
              onClick={handleGoToMenu}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md 
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 transition text-center"
              aria-label={`Ver pedidos de ${data.name}`}
            >
              Catálogo{" "}
            </button>
          )}
        </div>

        {/* Categorías y Tags */}
        <LazyCategoriesTags businessId={businessId} />

        {/* Contacto */}
        <section className="mt-8" aria-labelledby="contact-heading">
          <h2
            id="contact-heading"
            className="text-xl font-semibold text-gray-800 mb-4"
          >
            Contacto
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6 text-gray-700 text-base">
            <li className="flex items-center gap-3">
              <MapPin className="text-blue-600" size={20} aria-hidden="true" />
              <address className="not-italic">{data.address}</address>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-green-600" size={20} aria-hidden="true" />
              <a href={`tel:${data.phone}`} className="hover:underline">
                {data.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-green-500" size={20} aria-hidden="true" />
              <a
                href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {data.whatsapp}
              </a>
            </li>
            {data.email && (
              <li className="flex items-center gap-3">
                <Mail className="text-red-600" size={20} aria-hidden="true" />
                <a href={`mailto:${data.email}`} className="hover:underline">
                  {data.email}
                </a>
              </li>
            )}
          </ul>
        </section>

        {/* Redes Sociales */}
        <section aria-label="Redes sociales" className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Redes Sociales
          </h2>
          <nav className="flex items-center gap-6 text-gray-600 text-2xl">
            {data.websiteUrl && (
              <a
                href={data.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700 transition"
                aria-label="Sitio web"
              >
                <Globe />
              </a>
            )}
            {data.facebookUrl && (
              <a
                href={data.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800 transition"
                aria-label="Facebook"
              >
                <Facebook />
              </a>
            )}
            {data.instagramUrl && (
              <a
                href={data.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-600 transition"
                aria-label="Instagram"
              >
                <Instagram />
              </a>
            )}
          </nav>
        </section>

        {/* Horarios */}
        <LazySchedule businessId={businessId} />

        {/* Galería */}
        <LazyGallery businessId={businessId} />

        {/* Reseñas */}
        <Rating businessId={businessId} />
      </section>
    </main>
  );
}
