/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoginSchema } from '@/schema/login'
import { useLoginMutation } from '@/redux/api-queries/auth-api'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { setAccessToken } from '@/auth/cookies'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  // === router ===
  const router = useRouter()

  // === form inital data ===
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema as any),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // === login api mutation hook ===
  const [login, { isLoading }] = useLoginMutation()

  const handleLogin = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const response: any = await login({
        payload: values,
      })

      if (response?.data?.status === 'success') {
        setAccessToken(response?.data?.data?.token)

        // remove registerPayload from localStorage
        localStorage.removeItem('registerPayload')

        toast.success('Login successful!')
        // redirect to login page
        router.replace('/dashboard/overview')
        router.refresh()
      } else if (!response?.error?.data?.success) {
        toast.error(response?.error?.data?.message || 'Failed to login!')
      }
    } catch (error) {
      console.log('LOGIN ERROR: ', error)
      toast.error('Somthing went wrong! Try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="w-full grid gap-6">
        <h3 className="text-2xl font-medium">Login</h3>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="animate-spin" /> Login
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
