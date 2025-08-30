/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schema/register";
import { useRegisterMutation } from "@/redux/api-queries/auth-api";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  // === router ===
  const router = useRouter();

  // === form inital data ===
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      business_category: "",
      phone_number: "",
      whatsapp_number: "",
    },
  });

  // === register api mutation hook ===
  const [clientRegister, { isLoading }] = useRegisterMutation();

  // === handle register ===
  const handleRegister = async (values: z.infer<typeof RegisterSchema>) => {
    try {
      const response: any = await clientRegister({
        payload: values,
      });

      if (response?.data?.success) {
        // set registerPayload on localStorage
        localStorage.setItem("registerPayload", JSON.stringify(values));

        // show success message and redirect to verify otp
        router.replace("/verify-otp");
        toast.success("Verify your phone number!");
      } else if (response?.error?.data?.message) {
        toast.error(response?.error?.data?.message || "Failed to register!");
      }
    } catch (error) {
      console.log("REGISTER ERROR: ", error);
      toast.error("Somthing went wrong! Try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className="w-full grid gap-6"
      >
        <h3 className="text-2xl font-medium">Create an account</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* === name === */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* === business category === */}
          <FormField
            control={form.control}
            name="business_category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your business category"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* === phone number === */}
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* === whatsapp number === */}
          <FormField
            control={form.control}
            name="whatsapp_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your whatsapp number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* === email === */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* === password === */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="ms-auto w-full lg:w-fit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin" /> Register Now
            </>
          ) : (
            "Register Now"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
