"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
import { useUpdateSchedule } from "@/features/business/hooks/useSchedule";

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

const rangeSchema = z.object({
  start: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
  end: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm"),
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

  const onSubmit = (data: FormValues) => {
    const payload = Object.fromEntries(
      Object.entries(data.schedule).map(([day, ranges]) => [
        day,
        ranges.map((r) => `${r.start}-${r.end}`),
      ])
    );

    updateSchedule.mutate(payload, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 max-w-3xl mx-auto p-4"
    >
      {daysOfWeek.map((day) => (
        <DayScheduleField key={day} control={control} day={day} label={daysInSpanish[day]} />
      ))}

      <button
        type="submit"
        disabled={updateSchedule.isPending}
        className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {updateSchedule.isPending ? "Guardando..." : "Guardar Horario"}
      </button>
    </form>
  );
}

interface DayProps {
  control: any;
  day: string;
  label: string;
}

function DayScheduleField({ control, day, label }: DayProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schedule.${day}`,
  });

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">{label}</h3>

      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="text-gray-400 italic">No hay horarios para este día.</p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-inner"
          >
            <Controller
              control={control}
              name={`schedule.${day}.${index}.start`}
              render={({ field }) => (
                <input
                  type="time"
                  {...field}
                  className="border border-gray-300 rounded-lg p-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              )}
            />
            <span className="font-medium">a</span>
            <Controller
              control={control}
              name={`schedule.${day}.${index}.end`}
              render={({ field }) => (
                <input
                  type="time"
                  {...field}
                  className="border border-gray-300 rounded-lg p-2 w-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 ml-auto"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ start: "09:00", end: "17:00" })}
          className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm w-fit mt-2"
        >
          <Plus size={16} /> Agregar rango
        </button>
      </div>
    </div>
  );
}
