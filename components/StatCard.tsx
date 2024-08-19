import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface StatCardProps {
  type: "progress" | "pending" | "resolve";
  count: number;
  label: string;
  icon: string;
}
const StatCard = ({ type, count = 0, label, icon }: StatCardProps) => {
  return (
    <div className={clsx('stat-card', {
        'bg-progress': type === 'progress',
        'bg-pending': type === 'pending',
        'bg-resolved': type === 'resolve',
    })}>
        <div className="flex items-center gap-4">
          <Image 
            src={icon}
            width={32}
            height={32}
            alt={label}
            className="size-8 w-fit"
          />
          <h2 className="text-32-bold text-white">{count}</h2>
        </div>

        <p className="text-14-regular text-white">{label}</p>
    </div>
  )
};

export default StatCard;
