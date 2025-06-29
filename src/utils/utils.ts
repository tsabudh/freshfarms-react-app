import React from "react";
export function simulateClickOnKeyDown(callback: ((...args: unknown[]) => void) | (()=> void)) {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
}