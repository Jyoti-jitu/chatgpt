'use client';

import Link from 'next/link';

export default function LandingPage() {
  const names = [];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-white/30 selection:text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 opacity-95 pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-8 py-6 border-b border-zinc-800">
        <Link href="/">
          <div className="text-2xl font-bold tracking-wide">
            NovaMind
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-zinc-300">
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
          <a href="#pricing" className="hover:text-white transition">
            Pricing
          </a>
        </nav>

        <Link href="/register">
          <button className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/70 text-sm text-zinc-300 mb-8 backdrop-blur-sm">
          ✨ Advanced Conversational Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
          Your Intelligent
          <span className="bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            {" "}Digital Assistant
          </span>
        </h1>

        <p className="mt-8 text-zinc-400 max-w-2xl text-lg md:text-xl leading-relaxed">
          Experience next-generation conversations powered by our proprietary engine.
          Persistent memory, real-time responses, modern UI, and seamless
          productivity — all in one platform.
        </p>

        {/* Prompt Box */}
        <div className="mt-12 w-full max-w-3xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Ask NovaMind anything..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-zinc-500 px-4 py-4"
            />
            <Link href="/register">
              <button className="bg-white text-black px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all">
                Send
              </button>
            </Link>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-5xl w-full">
          {[
            "Generate production-ready React code",
            "Explain Kubernetes like a senior engineer",
            "Create a startup business plan",
          ].map((item, index) => (
            <Link href="/register" key={index}>
              <div className="h-full p-5 rounded-2xl border border-zinc-800 bg-zinc-900/70 hover:border-zinc-600 transition cursor-pointer flex items-center justify-center">
                <p className="text-zinc-300">{item}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 px-6 md:px-16 py-24 border-t border-zinc-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Built for Modern Experiences
            </h2>
            <p className="mt-6 text-zinc-400 text-lg max-w-3xl mx-auto">
              Enterprise-grade architecture with persistent chat history,
              authentication, scalable APIs, and real-time dynamic conversations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Persistent Memory",
                desc: "Store and continue previous conversations instantly.",
              },
              {
                title: "Advanced Engine",
                desc: "Powered by our proprietary neural network architecture.",
              },
              {
                title: "Secure Auth",
                desc: "JWT and encrypted authentication system.",
              },
              {
                title: "Modern UI",
                desc: "Fast, responsive and beautifully designed interface.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold mb-5">
                  {index + 1}
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900 py-10 text-center text-zinc-500">
        © {new Date().getFullYear()} NovaMind. All rights reserved.
      </footer>
    </div>
  );
}
