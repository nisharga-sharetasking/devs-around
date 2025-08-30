import { Loader } from "lucide-react";
import React from "react";

const GlobalLoader = () => {
  return (
    <div className="w-fit mx-auto py-4 min-h-[80vh] flex items-center justify-center">
      <Loader className="size-5 animate-spin" />
    </div>
  );
};

export default GlobalLoader;
