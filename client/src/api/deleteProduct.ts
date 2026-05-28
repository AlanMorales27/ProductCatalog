import { API_BASE, throwApiError } from "./config";

export async function deleteProduct(id: number): Promise<void> {

    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });

    if (!res.ok) await throwApiError(res);
}
