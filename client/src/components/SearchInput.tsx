type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder }: Props) {
    return (
        <div className="relative flex-1 max-w-[380px]">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#97948a] pointer-events-none"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-9 pl-9 pr-9 bg-white border border-[#e8e4dc] rounded-lg outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#5b5be0] focus:shadow-[0_0_0_3px_rgba(91,91,224,0.18)] placeholder:text-[#97948a]"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    aria-label="Limpiar"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded text-[#97948a] flex items-center justify-center hover:bg-[#f5f3ee] hover:text-[#1c1b18]"
                >
                    ×
                </button>
            )}
        </div>
    );
}
