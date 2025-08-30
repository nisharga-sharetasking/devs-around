import Link from 'next/link'
import React from 'react'

const AuthFooter = ({ title, label, url }: { title: string; label: string; url: string }) => {
  return (
    <div className="">
      <div className="mb-4"></div>
      <div className="flex gap-1">
        <h4>{title}</h4>
        <Link href={url} className="text-primary/90">
          {label}
        </Link>
      </div>
    </div>
  )
}

export default AuthFooter
