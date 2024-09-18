import CurrentTime from '@/components/CurrentTime'
import StatCard from '@/components/StatCard'
import {columns} from '@/components/table/columns'
import {DataTable} from '@/components/table/DataTable'
import { ToogleButton } from '@/components/ToogleButton'
import { getAdminInfo } from '@/lib/actions/admin.action'
import { getComplaintsByAdminId } from '@/lib/actions/appointment.actions'
import { revalidatePath } from 'next/cache'

import Image from 'next/image'
import Link from 'next/link'

const IndividualAdmin = async ({ params : { adminId }}: SearchParamProps) => {
  const admin = await getAdminInfo({ adminId })
  const adminComplaints = await getComplaintsByAdminId({ adminId: admin.$id});
  
  revalidatePath(`/admin/${adminId}`);
  
  return (
    <div className="admin-dashboard">
        <header className="admin-header">
          <Link href="/" className="cursor-pointer">
            <Image 
              src="/images/logo.png"
              height={32}
              width={32}
              alt='logo'
              className="h-8 w-fit"
            />
          </Link>

          <div className="flex gap-4 justify-center items-center">
            <p className="text-16-semibold">Admin Dashboard</p>
            <ToogleButton />
          </div>
        </header>

        <main className="admin-main">
          <section className="w-full space-y-4 flex md:flex-row flex-col justify-between md:items-center">
            <div>
              <h1 className="header">Welcome Engr. {admin.lastName}👋</h1>
               <p className='text-dark-700'>Start the day with managing new appointments</p>
            </div>
            <CurrentTime />
          </section>

          <section className="admin-stat">
            <StatCard 
              type="resolve"
              count={adminComplaints.resolvedCount}
              label="Resolved complaints"
              icon="/icons/resolved.svg"
            />
            <StatCard 
              type="progress"
              count={adminComplaints.progressCount}
              label="In Progress complaints"
              icon="/icons/progress.svg"
            />
            <StatCard 
              type="pending"
              count={adminComplaints.pendingCount}
              label="Pending complaints"
              icon="/icons/pending.svg"
            />
            
          </section>

          <DataTable columns={columns} data={adminComplaints.documents} />
        </main>
    </div>
  )
}

export default IndividualAdmin;