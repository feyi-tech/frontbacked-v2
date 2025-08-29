import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Zap } from 'lucide-react';
import githubGlobe from '@/assets/github-globe.jpg';
import Link from 'next/link';

const HeroSection = () => {
  const scrollToVideo = () => {
    const videoSection = document.getElementById('user-video');
    videoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${githubGlobe.src})` }}
      />
      <div className="absolute inset-0 bg-background/60" />
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Generate Websites
            </span>
            <br />
            <span className="text-foreground">Without Coding</span>
          </h1>
          
          <div className="relative">
            <div className="absolute inset-0 bg-background/40 rounded-2xl backdrop-blur-sm"></div>
            <p className="relative text-xl md:text-2xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed px-8 py-6 rounded-2xl">
              Create professional websites instantly with our AI-powered platform. 
              Built-in payments, themes, and everything you need to showcase your business online.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/dashboard/create-site">
              <Button size="lg" className="text-lg px-8 py-4 shadow-glow">
                <Globe className="mr-2 h-5 w-5" />
                  Generate Your Site Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              onClick={scrollToVideo}
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 border-primary/30 hover:bg-primary/10"
            >
              <Zap className="mr-2 h-5 w-5" />
              Learn How It Works
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Sites Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-muted-foreground">Professional Themes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;