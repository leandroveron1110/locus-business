// src/features/search/hooks/useSearchBusinesses.ts
import { useQuery } from '@tanstack/react-query';
import { fetcSearchBusiness } from '../api/searchApi'; // Importa la función de búsqueda
import { ISearchBusinessParams, ISearchBusiness } from '../types/search';

export const useSearchBusinesses = (
  params?: ISearchBusinessParams
) => {
  return useQuery<ISearchBusiness, Error>({
    queryKey: ['searchResults', params], // La clave de la query incluye todos los parámetros de búsqueda
    queryFn: () => fetcSearchBusiness(params), // La función que llama a la API de búsqueda
    // keepPreviousData: true, // Mantiene los datos anteriores mientras se carga la nueva query
    staleTime: 1000 * 60 * 1, // Los datos se consideran "stale" después de 1 minuto
  });
};
