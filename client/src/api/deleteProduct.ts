import { API_BASE, ApiError } from "./config";

export async function deleteProduct(id: number): Promise<void> {

    const res = await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
    
    if (!res.ok) throw new ApiError(res.status);
}
