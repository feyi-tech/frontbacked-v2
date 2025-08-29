import { Button } from '@/components/ui/button';
import { CreditCard, Globe, Palette, Shield, Youtube, Zap } from 'lucide-react';
import Link from 'next/link';

const UserSection = () => {
  const scrollToVideo = () => {
    const videoSection = document.getElementById('user-video');
    videoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:order-1">
            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Instant Generation</h3>
              <p className="text-muted-foreground text-sm">
                Create professional websites in minutes without any coding knowledge.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Built-in Payments</h3>
              <p className="text-muted-foreground text-sm">
                Accept crypto and local currency payments from your customers instantly.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Beautiful Themes</h3>
              <p className="text-muted-foreground text-sm">
                Choose from 50+ professional themes designed by expert developers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Secure & Reliable</h3>
              <p className="text-muted-foreground text-sm">
                99.9% uptime with enterprise-grade security for your business website.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:order-2">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Globe className="mr-2 h-4 w-4" />
              For Business Owners
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Showcase Your Business <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Online Today
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Generate any type of website for your business with built-in crypto and 
              local currency payment systems. No technical skills required – 
              just describe what you need and watch your professional website come to life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button asChild className="shadow-elegant">
                <Link href="/dashboard/create-site">
                  <Globe className="mr-2 h-4 w-4" />
                  Generate Site Now
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={scrollToVideo}
              >
                <Youtube className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Do you want to <strong>quickly</strong> learn more on how to generate a website without coding? 
              <button 
                onClick={scrollToVideo}
                className="text-primary hover:text-primary-glow transition-colors ml-1 underline"
              >
                Watch our step-by-step guide
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSection;