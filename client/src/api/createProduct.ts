import type { Product } from "../components/ProductsTable";
import { API_BASE, throwApiError } from "./config";

export async function createProduct( input: Omit<Product, "id"> ): Promise<Product> {

    const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input }),
    });

    if (!res.ok) await throwApiError(res);
    return (await res.json()) as Product;
}
