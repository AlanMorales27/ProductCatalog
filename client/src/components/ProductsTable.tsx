export type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    category: number;
};

const CATEGORY_LABELS = ["Camisetas", "Pantalones", "Vestidos", "Chaquetas", "Blusas"];

const copFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

type Props = {
    products: Product[];
    loading: boolean;
    error: string | null;
    hasQuery?: boolean;
    onClearQuery?: () => void;
    onEdit?: (p: Product) => void;
    onDelete?: (p: Product) => void;
};

export function ProductsTable({ products, loading, error, hasQuery, onClearQuery, onEdit, onDelete }: Props) {
    if (loading) return <div className="bg-white border border-[#e8e4dc] rounded-xl shadow-sm p-6 text-[#6b6960]">Cargando…</div>;
    if (error) return <div className="bg-white border border-[#e8e4dc] rounded-xl shadow-sm p-6 text-[#c4423a]">Error: {error}</div>;

    if (products.length === 0) {
        return (
            <div className="bg-white border border-[#e8e4dc] rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-14 text-center text-[#6b6960]">
                    <p className="font-medium text-[#1c1b18] mb-1 text-[15px]">
                        {hasQuery ? "Sin resultados" : "Aún no hay productos"}
                    </p>
                    <p className="text-[13.5px] max-w-[320px] mx-auto">
                        {hasQuery
                            ? "No encontramos productos que coincidan con tu búsqueda. Prueba con otro nombre o SKU."
                            : "Comienza creando tu primer producto para verlo aparecer en este catálogo."}
                    </p>
                    {hasQuery && onClearQuery && (
                        <button
                            onClick={onClearQuery}
                            className="mt-4 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-medium text-sm bg-white text-[#1c1b18] border border-[#e8e4dc] shadow-sm hover:bg-[#f7f5f0] hover:border-[#d9d4c8] transition-colors"
                        >
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            </div>
        );
    }

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
                        <th className="w-[100px] text-right align-middle px-4 py-2.5 border-b border-[#e8e4dc] bg-[#f5f3ee] text-xs font-medium uppercase tracking-wider text-[#6b6960]">
                            <span className="sr-only">Acciones</span>
                        </th>
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
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm tabular-nums text-right">{copFormatter.format(p.price)}</td>
                            <td className={"px-4 py-3 border-b border-[#e8e4dc] align-middle text-sm tabular-nums text-right " + (p.stock === 0 ? "text-[#97948a]" : p.stock <= 5 ? "text-[#c4423a] font-medium" : "")}>
                                {p.stock}
                            </td>
                            <td className="px-4 py-3 border-b border-[#e8e4dc] align-middle text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(p)}
                                        title="Editar"
                                        aria-label={`Editar ${p.name}`}
                                        className="w-8 h-8 inline-flex items-center justify-center rounded-md text-[#6b6960] hover:bg-[#f5f3ee] hover:text-[#1c1b18] transition-colors"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(p)}
                                        title="Borrar"
                                        aria-label={`Borrar ${p.name}`}
                                        className="w-8 h-8 inline-flex items-center justify-center rounded-md text-[#6b6960] hover:bg-[#fbeae8] hover:text-[#c4423a] transition-colors"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6" />
                                            <path d="M14 11v6" />
                                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
