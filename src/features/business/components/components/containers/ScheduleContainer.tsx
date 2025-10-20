"use client";

import { useEffect, useState } from "react";
import { useSchedule } from "@/features/business/hooks/useSchedule";
import { SkeletonSchedule } from "../Skeleton/SkeletonSchedule";
import Schedule from "../views/Schedule";
import WeeklyScheduleForm from "../edits/WeeklyScheduleForm";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

export default function ScheduleContainer({ businessId }: Props) {
  const { data, isLoading, isError, error, refetch } = useSchedule(businessId);
  const [isEditing, setIsEditing] = useState(true);
  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError && error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  if (isLoading) return <SkeletonSchedule />;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-4 py-2 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          {isEditing ? "Ver Horarios" : "Editar Horarios"}
        </button>
      </div>

      {isEditing || error?.statusCode === 404 ? (
        <WeeklyScheduleForm
          businessId={businessId}
          initialSchedule={data ? data : undefined}
          onSuccess={() => {
            setIsEditing(false);
            refetch();
          }}
        />
      ) : data ? (
        <Schedule data={data} />
      ) : null}
    </div>
  );
}
