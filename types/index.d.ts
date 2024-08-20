/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  declare type Priority = "low" | "medium" | "high" | "critical";
  declare type Status = "pending" | "progress" | "resolved";
  
  declare interface CreateUserParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePhoto?: FormData | undefined;
  };
  
  declare interface User extends CreateUserParams {
    $id: string;
  }
  
  declare type SearchParamProps = {
    params: { [key: string]: string };
    searchParams: { [key: string]: string | string[] | undefined };
  };
  
  declare interface getUserInfoProps {
    userId: string;
  }
  
  declare interface getAdminInfoProps {
    adminId: string;
  }

  declare interface LoginParams {
    email: string;
    password: string;
  }
  
  declare type CreateComplaintParams = {
    userId: string;
    user: string;
    itEngineer: string;
    region: string;
    complaintDocument: FormData | undefined;
    department: string;
    reason: string;
    priority: Priority;
    status: Status;
    note: string | undefined;
  };
  
  declare type updateComplaintParams = {
    appointmentId: string;
    userEmail: string;
    appointment: Appointment;
    type:  string;
  };