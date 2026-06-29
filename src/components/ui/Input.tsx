type InputProps= {
    type: string;
    placeholder: string;
    value : string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
};

export default function Input({
    type,
    placeholder,
    value,
    onChange,
}: InputProps) {
    return (
        <input
        type={type}
        placeholder={placeholder}
        value= {value}
        onChange= {onChange}
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none focus:border-white transition"
        />
    );
}