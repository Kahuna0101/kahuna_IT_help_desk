"use server"

import { createAdminClient,} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { InputFile } from "node-appwrite/file";
import { Appointment } from "@/types/appwrite.types";
import { Resend } from 'resend';
import EmailTemplate from "@/components/EmailTemplate";



const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    USER_COLLECTION_ID,
    ADMIN_COLLECTION_ID,
    COMPLAINT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
    RESEND_API_KEY,
} = process.env;

const resend = new Resend(RESEND_API_KEY);

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
            from: "Kahuna Help Desk <kahunahelpdesk@dailytranservices.net>",
            to: userEmail,
            subject: 'Complaint Notification From IT HelpDesk',
            react: EmailTemplate({ appointment, type }),
        });

        revalidatePath('/superAdmin');
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

        const allComplaints = await database.listDocuments(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            progressCount: 0,
            pendingCount: 0,
            resolvedCount: 0,
        }

        const counts = (allComplaints.documents as Appointment[]).reduce((acc, complaint) => {
            if (complaint.status === 'progress') {
                acc.progressCount += 1;
            } else if (complaint.status === 'pending') {
                acc.pendingCount += 1;
            } else if (complaint.status === 'resolved') {
                acc.resolvedCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: allComplaints.total,
            ...counts,
            documents: allComplaints.documents,
        }
        return parseStringify(data);
    } catch (error) {
        console.log(`Error getting all recent appointments: ${error}`)
    }
}

export const getComplaintsByAdminId = async ({ adminId }: any) => {
    try {
        const { database } = await createAdminClient();

        const adminComplaints = await database.listDocuments(
            DATABASE_ID!,
            COMPLAINT_COLLECTION_ID!,
            [Query.equal('admin', adminId), Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            progressCount: 0,
            pendingCount: 0,
            resolvedCount: 0,
        }

        const counts = (adminComplaints.documents as Appointment[]).reduce((acc, complaint) => {
            if (complaint.status === 'progress') {
                acc.progressCount += 1;
            } else if (complaint.status === 'pending') {
                acc.pendingCount += 1;
            } else if (complaint.status === 'resolved') {
                acc.resolvedCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: adminComplaints.total,
            ...counts,
            documents: adminComplaints.documents,
        }

        return parseStringify(data);
    } catch (error) {
        console.log(`Error getting all recent adminComplaints: ${error}`)
    }
}