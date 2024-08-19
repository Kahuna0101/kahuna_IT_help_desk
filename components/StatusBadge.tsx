import { StatusIcon } from '@/data'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const StatusBadge = ({ status }: { status: Status}) => {
  return (
    <div className={clsx('status-badge', {
        'bg-[#F2F4FD]': status === 'progress',
        'bg-[#FFFDF5]': status === 'pending',
        'bg-[#F0FFF9]': status === 'resolved',
    })}>
        <Image 
          src={StatusIcon[status]}
          alt={status}
          width={24}
          height={24}
          className='h-fit w-3'
        />
        <p className={clsx('text-12-semibold capitalize', {
            'text-blue-700': status === 'progress',
            'text-yellow-500': status === 'pending',
            'text-green-500': status === 'resolved',
        })}>{status}</p>
    </div>
  )
}

export default StatusBadge