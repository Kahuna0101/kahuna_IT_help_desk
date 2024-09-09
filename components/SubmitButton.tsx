import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";
import React from "react";

interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?:  any;
}

const SubmitButton = ({ isLoading, children, className, onClick }:SubmitButtonProps ) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn("bg-[#3754DB] rounded-xl text-white text-[16px]", className)}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ): (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
