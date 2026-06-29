import Link from "next/link";
export default function Navbar() {
    return (
        <nav className= "w-full  h-16 border-b border-zinc-800 flex items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-white">
                NexTalk
            </h1>
            <div className="flex-items-center gap-4">
                <Link href="/login">
                <button className="text-white hover:text-zinc-300 transition">
                    Login
                </button>
                </Link>
                <Link href="/signup">
                <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover: bg-zinc-200 transition">
                    Sign Up
                </button>
                </Link>
            </div>
        </nav>
    );
}