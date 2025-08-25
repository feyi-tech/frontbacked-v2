import { Button } from '@/components/ui/button';
import { Code2, DollarSign, Rocket, Youtube, Globe } from 'lucide-react';

const DeveloperSection = () => {
  const scrollToVideo = () => {
    const videoSection = document.getElementById('developer-video');
    videoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Code2 className="mr-2 h-4 w-4" />
              For Developers
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Create Themes, <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Earn Money
              </span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Build frontbacked themes with simple HTML, CSS, and JavaScript. 
              No complex frameworks needed. Just create beautiful, responsive themes 
              and start earning from every site generated using your designs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                onClick={scrollToVideo}
                className="shadow-elegant"
              >
                <Youtube className="mr-2 h-4 w-4" />
                Learn More
              </Button>
              <Button variant="outline" asChild>
                <a href="/theme-documentation">
                  Developer Documentation
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Do you need more info on what a frontbacked theme is? 
              <button 
                onClick={scrollToVideo}
                className="text-primary hover:text-primary-glow transition-colors ml-1 underline"
              >
                Watch our tutorial video
              </button>
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Simple Development</h3>
              <p className="text-muted-foreground text-sm">
                Use standard HTML, CSS, and JavaScript. No complex build processes or frameworks required.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Passive Income</h3>
              <p className="text-muted-foreground text-sm">
                Earn money every time someone uses your theme to generate a website.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Quick Deployment</h3>
              <p className="text-muted-foreground text-sm">
                Submit your theme and it goes live immediately for users to discover and use.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-card border border-border shadow-elegant">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Global Reach</h3>
              <p className="text-muted-foreground text-sm">
                Your themes are available to users worldwide, maximizing your earning potential.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperSection;