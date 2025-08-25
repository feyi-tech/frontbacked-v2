import { Play, Users, Code } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Learn How <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              frontbacked Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch our comprehensive tutorials to get started with generating websites and creating themes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Tutorial */}
          <div id="user-video" className="bg-gradient-card border border-border rounded-xl p-6 shadow-elegant">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">For Website Owners</h3>
                <p className="text-sm text-muted-foreground">Learn to generate websites without coding</p>
              </div>
            </div>
            
            <div className="aspect-video bg-surface-elevated rounded-lg mb-4 flex items-center justify-center relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-20"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/30 transition-colors">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <p className="text-foreground font-medium">How to Generate Your Website</p>
                <p className="text-muted-foreground text-sm">5:42 minutes</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Choose your theme and customize content
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Set up payment options and domain
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Launch your professional website
              </div>
            </div>
          </div>

          {/* Developer Tutorial */}
          <div id="developer-video" className="bg-gradient-card border border-border rounded-xl p-6 shadow-elegant">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3">
                <Code className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">For Developers</h3>
                <p className="text-sm text-muted-foreground">Learn to create frontbacked themes</p>
              </div>
            </div>
            
            <div className="aspect-video bg-surface-elevated rounded-lg mb-4 flex items-center justify-center relative group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-accent/30 transition-colors">
                  <Play className="h-8 w-8 text-accent" />
                </div>
                <p className="text-foreground font-medium">Creating frontbacked Themes</p>
                <p className="text-muted-foreground text-sm">8:15 minutes</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Theme structure and requirements
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Building with HTML, CSS, and JavaScript
              </div>
              <div className="flex items-center text-muted-foreground">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                Publishing and earning from your themes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;