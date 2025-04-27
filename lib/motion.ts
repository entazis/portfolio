"use client";

import React from "react";

// Basic animation props interface
interface AnimationProps {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
  viewport?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Simple wrapper function to add animations
export function motion<T extends React.ElementType = "div">(
  Component: T
): React.ForwardRefExoticComponent<
  AnimationProps & React.ComponentPropsWithoutRef<T>
> {
  // This is a simplified version of motion that applies CSS transitions
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
      ? `all ${transition.duration || 0.3}s ${
          transition.ease || "ease"
        } ${transition.delay || 0}s`
      : "all 0.3s ease";
    
    // Merge styles with initial and animate properties
    const combinedStyle: React.CSSProperties = {
      ...initial,
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
  
  return MotionComponent;
}

// Simplified implementation for common motion components
motion.div = motion("div");
motion.span = motion("span");
motion.section = motion("section");
motion.img = motion("img");