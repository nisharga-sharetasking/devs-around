import React from 'react'
import Container from '@/components/shared/container'
import LoginForm from '@/app/_components/login-form'

const LoginPage = () => {
  return (
    <section className="min-h-screen w-full grid place-items-center bg-secondary">
      <Container>
        <div className="max-w-[400px] mx-auto  bg-background p-6 rounded-lg border gap-6">
          <LoginForm />
        </div>
      </Container>
    </section>
  )
}

export default LoginPage
