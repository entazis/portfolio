import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Open to exciting opportunities in tech leadership, backend architecture, and AI-enhanced development
            </p>
          </div>

          <Card className="shadow-glow p-8 md:p-12">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Budapest, Hungary</span>
                </div>
                <a 
                  href="mailto:hello@entazis.dev"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-smooth"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <span>hello@entazis.dev</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a 
                  href="https://github.com/beam-bence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2 hover:border-primary transition-smooth"
                  >
                    <Github className="h-5 w-5" />
                    beam-bence
                  </Button>
                </a>
                <a 
                  href="https://github.com/entazis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="gap-2 hover:border-primary transition-smooth"
                  >
                    <Github className="h-5 w-5" />
                    entazis
                  </Button>
                </a>
                <a 
                  href="https://www.linkedin.com/in/szabobence1025" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg" 
                    className="gradient-primary shadow-glow gap-2"
                  >
                    <Linkedin className="h-5 w-5" />
                    LinkedIn Profile
                  </Button>
                </a>
              </div>

              <div className="text-center pt-6 border-t">
                <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                  Passionate about building scalable systems, leading high-performing teams, and pushing 
                  the boundaries of what's possible with AI-assisted development. Let's discuss how I can 
                  contribute to your organization's technical success.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
