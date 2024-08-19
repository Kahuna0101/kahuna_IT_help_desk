"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
} from "@/components/ui/form"
import CustomFormField, { FormFieldType } from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { LoginValidation } from "@/lib/validation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logInUser } from "@/lib/actions/user.actions"
import { logInAdmin } from "@/lib/actions/admin.action"


const LoginForm = ({ type }: { type: "admin" | "user"}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  
  const onSubmit = async ({ email, password }: z.infer<typeof LoginValidation>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if(type === 'user') {
        const user = await logInUser({email, password});
    
      if (user) {
        router.push(`/users/${user.userId}/new-complaint`);
      }
    } else {
      // Admin Login
      const admin = await logInAdmin({email, password});
    
      if (admin) {
        router.push(`/admin/${admin.adminId}`);
      }
    }
    } catch (error:any) {
      setError(error.message || 'Login failed');
      console.error('Login error:', error);
    }

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome {type === 'user' ? 'back' : 'Admin' }👋</h1>
          <p className="text-dark-700">Kindly provide your details to {type === 'user' ? 'make a complaint' : 'manage your received complaints' } </p>
        </section>
        <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="bolajidawodu189@gmail.com"   
        />
        <CustomFormField 
            fieldType={FormFieldType.PASSWORD}
            control={form.control}
            name="password"
            label="Enter your password"
            placeholder="********"
        />
        <SubmitButton isLoading={isLoading} className="w-full p-7">Log in</SubmitButton>
        {error && <p className="shad-error text-xl font-semibold">{error}</p>}
      </form>
    </Form>
  )
};

export default LoginForm;