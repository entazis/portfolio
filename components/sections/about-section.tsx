"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "@/lib/motion";
import { BadgeCheck, Code, Lightbulb, Users } from "lucide-react";

// TODO extract the texts into env variables

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m a passionate software engineer with a focus on creating elegant, 
            efficient solutions to complex problems. Here&apos;s a bit about who I am and what I do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">My Story</h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                With over 7 years of experience in software development, I&apos;ve had the opportunity to work
                on a diverse range of projects as an independent contractor and a full-time startup employee.
              </p>
              <p>
                I discovered my passion for programming during college, where I built my first web applications.
                Since then, I&apos;ve been constantly learning and pushing the boundaries of what I can create.
              </p>
              <p>
                What drives me is the ability to solve real-world problems through code, and the
                satisfaction of seeing users benefit from the solutions I build.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Code className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">Clean Code</h4>
                <p className="text-sm text-muted-foreground">
                  I write maintainable, well-tested code following best practices.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">Collaborative</h4>
                <p className="text-sm text-muted-foreground">
                  I thrive in team environments and value communication.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Lightbulb className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">Problem Solver</h4>
                <p className="text-sm text-muted-foreground">
                  I enjoy tackling complex challenges with creative solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <BadgeCheck className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">Detail Oriented</h4>
                <p className="text-sm text-muted-foreground">
                  I pay attention to the small details that make big differences.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-semibold mb-4">Personal Interests</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            When I&apos;m not coding, you can find me on the dance floor, reading tech and nonfiction books,
            volunteering or attending events to stay connected with the community.
          </p>
        </motion.div>
      </div>
    </section>
  );
}