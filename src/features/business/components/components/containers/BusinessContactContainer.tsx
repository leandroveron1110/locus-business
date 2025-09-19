// src/components/BusinessContactContainer.tsx
"use client";

import { useState } from "react";
import BusinessContactEditor from "../edits/BusinessContactEditor";
import BusinessContact from "../views/BusinessContact";
import { useBusinessContactUpdater } from "@/features/business/hooks/useBusinessContactUpdater";
import { AddressData } from "@/features/locationSelector/types/address-data";

interface OnSaveData {
  address?: string;
  addressData?: AddressData;
  phone?: string;
  whatsapp?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

interface Props {
  businessId: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  latitude: number;
  longitude: number;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
}

export default function BusinessContactContainer({
  businessId,
  address,
  phone,
  whatsapp,
  email,
  latitude,
  longitude,
  websiteUrl,
  facebookUrl,
  instagramUrl,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [contactData, setContactData] = useState({
    address,
    phone,
    whatsapp,
    email,
    latitude,
    longitude,
    websiteUrl,
    facebookUrl,
    instagramUrl,
  });

  const { updateContact, isUpdating } = useBusinessContactUpdater(businessId);

  const getChanges = (newData: OnSaveData) => {
    const diff: Partial<typeof contactData> = {};

    if (newData.address && newData.address !== contactData.address) diff.address = newData.address;
    if (newData.phone && newData.phone !== contactData.phone) diff.phone = newData.phone;
    if (newData.whatsapp && newData.whatsapp !== contactData.whatsapp) diff.whatsapp = newData.whatsapp;
    if (newData.email && newData.email !== contactData.email) diff.email = newData.email;
    if (typeof newData.latitude === "number" && newData.latitude !== contactData.latitude)
      diff.latitude = newData.latitude;
    if (typeof newData.longitude === "number" && newData.longitude !== contactData.longitude)
      diff.longitude = newData.longitude;

    // Nuevos campos
    if (newData.websiteUrl && newData.websiteUrl !== contactData.websiteUrl)
      diff.websiteUrl = newData.websiteUrl;
    if (newData.facebookUrl && newData.facebookUrl !== contactData.facebookUrl)
      diff.facebookUrl = newData.facebookUrl;
    if (newData.instagramUrl && newData.instagramUrl !== contactData.instagramUrl)
      diff.instagramUrl = newData.instagramUrl;

    return diff;
  };

  const handleSave = async (newData: OnSaveData) => {
    const changes = getChanges(newData);

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    updateContact(changes, {
      onSuccess: () => {
        setContactData((prev) => ({ ...prev, ...changes }));
        setIsEditing(false);
      },
    });
  };

  return (
    <div>
      {isEditing ? (
        <BusinessContactEditor
          {...contactData}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <BusinessContact {...contactData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}

