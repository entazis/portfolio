"use client";

import React from "react";

// Define custom animation properties
interface CustomAnimationProps {
  x?: number;
  y?: number;
  opacity?: number;
}

// Basic animation props interface
interface AnimationProps {
  initial?: Partial<React.CSSProperties> & CustomAnimationProps;
  animate?: Partial<React.CSSProperties> & CustomAnimationProps;
  exit?: Partial<React.CSSProperties> & CustomAnimationProps;
  transition?: {
    duration?: number;
    ease?: string;
    delay?: number;
  };
  whileHover?: Partial<React.CSSProperties> & CustomAnimationProps;
  whileTap?: Partial<React.CSSProperties> & CustomAnimationProps;
  whileInView?: Partial<React.CSSProperties> & CustomAnimationProps;
  viewport?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Create a type for the motion component
type MotionComponent<T extends React.ElementType> =
  React.ForwardRefExoticComponent<
    AnimationProps & React.ComponentPropsWithoutRef<T>
  >;

// Simple wrapper function to add animations
export function motion<T extends React.ElementType = "div">(
  Component: T
): MotionComponent<T> {
  const MotionComponent = React.forwardRef<
    any,
    AnimationProps & React.ComponentPropsWithoutRef<T>
  >((props, ref) => {
    const {
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      whileInView,
      viewport,
      className,
      style,
      ...rest
    } = props;

    // Apply transitions using built-in CSS
    const cssTransition = transition
      ? `all ${transition.duration || 0.3}s ${transition.ease || "ease"} ${
          transition.delay || 0
        }s`
      : "all 0.3s ease";

    // Merge styles with initial and animate properties
    const combinedStyle: React.CSSProperties = {
      ...(initial as React.CSSProperties),
      ...style,
      transition: cssTransition,
      ...((animate || initial) && {
        transform: animate?.y
          ? `translateY(${animate.y}px)`
          : animate?.x
          ? `translateX(${animate.x}px)`
          : "none",
        opacity: animate?.opacity !== undefined ? animate.opacity : 1,
      }),
    };

    return React.createElement(Component, {
      ...rest,
      ref,
      className: className || "",
      style: combinedStyle,
    });
  });

  MotionComponent.displayName = `Motion${
    typeof Component === "string"
      ? Component
      : Component.name || Component.toString()
  }`;

  return MotionComponent as MotionComponent<T>;
}

// Simplified implementation for common motion components
motion.div = motion("div");
motion.span = motion("span");
motion.section = motion("section");
motion.img = motion("img");
