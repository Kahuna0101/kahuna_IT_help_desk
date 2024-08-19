import SignupForm from "@/components/form/SignupForm";
import { ToogleButton } from "@/components/ToogleButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminSignup = () => {
  return (
    <div className="flex h-screen min-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="flex justify-between">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/images/logo.png"
                height={100}
                width={100}
                alt="kahuna-logo"
                className="mb-12 w-fit"
              />
            </Link>
            <ToogleButton />
          </div>

          <ScrollArea className="md:h-[70vh] md:max-w-[496px]">
            <SignupForm type="admin" />

            <div className="flex items-center justify-center gap-2 mt-5 text-16-regular">
              <p>Admin, Have an account?</p>
              <Link href="/admin/login" className="text-[#3754DB]">
                Log in
              </Link>
            </div>

            <div className="text-16-regular mt-10 flex justify-between">
              <Link href="/?superAdmin=true" className="text-green-500">
                Super Admin
              </Link>
              <p className="justify-items-end text-dark-600 xl:text-left">
                © 2024 KahunaDesk
              </p>
            </div>
          </ScrollArea>
        </div>
      </section>

      <Image
        src="/images/engineer.webp"
        height={1000}
        width={1000}
        alt="enginner"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default AdminSignup;
