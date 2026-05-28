import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type ToastKind = "success" | "error" | "info";
export type Toast = { id: string; kind: ToastKind; msg: string };

type ToastContextValue = {
    pushToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx.pushToast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const pushToast = useCallback<ToastContextValue["pushToast"]>((toast) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3200);
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ pushToast }}>
            {children}
            <ToastStack toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(t => {
                const palette =
                    t.kind === "success"
                        ? "border-[#cfe7d8] bg-white text-[#1f8a5b]"
                        : t.kind === "error"
                            ? "border-[#f1c8c4] bg-white text-[#c4423a]"
                            : "border-[#e8e4dc] bg-white text-[#1c1b18]";
                const icon = t.kind === "success" ? "✓" : t.kind === "error" ? "✕" : "•";

                return (
                    <div
                        key={t.id}
                        role="status"
                        style={{ animation: "toast-in 220ms cubic-bezier(0.22,0.61,0.36,1)" }}
                        className={
                            "pointer-events-auto min-w-[260px] max-w-[360px] px-4 py-3 rounded-lg border " +
                            "shadow-[0_8px_24px_rgba(28,27,24,0.16),0_2px_6px_rgba(28,27,24,0.06)] " +
                            "text-[13.5px] flex items-start gap-2.5 " + palette
                        }
                    >
                        <span aria-hidden="true" className="leading-5 font-semibold">{icon}</span>
                        <span className="flex-1 text-[#1c1b18] leading-5">{t.msg}</span>
                        <button
                            type="button"
                            onClick={() => onDismiss(t.id)}
                            aria-label="Cerrar"
                            className="text-[#97948a] hover:text-[#1c1b18] leading-none"
                        >
                            ×
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
