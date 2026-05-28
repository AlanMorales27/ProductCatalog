import type { Product } from "../components/ProductsTable";
import { API_BASE, ApiError } from "./config";

export async function createProduct( input: Omit<Product, "id"> ): Promise<Product> {
    
    const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input }),
    });

    if (!res.ok) throw new ApiError(res.status);
    return (await res.json()) as Product;
}
