"use client";

import { useState } from "react";
import { useSchedule } from "@/features/business/hooks/useSchedule";
import { SkeletonSchedule } from "../Skeleton/SkeletonSchedule";
import Schedule from "../views/Schedule";
import WeeklyScheduleForm from "../edits/WeeklyScheduleForm";

interface Props {
  businessId: string;
}

export default function ScheduleContainer({ businessId }: Props) {
  const { data, isLoading, isError, error, refetch } = useSchedule(businessId);
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <SkeletonSchedule />;
  if (isError && error.statusCode !== 404 ) return <p className="text-red-500">Error al cargar el horario</p>;

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

      {isEditing || error && error.statusCode == 404 ? (
        <WeeklyScheduleForm
          businessId={businessId}
          initialSchedule={data}
          onSuccess={() => {
            setIsEditing(false); // ✅ vuelve a la vista normal
            refetch(); // ✅ refresca los datos
          }}
        />
      ) : (
        data ? <Schedule data={data} /> : <></>
      )}
    </div>
  );
}
