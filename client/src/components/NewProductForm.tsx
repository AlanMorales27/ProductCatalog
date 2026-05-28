import { useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { Product } from "./ProductsTable";
import { FormField, inputBase, inputOk, inputErr } from "./FormField";
import { createProduct } from "../api/createProduct";
import { updateProduct } from "../api/updateProduct";
import { ApiError } from "../api/config";
import { useToast } from "./ToastStack";


const CATEGORIES = ["Camisetas", "Pantalones", "Vestidos", "Chaquetas", "Blusas"] as const;

type FormValues = {
    nombre: string;
    sku: string;
    precio: string;
    stock: string;
    categoria: "" | (typeof CATEGORIES)[number];
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSaved?: (row: Product) => void;
    product?: Product | null;
};

const DEFAULTS: FormValues = { nombre: "", sku: "", precio: "", stock: "", categoria: "" };

function fromProduct(p: Product): FormValues {
    return {
        nombre: p.name,
        sku: p.sku,
        precio: String(p.price),
        stock: String(p.stock),
        categoria: (CATEGORIES[p.category] ?? "") as FormValues["categoria"],
    };
}

export function NewProductForm({ open, onClose, onSaved, product }: Props) {
    const editing = !!product;
    const firstInput = useRef<HTMLInputElement | null>(null);
    const pushToast = useToast();
    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ defaultValues: DEFAULTS, mode: "onSubmit" });

    const { ref: nombreRef, ...nombreReg } = register("nombre", {
        required: "El nombre es requerido",
        minLength: { value: 2, message: "Mínimo 2 caracteres" },
    });

    useEffect(() => {
        if (open) {
            reset(product ? fromProduct(product) : DEFAULTS);
            const t = setTimeout(() => firstInput.current?.focus(), 280);
            return () => clearTimeout(t);
        }
    }, [open, product, reset]);

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        const input = {
            name: values.nombre.trim(),
            sku: values.sku.trim(),
            price: Number(values.precio),
            stock: Number(values.stock),
            category: values.categoria === "" ? 0 : CATEGORIES.indexOf(values.categoria),
        };

        try {
            const row = editing
                ? await updateProduct(product!.id, input)
                : await createProduct(input);
            pushToast({
                kind: "success",
                msg: editing
                    ? `Producto «${row.name}» actualizado`
                    : `Producto «${row.name}» creado`,
            });
            onSaved?.(row);
            onClose();
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                setError("sku", { message: "Este SKU ya existe" });
                pushToast({ kind: "error", msg: "No se pudo guardar: SKU duplicado" });
                return;
            }
            const msg = editing ? "Error al guardar los cambios" : "Error al crear el producto";
            setError("root", { message: msg });
            pushToast({ kind: "error", msg });
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => { if (!isSubmitting) onClose(); }}
                className={
                    "fixed inset-0 bg-[rgba(28,27,24,0.32)] backdrop-blur-[2px] z-50 transition-opacity duration-200 " +
                    (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
                }
            />

            {/* Drawer */}
            <aside
                className={
                    "fixed top-0 right-0 bottom-0 w-[440px] max-w-[92vw] bg-white border-l border-[#e8e4dc] " +
                    "shadow-[0_24px_60px_rgba(28,27,24,0.12),0_4px_12px_rgba(28,27,24,0.06)] " +
                    "z-[51] flex flex-col transition-transform duration-[260ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] " +
                    (open ? "translate-x-0" : "translate-x-full")
                }
                aria-hidden={!open}
            >
                {/* Header */}
                <header className="px-6 py-5 border-b border-[#e8e4dc] flex items-center justify-between">
                    <h2 className="text-base font-semibold tracking-tight m-0">{editing ? "Editar producto" : "Nuevo producto"}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-7 h-7 rounded-md text-[#6b6960] flex items-center justify-center hover:bg-[#f5f3ee] hover:text-[#1c1b18] disabled:opacity-50"
                        aria-label="Cerrar"
                    >
                        ×
                    </button>
                </header>

                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto flex-1">
                    <form id="new-product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormField label="Nombre" required error={errors.nombre?.message}>
                            <input
                                {...nombreReg}
                                ref={(el) => { nombreRef(el); firstInput.current = el; }}
                                type="text"
                                placeholder="Polera oversize lino"
                                maxLength={80}
                                className={`${inputBase} ${errors.nombre ? inputErr : inputOk}`}
                            />
                        </FormField>

                        <FormField label="SKU" required hint="único" error={errors.sku?.message}>
                            <input
                                {...register("sku", {
                                    required: "El SKU es requerido",
                                    pattern: {
                                        value: /^[A-Za-z0-9]+$/,
                                        message: "Solo letras y números",
                                    },
                                    onChange: (e) => setValue("sku", e.target.value.toUpperCase()),
                                })}
                                type="text"
                                placeholder="POLLIN001"
                                maxLength={32}
                                className={`${inputBase} font-mono text-[13px] ${errors.sku ? inputErr : inputOk}`}
                            />
                        </FormField>

                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Precio" required error={errors.precio?.message}>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97948a] text-[13px] pointer-events-none tabular-nums">$</span>
                                    <input
                                        {...register("precio", {
                                            required: "Ingresa un precio",
                                            validate: (v) => {
                                                const n = Number(v);
                                                if (Number.isNaN(n)) return "Ingresa un precio";
                                                if (n < 0) return "Debe ser ≥ 0";
                                                return true;
                                            },
                                        })}
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        className={`${inputBase} pl-[26px] ${errors.precio ? inputErr : inputOk}`}
                                    />
                                </div>
                            </FormField>

                            <FormField label="Stock" required error={errors.stock?.message}>
                                <input
                                    {...register("stock", {
                                        required: "Ingresa el stock",
                                        validate: (v) => {
                                            const n = Number(v);
                                            if (Number.isNaN(n)) return "Ingresa el stock";
                                            if (!Number.isInteger(n)) return "Debe ser un entero";
                                            if (n < 0) return "Debe ser ≥ 0";
                                            return true;
                                        },
                                    })}
                                    type="number"
                                    inputMode="numeric"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    className={`${inputBase} ${errors.stock ? inputErr : inputOk}`}
                                />
                            </FormField>
                        </div>

                        <FormField label="Categoría">
                            <select
                                {...register("categoria")}
                                className={`${inputBase} ${inputOk}`}
                            >
                                <option value="">— Sin categoría —</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </FormField>

                        {errors.root && (
                            <p className="mt-2 text-[12.5px] text-[#c4423a]">{errors.root.message}</p>
                        )}

                        {/* hidden submit so Enter works */}
                        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
                    </form>
                </div>

                {/* Footer */}
                <footer className="px-6 py-4 border-t border-[#e8e4dc] flex gap-2 justify-end bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-medium text-sm bg-transparent text-[#6b6960] hover:bg-[#f5f3ee] hover:text-[#1c1b18] disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="new-product-form"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg font-medium text-sm bg-[#5b5be0] text-white shadow-[0_1px_2px_rgba(28,27,24,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] hover:bg-[#4747c7] disabled:opacity-55 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting
                            ? (editing ? "Guardando…" : "Creando…")
                            : (editing ? "Guardar cambios" : "Crear producto")}
                    </button>
                </footer>
            </aside>
        </>
    );
}
