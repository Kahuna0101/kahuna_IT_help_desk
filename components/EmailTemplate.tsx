import { formatDateTime } from '@/lib/utils';
import { Appointment } from '@/types/appwrite.types';
import React from 'react';

interface EmailTemplateProps {
    appointment: Appointment,
    type:  string,
}
export default function EmailTemplate({ appointment, type }: EmailTemplateProps) {
  return (
    <div>
      <h1>Hi, it's Kahuna IT Help Desk!</h1>
      <p>
            {type === 'progress' ? `Your complaint has been put in progress and it's been attended to by Engr. ${appointment.itEngineer}.`
            : `We're glad to inform you that your complaint has been resolved and here's the feedback from the Engineer: ${appointment.closedReason}`
            }
      </p>
    </div>
  );
}