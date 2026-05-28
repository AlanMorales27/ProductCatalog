import type { ReactNode } from "react";

type FormFieldProps = {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
};

export const inputBase =
    "w-full h-9 px-3 bg-white border rounded-lg outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#5b5be0] focus:shadow-[0_0_0_3px_rgba(91,91,224,0.18)]";
export const inputOk = "border-[#e8e4dc]";
export const inputErr =
    "border-[#c4423a] focus:border-[#c4423a] focus:shadow-[0_0_0_3px_rgba(196,66,58,0.16)]";

export function FormField({ label, required, hint, error, children }: FormFieldProps) {
    return (
        <div className="mb-4">
            <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#1c1b18] mb-1.5">
                {label}
                {required && <span className="text-[#5b5be0] font-medium">*</span>}
                {hint && <span className="text-[#97948a] font-normal text-[12.5px]">{hint}</span>}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 mt-1.5 text-[12.5px] text-[#c4423a]">
                    {error}
                </p>
            )}
        </div>
    );
}
