type ButtonProps = {
    children: React.ReactNode;
};

export default function Button({
    children,
}: ButtonProps) {
    return (
        <button className="bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition">
            {children}
        </button>
    );
}