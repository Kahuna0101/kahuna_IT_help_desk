import { ToogleButton } from '@/components/ToogleButton'
import { Button } from '@/components/ui/button'
import { getAdmins } from '@/lib/actions/admin.action'
import { getComplaint } from '@/lib/actions/appointment.actions'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const SuccessPage = async ({ params: { userId }, searchParams }: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || '';
  const appointment = await getComplaint(appointmentId);
  const engineers = await getAdmins();
  const engineer = engineers.find((engineer:any) => {
    const name = `${engineer.firstName} ${engineer.lastName}`;

    return (
      name === appointment.itEngineer   
    )
  });

  // const user = await getUser(userId);

  // Sentry.metrics.set("user_view_appointment-sucess", user.name);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
        <div className="success-img">
            <Link href='/'>
                <Image 
                  src="/images/logo.png"
                  height={1000}
                  width={1000}
                  alt='logo'
                  className="h-10 w-fit"
                />
            </Link>
            <div className="absolute right-[28%]">
              <ToogleButton />  
            </div>
            

            <section className="flex flex-col items-center">
                <Image 
                    src="/gifs/success.gif"
                    height={300}
                    width={280}
                    alt='sucess'
                />
            <h2 className="header mb-6 max-w-[600px] text-center">
                Your <span className="text-green-500">complaint request</span> has been succesfully submitted!
            </h2>
            <p>We will be in touch shortly to confirm</p>
            </section>

            <section className="request-details">
                <p>Requested complaint details:</p>
                <div className="flex items-center gap-3">
                    <Image 
                      src={engineer?.profilePhotoUrl}
                      alt='engineer'
                      height={100}
                      width={100}
                      className='size-6 rounded-full'
                    />
                    <p className="whitespace-nowrap">Engr. {engineer?.firstName} {engineer?.lastName}</p>
                </div>
                <div className="flex gap-2">
                    <Image 
                      src="/icons/calendar.svg"
                      height={24}
                      width={24}
                      alt='calender'
                    />
                    <p>{formatDateTime(appointment.$createdAt).dateTime}</p>
                </div>
            </section>

            <Button variant="outline" className="shad-primary-btn" asChild>
              <Link href={`/users/${userId}/new-complaint`}>
                New Complaint
              </Link>
            </Button>

            <p className='copyright'>© 2024 KahunaDesk</p>
            
        </div>
    </div>
  )
}

export default SuccessPage