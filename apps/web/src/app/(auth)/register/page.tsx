import React from 'react'
import Container from '@/components/shared/container'
import RegisterForm from '@/app/_components/register-form'
import AuthFooter from '@/app/_components/AuthFooter'

const LoginPage = () => {
  return (
    <section className="min-h-screen w-full grid place-items-center bg-secondary">
      <Container>
        <div className="max-w-[400px] mx-auto  bg-background p-6 rounded-lg border gap-6">
          <RegisterForm />
          <AuthFooter title="Already have account?" label="Login Now" url="/login" />
        </div>
      </Container>
    </section>
  )
}

export default LoginPage
