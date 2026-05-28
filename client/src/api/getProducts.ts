import type { Product } from "../components/ProductsTable";
import { API_BASE, ApiError } from "./config";

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {

    const res = await fetch(`${API_BASE}/api/products`, { signal });
    
    if (!res.ok) throw new ApiError(res.status);
    
    return (await res.json()) as Product[];
}
