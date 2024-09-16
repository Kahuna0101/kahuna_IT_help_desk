import AdminAuthModal from "@/components/AdminAuthModal";
import LoginForm from "@/components/form/LoginForm";
import PasskeyModal from "@/components/PasskeyModal";
import { ToogleButton } from "@/components/ToogleButton";

import Image from "next/image";
import Link from "next/link";

export default function Home({ searchParams }: SearchParamProps) {
  const isSuperAdmin =searchParams.superAdmin === 'true';
  const isAdmin =searchParams.admin === 'true';

  return (
    <div className="flex h-screen max-h-screen">
      {isSuperAdmin && <PasskeyModal />}
      {isAdmin && <AdminAuthModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <div className="flex justify-between">
          <Link href="/" className="cursor-pointer">
            <Image 
            src="/images/logo.png" 
            height={100}
            width={100}
            alt="kahuna-logo"
            className="mb-8 w-fit"
          />
          </Link>

          <ToogleButton />
          </div>
          
          <LoginForm type="user" />

          <div className="flex flex-col items-center justify-center gap-2 mt-5 text-16-regular">
            <Link href="/forgot-password" className="text-[#3754DB]">Forgot Password ?</Link>
            <div className="flex gap-2">
               <p>Don't have an account?</p>
            <Link href="/" className="text-[#3754DB]">
              Sign up
            </Link>
            </div> 
          </div>

          <div className="text-16-regular mt-6 flex justify-between">
            <Link href="/?superAdmin=true" className="text-green-500">Super Admin</Link>
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 KahunaDesk
            </p>
            <Link href="/?admin=true" className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>

      <Image 
        src="/images/onboarding.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"/>
    </div>
  );
}