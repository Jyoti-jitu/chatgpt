import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individuals just getting started with AI.',
      features: [
        'Standard context window',
        'Basic models (Gemini Flash)',
        'Up to 50 messages/day',
        'Community support',
      ],
      cta: 'Get Started',
      href: '/register',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$20',
      period: 'per month',
      description: 'Advanced capabilities for professionals and power users.',
      features: [
        'Expanded context window',
        'Premium models (Gemini Pro)',
        'Unlimited messages',
        'Priority email support',
        'Early access to new features',
      ],
      cta: 'Upgrade to Pro',
      href: '/register',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large teams and organizations.',
      features: [
        'Unlimited context',
        'Custom model fine-tuning',
        'Dedicated account manager',
        '24/7 phone & email support',
        'SSO & advanced security',
        'Custom API limits',
      ],
      cta: 'Contact Sales',
      href: '/register',
      popular: false,
    },
  ];

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
          <Link href="/#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="/#about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/pricing" className="text-white font-medium transition">
            Pricing
          </Link>
        </nav>
        <Link href="/register">
          <button className="bg-white text-black px-5 py-2 rounded-xl font-medium hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </header>

      <main className="relative z-10 flex flex-col items-center px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/70 text-sm text-zinc-300 mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            Simple, transparent pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Choose your <span className="bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">plan</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mt-4">
            Unlock the full potential of NovaMind AI with a plan tailored to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                tier.popular
                  ? 'border-white/20 bg-zinc-900/80 shadow-2xl scale-105 md:-translate-y-4 backdrop-blur-xl'
                  : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 backdrop-blur-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-white text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
                <p className="text-zinc-400 text-sm h-10">{tier.description}</p>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold">{tier.price}</span>
                {tier.period && <span className="text-zinc-400">{tier.period}</span>}
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-800 flex-1">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-zinc-300 shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href={tier.href} className="mt-auto w-full">
                <Button
                  variant={tier.popular ? 'default' : 'outline'}
                  className={`w-full h-12 rounded-xl text-base font-semibold ${
                    tier.popular
                      ? 'bg-white text-black hover:bg-zinc-200'
                      : 'bg-transparent text-white border-zinc-700 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
