import ComplaintForm from "@/components/form/ComplaintForm";
import { ToogleButton } from "@/components/ToogleButton";
import { getAdmins } from "@/lib/actions/admin.action";
import { getUserInfo } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Complaint({
  params: { userId },
}: SearchParamProps) {
  const user = await getUserInfo({ userId });
  const engineers = await getAdmins();

  return (
    <div className="flex w-full">
      <section className="container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
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

          <ComplaintForm
            type="create"
            userId={userId}
            loggedInUserId={user.$id}
            engineers={engineers}
          />

          <div className="flex items-center justify-center">
            <p className="copyright mt-12">© 2024 KahunaDesk</p>
          </div>
        </div>
      </section>

      <Image
        src="/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="complaint"
        className="side-img max-w-[490px]"
      />
    </div>
  );
}
