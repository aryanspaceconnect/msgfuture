"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export function Button({
  className,
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 border-transparent",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border-transparent",
    outline: "border-2 border-white text-white hover:bg-white hover:text-black",
    ghost: "bg-transparent text-white hover:bg-gray-800 border-transparent",
  };

  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
