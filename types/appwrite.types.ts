import { Models } from "node-appwrite";

export interface User extends Models.Document {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Admin extends Models.Document {
    adminId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePhotoId: string;
    profilePhoto: File[] | undefined;
}

export interface Appointment extends Models.Document {
    admin: Admin;
    user: User;
    priority: Priority;
    status: Status;
    itEngineer: string;
    region: string;
    department: string;
    complaintDocumentId: string;
    complaintDocumentUrl: string;
    reason: string;
    note: string;
    userId: string;
    closedReason: string | null;
}