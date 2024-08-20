"use server"

import { createAdminClient,} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { formatDateTime, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";
import { Appointment } from "@/types/appwrite.types";
import { Resend } from 'resend';
import EmailTemplate from "@/components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    USER_COLLECTION_ID,
    ADMIN_COLLECTION_ID,
    COMPLAINT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  } = process.env;

export const createComplaint = async ({ complaintDocument, ...appointment }: CreateComplaintParams) => {
    try {
        const { database, storage } = await createAdminClient();

        let file;

        if(complaintDocument) {
            const inputFile = InputFile.fromBuffer(
                complaintDocument?.get('blobFile') as Blob,
                complaintDocument?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        const newComplaint = await database.createDocument(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            ID.unique(),
            {
                complaintDocumentId: file?.$id || null,
                complaintDocumentUrl: complaintDocument && `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}` || null,
                ...appointment
            },
        )

        return parseStringify(newComplaint);
    } catch (error) {
        console.log(`Error creating complaint: ${error}`)
    }
};

export const updateComplaint = async ({ appointmentId, userEmail , appointment, type}: updateComplaintParams) => {
    try {
        const { database } = await createAdminClient();

        const updatedComplaint = database.updateDocument(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            appointmentId,
            appointment,
        )

        if(!updatedComplaint) {
            throw new Error('Complaint not found')
        }

        // Impliment a text/email notification function
        await resend.emails.send({
            from: "Kahuna Desk <ithelpdesk@gmail.com>",
            to: userEmail,
            subject: 'Complaint Notification From IT HelpDesk',
            react: EmailTemplate({ appointment, type }),
        });

        revalidatePath('/admin');
        return parseStringify(updatedComplaint);
    } catch (error) {
        console.log(`Error updating complaint appointment: ${error}`)
    }
}

export const getComplaint = async (appointmentId: string) => {
    try {
        const { database } = await createAdminClient();

        const appointment = await database.getDocument(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);
    } catch (error) {
        console.log(`Error getting appointment: ${error}`);
    }
}

export const getAllRecentComplaints = async () => {
    try {
        const { database } = await createAdminClient();

        const appointments = await database.listDocuments(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            progressCount: 0,
            pendingCount: 0,
            resolvedCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'progress') {
                acc.progressCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'resolved') {
                acc.resolvedCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        }

        return parseStringify(data);
    } catch (error) {
        console.log(`Error getting all recent appointments: ${error}`)
    }
}

export const getComplaintsByAdminId = async ({ adminId }: any) => {
    try {
        const { database } = await createAdminClient();

        const appointments = await database.listDocuments(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            [Query.equal('admin', adminId)]
        );

        const initialCounts = {
            progressCount: 0,
            pendingCount: 0,
            resolvedCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'progress') {
                acc.progressCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'resolved') {
                acc.resolvedCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
        }

        return parseStringify(data);
    } catch (error) {
        console.log(`Error getting all recent appointments: ${error}`)
    }
}