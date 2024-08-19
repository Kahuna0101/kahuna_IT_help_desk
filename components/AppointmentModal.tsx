'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Appointment } from "@/types/appwrite.types";
import ComplaintForm from "./form/ComplaintForm";
import { getAdmins } from "@/lib/actions/admin.action";

const AppointmentModal = ({ 
    type,
    loggedInUserId,
    userId,
    appointmentId,
    }: { 
    type: 'progress' | 'resolve',
    loggedInUserId: string,
    userId: string,
    appointmentId?: Appointment,
 }) => {
    const [open, setOpen] = useState(false);
    const [engineers, setEngineers] = useState([]);

    useEffect(() => {
      const fetchData = async() => {
        const data = await getAdmins();
        setEngineers(data);
      }

      fetchData();
    }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`capitalize text-green-700 ${type === 'progress' && 'text-blue-700'}`}>
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className={`shad-dialog overflow-y-auto remove-scrollbar ${type === 'progress' && 'h-full'}`}>
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Complaint</DialogTitle>
          <DialogDescription>
            {type === 'progress' ? `Find below the complaints from ${appointmentId?.user.firstName}` : 'Send a feedback to notify the complaint has been resolved'}
          </DialogDescription>
        </DialogHeader>

        <ComplaintForm
          userId={userId}
          loggedInUserId={loggedInUserId}
          type={type}
          appointment={appointmentId}
          setOpen={setOpen}
          engineers={engineers}
         />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;