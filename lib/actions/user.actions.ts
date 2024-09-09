"use server"

import {  ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { createAdminClient, createSessionClient } from "../appwrite.config";
import { cookies } from "next/headers";

const {
      DATABASE_ID,
      USER_COLLECTION_ID,
      ADMIN_COLLECTION_ID,
      COMPLAINT_COLLECTION_ID,
      NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

export const createUser = async (userData: CreateUserParams) => {
    const { firstName, lastName, email, password } = userData;

    try {
      const { account, database } = await createAdminClient();

        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}` 
        )

        if(!newAccount) throw new Error('Error creating user');

        const newUser = await database.createDocument(
          DATABASE_ID!,
          USER_COLLECTION_ID!,
          ID.unique(),
          {
            userId: newAccount.$id,
            ...userData
          },
        )

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
          path: `/users/${session.userId}/new-complaint`,
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

        return parseStringify(newUser);
    } catch (error:any) {
      console.log('Error', error);
    }
}

export const getUser = async (userId: string) => {
    try {
      const { user } = await createAdminClient();

        const result = await user.get(userId);

        return parseStringify(result);
    } catch (error) {
        console.log(error)
    }
}

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id})

    return parseStringify(user);
  } catch (error) {
    console.log(error)
    return null;
  }
}


export const logInUser = async({ email, password }: LoginParams) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(
      email,
      password
    );
    cookies().set("appwrite-session", session.secret, {
          path: `/users/${session.userId}/new-complaint`,
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });

    const user = await getUserInfo({ userId: session.userId })
    
    return parseStringify(user);
  } catch (error) {
    throw new Error('Invalid email or password');
  }
}

export const logOutUser = async () => {
  try {
    const { account } = await createSessionClient();
  
      await account.deleteSession('current');

  } catch (error) {
    return null;
  }
}

export const resetPassword = async (userEmail: string) => {
  try {
    const { account } = await createAdminClient();

    account.createRecovery(userEmail, 'https://kahuna-it-help-desk.vercel.app/recover-password');

  } catch (error) {
    console.log(`Error sending reset password link: ${error}`)
  }
}