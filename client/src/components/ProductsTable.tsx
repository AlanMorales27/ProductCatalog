import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: number;
};

const CATEGORY_LABELS = ["Camisetas", "Pantalones", "Vestidos", "Chaquetas", "Blusas"];

export function ProductsTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        fetch("http://localhost:5230/api/products", { signal: controller.signal })
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return (await res.json()) as Product[];
            })
            .then(setProducts)
            .catch((err) => {
                if (err.name !== "AbortError") setError(err.message);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    if (loading) return <div className="card">Cargando…</div>;
    if (error) return <div className="card">Error: {error}</div>;

    return (
        <div className="bg-white border border-[#e8e4dc] rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="w-[140px] text-left align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">SKU</th>
                        <th className="text-left align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">Nombre</th>
                        <th className="w-[140px] text-left align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">Categoría</th>
                        <th className="w-[120px] text-right align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">Precio</th>
                        <th className="w-[90px] text-right align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">Stock</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child_td]:border-b-0">
                    {products.map(p => (
                        <tr key={p.id} className="transition-colors duration-75 hover:bg-[#f7f5f0]">
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle font-mono text-[12.5px] text-[#6b6960]">{p.sku}</td>
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm font-medium">{p.name}</td>
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm">
                                <span className="inline-flex items-center px-2 py-0.5 bg-[#f5f3ee] border border-[#e8e4dc] rounded-full text-xs text-[#6b6960]">
                                    {CATEGORY_LABELS[p.category] ?? "—"}
                                </span>
                            </td>
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm tabular-nums text-right">{p.price}</td>
                            <td className={"px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm tabular-nums text-right " + (p.stock === 0 ? "text-[#97948a]" : p.stock <= 5 ? "text-[#c4423a] font-medium" : "")}>
                                {p.stock}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
