import SignupForm from "@/components/form/SignupForm";
import { ToogleButton } from "@/components/ToogleButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const LogIn = () => {
  return (
    <div className="flex h-screen max-h-screen">
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

          <SignupForm type="user"/>

          <div className="flex items-center justify-center gap-2 mt-5 text-16-regular">
            <p>Have an account?</p>
            <Link href="/log-in" className="text-[#3754DB]">log in</Link>
          </div>

          <div className="text-16-regular mt-5 flex justify-between">
            <Link href="/?superAdmin=true" className="text-green-500">
              Super Admin
            </Link>
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 KahunaDesk
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/images/onboarding.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default LogIn;
