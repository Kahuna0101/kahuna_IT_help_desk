"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite.config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { InputFile } from "node-appwrite/file";

const {
    PROJECT_ID,
    DATABASE_ID,
    ADMIN_COLLECTION_ID,
    ADMIN_PHOTO_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

export const createAdmin = async ({ profilePhoto, ...adminData }: CreateUserParams) => {
    const { firstName, lastName, email, password } = adminData;

    try {
      const { account, database, storage } = await createAdminClient();

      let file;

        if(profilePhoto) {
            const inputFile = InputFile.fromBuffer(
                profilePhoto?.get('blobFile') as Blob,
                profilePhoto?.get('fileName') as string,
            )

            file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile)
        }

        const newAdmin = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}` 
        )

        if(!newAdmin) throw new Error('Error creating admin');

        const newUser = await database.createDocument(
          DATABASE_ID!,
          ADMIN_COLLECTION_ID!,
          ID.unique(),
          {
            adminId: newAdmin.$id,
            profilePhotoId: file?.$id || null,
            profilePhotoUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
            ...adminData
          },
        )

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
          path: `/admin/${session.userId}`,
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUser);
    } catch (error:any) {
      console.log('Error', error);
    }
};

export const logInAdmin = async({ email, password }: LoginParams) => {
    try {
        const { account } = await createAdminClient();
    
        const session = await account.createEmailPasswordSession(
          email,
          password
        );

        cookies().set("appwrite-session", session.secret, {
              path: `/admin/${session.userId}`,
              httpOnly: true,
              sameSite: "strict",
              secure: true,
            });

        const admin = await getAdminInfo({ adminId: session.userId })
        
        return parseStringify(admin);
      } catch (error) {
        throw new Error('Invalid email or password');
      }
};

export const getAdminInfo = async ({ adminId }: getAdminInfoProps) => {
    try {
      const { database } = await createAdminClient();
  
      const admin = await database.listDocuments(
        DATABASE_ID!,
        ADMIN_COLLECTION_ID!,
        [Query.equal('adminId', adminId)]
      )
  
      return parseStringify(admin.documents[0]);
    } catch (error) {
      console.log(error)
    }
}

export const getAdmins = async () => {
  try {
    const { database } = await createAdminClient();

    const admins = await database.listDocuments(
      DATABASE_ID!,
      ADMIN_COLLECTION_ID!,
    );

    const data = admins.documents;
    return parseStringify(data);
  } catch (error) {
    console.log(`Error getting All Admin: ${error}`)
  }
}