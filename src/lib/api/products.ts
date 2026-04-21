// lib/api/products.ts
import { useQuery } from '@tanstack/react-query';

// Define the Product type (adjust based on your actual data)
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

// 1. The Fetcher Function
const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('https://api.example.com/products');
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
};

// 2. The Custom Hook
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'], // Unique key for this query
    queryFn: fetchProducts, // The function that fetches the data
  });
};