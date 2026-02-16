import { Link } from 'react-router-dom';
import { ArrowDown, Mic, BookOpen, MessageSquare } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <section className="relative min-h-screen flex flex-col gradient-hero overflow-hidden">
        {/* Radial glow overlay */}
        <div className="absolute inset-0 gradient-hero-radial pointer-events-none" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-5">
          <span className="font-display font-bold text-xl text-primary glow-text">🤟 Sign Kit</span>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-foreground hover:text-primary transition">Home</Link>
            <Link to="/convert" className="text-muted-foreground hover:text-primary transition">Convert</Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-4">
            Welcome to <span className="text-primary glow-text">Sign Kit</span>!
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-6 animate-pulse-glow" />
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
            The complete toolkit for Sign Language. Convert speech or text into sign language
            with our 3D avatar powered by ML-enhanced translation.
          </p>
          <Link
            to="/convert"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            Get Started
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Services section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive and aesthetic Sign Language toolkit with a minimalist yet informative interface.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <ServiceCard
            icon={<Mic className="w-8 h-8" />}
            title="Speech to Sign"
            description="Speak into your microphone and watch the 3D avatar translate your words into sign language in real-time."
          />
          <ServiceCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Text to Sign"
            description="Type any text and convert it into sign language. Our hybrid dictionary + ML system handles known and unknown words."
          />
          <ServiceCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="ML Enhanced"
            description="Powered by machine learning predictions. Unknown words are intelligently mapped to sign gestures with confidence scores."
          />
        </div>

        <div className="text-center mt-16">
          <Link
            to="/convert"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-accent text-accent-foreground font-display font-bold text-base hover:opacity-90 transition"
          >
            Try It Now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-panel py-6 text-center text-sm text-muted-foreground">
        <p>Sign Kit — ML-Enhanced Speech to Sign Language Converter</p>
      </footer>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-8 text-center hover:glow-border transition-all duration-300 group">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
