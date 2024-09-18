"use client";

import { ColumnDef } from "@tanstack/react-table";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <p className="text-14-medium">
        {row.original.user.firstName} {row.original.user.lastName}
      </p>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => <p className="text-14-medium">{row.original.region}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => (
      <p className="text-14-regular main-w-[100px]">
        {formatDateTime(row.original.$createdAt).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Date Resolved",
    cell: ({ row }) => {
      return (
        <>
          {row.original.status === "resolved" ? (
            <p className="text-14-regular main-w-[100px]">
              {formatDateTime(row.original.$updatedAt).dateTime}
            </p>
          ) : row.original.status === "progress" ? (
            <p className="text-14-regular text-blue-700 main-w-[100px]">
              In Progress
            </p>
          ) : (
            <p className="text-14-regular text-red-500 main-w-[100px]">
              Not Resolved yet
            </p>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "itEngineer",
    header: "Engineer",
    cell: ({ row }) => {
      const engineer = row.original.admin;

      return (
        <div className="flex items-center gap-3">
          <Image
            src={engineer?.profilePhotoUrl}
            alt={engineer?.firstName}
            width={100}
            height={100}
            className="size-8 rounded-full"
          />
          <p className="whitespace-nowrap">
            Engr. {engineer?.firstName} {engineer?.lastName}
          </p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1">
          <AppointmentModal
            type="progress"
            loggedInUserId={data.user.$id}
            userId={data.userId}
            appointmentId={data}
          />
          <AppointmentModal
            type="resolve"
            loggedInUserId={data.user.$id}
            userId={data.userId}
            appointmentId={data}
          />
        </div>
      );
    },
  },
];
