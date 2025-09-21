"use client";

import React, { useState } from "react";
import { withSkeleton } from "@/features/common/utils/withSkeleton";

import { SkeletonCategories } from "./components/Skeleton/SkeletonCategories";
import { SkeletonSchedule } from "./components/Skeleton/SkeletonSchedule";
import { SkeletonGallery } from "./components/Skeleton/SkeletonGallery";
import { Business } from "../types/business";
import BusinessHeaderContainer from "./components/containers/BusinessHeaderContainer";
import BusinessContactContainer from "./components/containers/BusinessContactContainer";
import ProfileNav from "./components/ProfileNav";

interface Props {
  business: Business;
}

const LazyCategoriesTags = withSkeleton(
  () => import("./components/containers/CategoriesTagsContainer"),
  SkeletonCategories
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
  const [activeSection, setActiveSection] = useState<string>("schedule");

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <section className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 space-y-10">
        {/* Header */}
        <BusinessHeaderContainer
        businessId={business.id}
          fullDescription={business.fullDescription}
          logoUrl={business.logoUrl}
          name={business.name}
          shortDescription={business.shortDescription}
        />

        <div>
          <ProfileNav
            activeSection={activeSection}
            onChange={setActiveSection}
          />

          <div className="px-4 mt-6">
            {activeSection === "contact" && (
              <>
                <BusinessContactContainer
                  businessId={business.id}
                  address={business.address}
                  email={business.email ?? ""}
                  phone={business.phone}
                  whatsapp={business.whatsapp}
                  latitude={business.latitude || 0}
                  longitude={business.longitude || 0}
                  facebookUrl={business.facebookUrl ?? ""}
                  instagramUrl={business.instagramUrl ?? ""}
                  websiteUrl={business.websiteUrl ?? ""}
                />
              </>
            )}
            {activeSection === "schedule" && (
              <LazySchedule businessId={business.id} />
            )}
            {activeSection === "categories" && (
              <LazyCategoriesTags businessId={business.id} />
            )}
            {activeSection === "gallery" && (
              <LazyGallery businessId={business.id} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
