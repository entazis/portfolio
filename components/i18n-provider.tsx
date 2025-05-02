"use client";
import i18n from "@/i18n-client";
import { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 