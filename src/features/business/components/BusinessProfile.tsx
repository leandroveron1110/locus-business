"use client";

import React from "react";
import { MapPin, Mail, Phone, Globe, Facebook, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonFollowButton } from "./components/Skeleton/SkeletonFollowButton";
import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";
import { Business } from "../types/business";
import BusinessHeader from "./components/views/BusinessHeader";
import BusinessHeaderContainer from "./components/containers/BusinessHeaderContainer";
import BusinessContact from "./components/views/BusinessContact";
import BusinessContactContainer from "./components/containers/BusinessContactContainer";
import SocialNetworks from "./components/views/SocialNetworks";
import SocialNetworksContainer from "./components/containers/SocialNetworksContainer";
import WeeklyScheduleEditor from "./components/edits/WeeklyScheduleForm";

interface Props {
  business: Business;
}

const LazyCategoriesTags = withSkeleton(
  () => import("./components/containers/CategoriesTagsContainer"),
  SkeletonCategories
);
const LazyFollowButton = withSkeleton(
  () => import("./components/FollowButton"),
  SkeletonFollowButton
);
const LazySchedule = withSkeleton(
  () => import("./components/containers/ScheduleContainer"),
  SkeletonSchedule
);
const LazyGallery = withSkeleton(
  () => import("./components/Gallery"),
  SkeletonGallery
);

export default function BusinessProfile({ business }: Props) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <section className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 space-y-10">
        {/* Header */}
        <BusinessHeaderContainer
          fullDescription={business.fullDescription}
          logoUrl={business.logoUrl}
          name={business.name}
          shortDescription={business.shortDescription}
        />
        {/* Categorías y Tags */}
        <LazyCategoriesTags businessId={business.id} />

        {/* Contacto */}
        <BusinessContactContainer
          address={business.address}
          email={business.email ?? ""}
          phone={business.phone}
          whatsapp={business.whatsapp}
        />

        {/* Redes Sociales */}
        <SocialNetworksContainer
          initialData={{
            facebookUrl: business.facebookUrl ?? "",
            instagramUrl: business.instagramUrl ?? "",
            websiteUrl: business.websiteUrl ?? "",
          }}
        />

        {/* Horarios */}
        <LazySchedule businessId={business.id} />
        {/* Galería */}
        <LazyGallery businessId={business.id} />
      </section>
    </main>
  );
}
