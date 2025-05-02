"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation('common');
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('footer.brand')}</h3>
            <p className="text-muted-foreground text-sm">
              {t('footer.description')}
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#hero" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('footer.links.home')}
                </Link>
              </li>
              <li>
                <Link href="#projects" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('footer.links.projects')}
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                  {t('footer.links.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t('footer.connect')}</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.github')}>
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.linkedin')}>
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.twitter')}>
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:hello@example.com" aria-label={t('footer.social.email')}>
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row md:items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  );
}