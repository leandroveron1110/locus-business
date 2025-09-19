// src/app/business/employees/new/page.tsx
import { NewEmployeeForm } from '@/features/employees/components/news/NewEmployeeForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Empleado',
  description: 'Página para crear nuevos empleados y asignar roles de negocio.',
};

export default function NewEmployeePage() {
  return (
    <div className="container mx-auto py-10">
      <NewEmployeeForm />
    </div>
  );
}