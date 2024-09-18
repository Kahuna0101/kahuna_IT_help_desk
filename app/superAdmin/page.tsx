import CurrentDate from '@/components/CurrentDate'
import StatCard from '@/components/StatCard'
import {columns} from '@/components/table/columns'
import {DataTable} from '@/components/table/DataTable'
import { ToogleButton } from '@/components/ToogleButton'
import { getAllRecentComplaints } from '@/lib/actions/appointment.actions'

import Image from 'next/image'
import Link from 'next/link'

const SuperAdmin = async () => {
  const allComplaints = await getAllRecentComplaints();
  
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
            <p className="text-16-semibold">Super Admin Dashboard</p>
            <ToogleButton />
          </div>
        </header>

        <main className="admin-main">
          <section className="w-full space-y-4 flex md:flex-row flex-col justify-between md:items-center">
            <div>
              <h1 className="header">Welcome Super Admin👋</h1>
              <p className='text-dark-700'>Start the day with managing all Engrs. complaints task</p>
            </div>
            <CurrentDate />
          </section>

          <section className="admin-stat">
            <StatCard 
              type="resolve"
              count={allComplaints.resolvedCount}
              label="Resolved complaints"
              icon="/icons/resolved.svg"
            />
            <StatCard 
              type="progress"
              count={allComplaints.progressCount}
              label="In Progress complaints"
              icon="/icons/appointments.svg"
            />
            <StatCard 
              type="pending"
              count={allComplaints.pendingCount}
              label="Pending complaints"
              icon="/icons/pending.svg"
            />
            
          </section>

          <DataTable columns={columns} data={allComplaints.documents} />
        </main>
    </div>
  )
}

export default SuperAdmin