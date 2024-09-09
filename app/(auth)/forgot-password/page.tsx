"use client";

import SubmitButton from "@/components/SubmitButton";
import { ToogleButton } from "@/components/ToogleButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const ForgotuserEmail = () => {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [open, setOpen] = useState(false);

  
  const resetMail = async () => {
    setLoading(true)
    
    try {
      await resetPassword(userEmail);
    } catch (error) {
      console.log(error)
    }
    
    setLoading(false);
    setOpen(true);
  };
  

  const closeModal = () => {
    setOpen(!!false);
  };

  return (
    <div className="h-screen max-h-screen remove-scrollbar">
      <div className="absolute flex justify-between w-full px-20 md:px-52 mt-5">
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
      <div className="flex justify-center items-center">
        <div className="flex flex-col absolute w-[384px] gap-16">
          <div className="gap-8 flex flex-col">
            <div className="flex flex-col w-72 gap-3">
              <h3 className="text-2xl font-semibold">Forgot Password?</h3>
              <p className="text-sm text-[#676767]">
                We are sorry to hear that happen. Don’t be sad we could help you
                get back to laying your complaint in no time.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                type="email"
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your Email"
                className="border border-blue-700 focus-visible:ring-0 rounded-xl h-12"
              />
              <SubmitButton isLoading={loading} onClick={resetMail}>
                Next
              </SubmitButton>
            </div>
          </div>

          <div>
            <Alert
              className={`bg-[#FFF5F7] w-96 h-20 border-none gap-4 flex flex-row ${open !== true && 'hidden'}`}
            >
              <Image
                  src="/icons/alert-icon.svg"
                  width={40}
                  height={40}
                  alt="alert"
                />

              <div className="flex flex-col ">
                <AlertTitle className="text-[#FF900D] text-[18px]">Hello,</AlertTitle>
                <AlertDescription className="text-[#C88B04] text-xs italic">
                    A recovery Link has been sent to your email
                </AlertDescription>
              </div>

              <div>
                <Image
                  src="/icons/alert-close.svg"
                  width={20}
                  height={20}
                  alt="close"
                  onClick={() => closeModal()}
                  className="cursor-pointer"
                />
              </div>
            </Alert>
          </div>
        </div>
        <div className="bg-reset bg-cover w-full h-screen" />
      </div>
    </div>
  );
};

export default ForgotuserEmail;
