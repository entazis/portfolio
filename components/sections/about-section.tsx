"use client";

import { Card, CardContent } from "@/components/ui/card";
import { createTranslation } from "@/i18n";
import { motion } from "@/lib/motion";
import { BadgeCheck, Code, Lightbulb, Users } from "lucide-react";

export async function AboutSection() {
  const { t } = await createTranslation('common');

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
          <h2 className="text-3xl font-bold mb-2">{t('about.title')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-4">{t('about.story.title')}</h3>
            <div className="space-y-4 text-muted-foreground">
              {(t('about.story.paragraphs', { returnObjects: true }) as string[]).map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
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
                <h4 className="font-medium mb-2">{t('about.qualities.cleanCode.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.qualities.cleanCode.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">{t('about.qualities.collaborative.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.qualities.collaborative.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <Lightbulb className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">{t('about.qualities.problemSolver.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.qualities.problemSolver.description')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-background hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center text-center p-6">
                <BadgeCheck className="h-10 w-10 text-primary mb-4" />
                <h4 className="font-medium mb-2">{t('about.qualities.detailOriented.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('about.qualities.detailOriented.description')}
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
          <h3 className="text-2xl font-semibold mb-4">{t('about.interests.title')}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('about.interests.description')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}