import { useEffect, useMemo, useState } from "react";
import type { Product } from "../components/ProductsTable";

export function useSearch(products: Product[]) {
    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");

    useEffect(() => {
        const id = setTimeout(() => setDebounced(query), 220);
        return () => clearTimeout(id);
    }, [query]);

    const filtered = useMemo(() => {
        const q = debounced.trim().toLowerCase();
        if (!q) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        );
    }, [products, debounced]);

    return { query, setQuery, filtered, debounced };
}
