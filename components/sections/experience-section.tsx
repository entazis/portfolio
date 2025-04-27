"use client";

import React from "react";
import { motion } from "@/lib/motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { experienceData, educationData } from "@/lib/data";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Experience & Education</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional journey and educational background.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Work Experience */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Work Experience
            </h3>
            
            <div className="space-y-6">
              {experienceData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden border-l-4 border-l-primary">
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary hidden" />
                    <CardContent className="p-6">
                      <div className="flex justify-between flex-wrap gap-2 mb-2">
                        <h4 className="text-lg font-medium">{item.role}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.period}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{item.company}</p>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                        {item.descriptions.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              Education
            </h3>
            
            <div className="space-y-6">
              {educationData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex justify-between flex-wrap gap-2 mb-2">
                        <h4 className="text-lg font-medium">{item.degree}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.period}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{item.institution}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}