'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';

const schema = z.object({
  q: z.string().min(1, 'Escribí algo para buscar'),
});

export type SearchFormValues = z.infer<typeof schema>;

interface Props {
  onSearch: (data: SearchFormValues) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="flex items-center gap-2 max-w-xl mx-auto">
      <input
        {...register('q')}
        placeholder="Buscar negocios, servicios, etc..."
        className="flex-grow border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}
