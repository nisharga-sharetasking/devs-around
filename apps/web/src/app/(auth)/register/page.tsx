import React from "react";
import RegisterForm from "./_components/register-form";
import Container from "@/components/shared/container";

const RegisterPage = () => {
  return (
    <Container className="py-10">
      <div className="max-w-[1110] mx-auto bg-background p-6 rounded-lg border gap-6">
        <div className="lg:col-span-2">
          <RegisterForm />
        </div>
      </div>
    </Container>
  );
};

export default RegisterPage;
