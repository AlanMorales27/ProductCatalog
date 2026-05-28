import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../api/getProducts";
import { deleteProduct } from "../api/deleteProduct";
import type { Product } from "../components/ProductsTable";
import type { ToastKind } from "../components/ToastStack";

type PushToast = (toast: { kind: ToastKind; msg: string }) => void;

export function useProducts(pushToast: PushToast) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(null);
        getProducts(controller.signal)
            .then(setProducts)
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message);
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    useEffect(() => fetchProducts(), [fetchProducts]);

    const handleDelete = async (p: Product) => {
        if (!window.confirm(`¿Borrar "${p.name}"?`)) return;
        try {
            await deleteProduct(p.id);
            pushToast({ kind: "success", msg: `Producto «${p.name}» eliminado` });
            fetchProducts();
        } catch (err: any) {
            pushToast({ kind: "error", msg: err?.message || "No se pudo borrar el producto" });
        }
    };

    return { products, loading, error, fetchProducts, handleDelete };
}
