// src/pages/roles/create.tsx

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { RoleForm } from '@/features/roles/components/RoleForm';
import { createRoleApi } from '@/features/roles/api/roles-api';



const CreateRolePage = () => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: createRoleApi,
    onSuccess: () => {
      console.log('Rol creado exitosamente');
      router.push('/roles');
    },
    onError: (error) => {
      console.error('Error al crear el rol:', error);
      alert('Error al crear el rol. Inténtalo de nuevo.');
    },
  });

  const handleSubmit = (formData: any) => {
    // Aquí puedes incluir el businessId, si es necesario, desde el contexto de la sesión o props
    const businessId = 'tu-business-id-aqui'; 
    mutate({ ...formData, businessId });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Rol</h1>
      <RoleForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </div>
  );
};

export default CreateRolePage;