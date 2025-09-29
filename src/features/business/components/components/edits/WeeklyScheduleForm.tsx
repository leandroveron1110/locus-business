"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useUpdateSchedule } from "@/features/business/hooks/useSchedule";
import { useState } from "react";

const daysOfWeek = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const daysInSpanish: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

const rangeSchema = z
  .object({
    start: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
    end: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  })
  .refine((data) => data.end > data.start, {
    message: "La hora de fin debe ser mayor a la de inicio",
    path: ["end"],
  });

const formSchema = z.object({
  schedule: z.record(z.array(rangeSchema)),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  businessId: string;
  initialSchedule?: Record<string, string[]>;
  onSuccess?: () => void;
}

export default function WeeklyScheduleForm({ businessId, initialSchedule, onSuccess }: Props) {
  const defaultValues: FormValues = {
    schedule: daysOfWeek.reduce((acc, day) => {
      const ranges = initialSchedule?.[day] ?? [];
      acc[day] = ranges.map((r) => {
        const [start, end] = r.split("-");
        return { start, end };
      });
      return acc;
    }, {} as Record<typeof daysOfWeek[number], { start: string; end: string }[]>),
  };

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const updateSchedule = useUpdateSchedule(businessId);
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: FormValues) => {
    setSuccess(false);

    const payload = Object.fromEntries(
      Object.entries(data.schedule).map(([day, ranges]) => [
        day,
        ranges.map((r) => `${r.start}-${r.end}`),
      ])
    );

    updateSchedule.mutate(payload, {
      onSuccess: () => {
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => setSuccess(false), 3000);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl mx-auto p-4"
    >
      {daysOfWeek.map((day) => (
        <DayScheduleField
          key={day}
          control={control}
          day={day}
          label={daysInSpanish[day]}
          isDisabled={updateSchedule.isPending}
        />
      ))}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={updateSchedule.isPending}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition"
        >
          {updateSchedule.isPending && <Loader2 className="animate-spin" size={18} />}
          {updateSchedule.isPending ? "Guardando..." : "Guardar Horario"}
        </button>
      </div>

      {success && (
        <p className="text-green-600 text-center font-medium">
          ✅ Horario actualizado correctamente
        </p>
      )}
    </form>
  );
}

interface DayProps {
  control: any;
  day: string;
  label: string;
  isDisabled?: boolean;
}

function DayScheduleField({ control, day, label, isDisabled }: DayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schedule.${day}`,
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h3 className="font-semibold text-lg mb-4">{label}</h3>

      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="text-gray-400 italic">No hay horarios para este día.</p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 relative group"
          >
            <Controller
              control={control}
              name={`schedule.${day}.${index}.start`}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <input
                    type="time"
                    {...field}
                    disabled={isDisabled}
                    className={`border rounded-lg p-2 w-28 focus:outline-none focus:ring-2 ${
                      fieldState.error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-red-500 mt-1">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
            <span className="font-medium">a</span>
            <Controller
              control={control}
              name={`schedule.${day}.${index}.end`}
              render={({ field, fieldState }) => (
                <div className="flex flex-col">
                  <input
                    type="time"
                    {...field}
                    disabled={isDisabled}
                    className={`border rounded-lg p-2 w-28 focus:outline-none focus:ring-2 ${
                      fieldState.error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                  {fieldState.error && (
                    <span className="text-xs text-red-500 mt-1">{fieldState.error.message}</span>
                  )}
                </div>
              )}
            />
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 ml-auto opacity-70 hover:opacity-100 transition"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={isDisabled}
          onClick={() => append({ start: "09:00", end: "17:00" })}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-sm w-fit mt-2 transition shadow-sm"
        >
          <Plus size={16} /> Agregar rango
        </button>
      </div>
    </div>
  );
}
