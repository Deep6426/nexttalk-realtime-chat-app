export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-full max-w-md border border-zinc-800 rounded-2xl p-8 bg-zinc-950">
        {children}
      </div>
    </main>
  );
}