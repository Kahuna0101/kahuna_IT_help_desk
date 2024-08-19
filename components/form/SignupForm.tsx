"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { UserFormValidation } from "@/lib/validation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/user.actions";
import FileUploader from "../FileUploader";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { encryptKey } from "@/lib/utils";
import { createAdmin } from "@/lib/actions/admin.action";

const SignupForm = ({ type }: { type: "admin" | "user" }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      profilePhoto: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      if (type === "user") {
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        };

        const user = await createUser(userData);

        if (user) router.push(`/users/${user.userId}/new-complaint`);
      } else {
        let formData;

        if (values.profilePhoto && values.profilePhoto.length > 0) {
          const blobFile = new Blob([values.profilePhoto[0]], {
            type: values.profilePhoto[0].type,
          });

          formData = new FormData();
          formData.append("blobFile", blobFile);
          formData.append("fileName", values.profilePhoto[0].name);
        }
        // Create Admin

        const adminData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          profilePhoto: formData,
        };

        const admin = await createAdmin(adminData);

        if (admin) router.push(`/admin/${admin.adminId}`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-6 space-y-2">
          <h1 className="header">
            Hi {type === "admin" ? "Admin" : "there"}👋
          </h1>
          <p className="text-dark-700">
            {type === "admin"
              ? "Sign up to be able to manage received complaints"
              : "Make your first complaint"}
          </p>
        </section>

        <div className="flex flex-col xl:flex-row gap-3">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="Bolaji"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Dawodu"
          />
        </div>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email Address"
          placeholder="bolaji.dawodu@adronhomesproperties.com"
        />
        {type === "admin" && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="profilePhoto"
              label="Upload a profile picture"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} type="admin" />
                </FormControl>
              )}
            />
          </>
        )}
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Create your password"
          placeholder="********"
        />
        <SubmitButton isLoading={isLoading} className="w-full p-7">
          Get Started
        </SubmitButton>
      </form>
    </Form>
  );
};

export default SignupForm;
