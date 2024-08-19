"use client";

import { getComplaintSchema } from "@/lib/validation";
import { Appointment } from "@/types/appwrite.types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import FileUploader from "../FileUploader";
import { SelectItem } from "../ui/select";
import {
  createComplaint,
  updateComplaint,
} from "@/lib/actions/appointment.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { PriorityStatus } from "@/data";
import { getAdmins } from "@/lib/actions/admin.action";
import { Skeleton } from "../ui/skeleton";

const ComplaintForm = ({
  userId,
  loggedInUserId,
  type,
  appointment,
  engineers,
  setOpen,
}: {
  userId: string;
  loggedInUserId: string;
  type: "create" | "resolve" | "progress";
  appointment?: Appointment;
  engineers?: any;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const ComplaintFormValidation = getComplaintSchema(type);

  const form = useForm<z.infer<typeof ComplaintFormValidation>>({
    resolver: zodResolver(ComplaintFormValidation),
    defaultValues: {
      itEngineer: appointment ? appointment.itEngineer : "",
      priority: appointment?.priority || ("low" as Priority),
      reason: appointment?.reason || "",
      region: appointment?.region || "",
      department: appointment?.department || "",
      complaintDocument: appointment?.complaintDocument || [],
      note: appointment ? appointment.note : "",
      closedReason: appointment?.closedReason || "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof ComplaintFormValidation>) => {
    setIsLoading(true);

    let status;

    switch (type) {
      case "progress":
        status = "progress";
        break;
      case "resolve":
        status = "resolved";
        break;
      default:
        status = "pending";
        break;
    }

    let formData;

    if (values.complaintDocument && values.complaintDocument.length > 0) {
      const blobFile = new Blob([values.complaintDocument[0]], {
        type: values.complaintDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.complaintDocument[0].name);
    }

    const selectedAdmin = engineers.find((engineer: any) => {
      const name = `${engineer.firstName} ${engineer.lastName}`;

      return name === values.itEngineer;
    });

    try {
      if (type === "create" && loggedInUserId) {
        const appointmentData = {
          userId,
          user: loggedInUserId,
          admin: selectedAdmin.$id,
          itEngineer: values.itEngineer,
          priority: values.priority,
          reason: values.reason!,
          region: values.region!,
          department: values.department!,
          complaintDocument: formData,
          note: values.note,
          status: status as Status,
        };

        const appointment = await createComplaint(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/users/${userId}/new-complaint/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            itEngineer: values?.itEngineer,
            status: status as Status,
            closedReason: values?.closedReason,
          },
          type,
        };

        const updatedAppointment = await updateComplaint(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  let buttonLabel;

  switch (type) {
    case "resolve":
      buttonLabel = "Resolve Complaint";
      break;
    case "create":
      buttonLabel = "Submit Complaint";
      break;
    case "progress":
      buttonLabel = "Put In Progress";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Complaint</h1>
            <p className="text-dark-700">Make a new complaint in 10 seconds</p>
          </section>
        )}

        {type !== "resolve" && (
          <>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Complaint Title"
                placeholder="Enter a title for your complaint"
                disabled={type === "progress"}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter additional notes for the engineer"
                disabled={type === "progress"}
              />
            </div>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="region"
                label="Your Region"
                placeholder="Enter the region you're making the complaining from"
                disabled={type === "progress"}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="department"
                label="Your Department"
                placeholder="Enter your Department/Designation"
                disabled={type === "progress"}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="priority"
              label="Complaint Priority"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={type === "progress"}
                  >
                    {PriorityStatus.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label
                          htmlFor={option}
                          className="cursor-pointer capitalize"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />

            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="itEngineer"
              label="Engineer"
              placeholder="Select an IT Engineer"
            >
              {engineers.map((engineer: any) => {
                const name = `${engineer.firstName} ${engineer.lastName}`;
                const imgUrl = engineer.profilePhotoUrl;

                return (
                  <SelectItem key={engineer.$id} value={name}>
                    <div className="flex cursor-pointer items-center gap-2 ">
                      <Image
                        src={imgUrl}
                        width={32}
                        height={32}
                        alt={name}
                        className="rounded-full border border-[#2746D8] dark:border-dark-500"
                      />
                      <p>{name}</p>
                    </div>
                  </SelectItem>
                );
              })}
            </CustomFormField>

            {type === "create" && (
              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="complaintDocument"
                label="Upload a picture of complaint (optional)"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader
                      files={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            )}
            {type === "progress" && (
              <>
              {appointment?.complaintDocumentUrl !== null ? (
                <div className="file-upload">
                <Suspense fallback={<Skeleton className="h-[125px] w-[250px] bg-white rounded-xl" />}>
                  <Image 
                  src={appointment?.complaintDocumentUrl!} 
                  width={1000} 
                  height={1000} 
                  alt='complaintDocument' 
                  className="max-h-[400px] overflow-hidden object-cover"
                />
                </Suspense>
                </div>
              ):(
                <div className="file-upload">
                <p className=" text-sm">No Document was attached</p>
              </div>
              )}
              </>
            )}
          </>
        )}

        {type === "resolve" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="closedReason"
            label="Feedback for resolving"
            placeholder="Enter a feedback for resolving the complaint"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "resolve" ? "shad-resolve-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default ComplaintForm;
