import { z } from "zod";

export const UserFormValidation = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  profilePhoto:  z.custom<File[]>().optional(),
});

export const LoginValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password not correct. Must be at least 8 characters"),
});

export const CreateComplaintSchema = z.object({
  itEngineer: z.string().min(2, "Select at least one Engineer"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  region: z
    .string()
    .min(2, "Region must be at least 2 characters")
    .max(500, "Region must be at most 500 characters"),
  department: z
    .string()
    .min(2, "Department must be at least 2 characters")
    .max(500, "Department must be at most 500 characters"),
  complaintDocument:  z.custom<File[]>().optional(),
  note: z.string().optional(),
  closedReason: z.string().optional(),
});

export const InProgressComplaintSchema = z.object({
  itEngineer: z.string().min(2, "Select at least one Engineer"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reason: z.string().optional(),
  region: z.string().optional(),
  department: z.string().optional(),
  complaintDocument:  z.custom<File[]>().optional(),
  note: z.string().optional(),
  closedReason: z.string().optional(),
});

export const ClosedComplaintSchema = z.object({
  itEngineer: z.string().min(2, "Select at least one Engineer"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  reason: z.string().optional(),
  region: z.string().optional(),
  department: z.string().optional(),
  complaintDocument:  z.custom<File[]>().optional(),
  note: z.string().optional(),
  closedReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getComplaintSchema(type: string) {
  switch (type) {
    case "create":
      return CreateComplaintSchema;
    case "resolved":
      return ClosedComplaintSchema;
    default:
      return InProgressComplaintSchema;
  }
}
