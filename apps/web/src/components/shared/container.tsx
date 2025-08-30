import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        "w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;