export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center text-white min-h-[calc(100vh-64px)] px-6">
        <h1 className="text-6xl font-bold max-w-4xl leading-tight">
            Connect  Instantly With Real-Time Messaging
        </h1>
        <p className="text-zinc-400 text-lg mt-6 max-w-2xl">
            NexTalk lets you chat one-on-one or in groups with lightning-fast real-time communication and a modern user experience.
        </p>
        <div className="flex gap-4 mt-8">
            <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition">
                Get Started
            </button>
            <button className="border border-zinc-700 px-6 py-3 rounded-lg hover:bg-zinc-900 transition">
            Learn More
        </button>

        </div>
      



    </section>
  );
}