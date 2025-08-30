import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full grid place-items-center bg-secondary">
      {children}
    </div>
  );
};

export default AuthLayout;
