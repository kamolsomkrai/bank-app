// components/ui/input.tsx
"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input
      {...props}
      className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />
  );
}
