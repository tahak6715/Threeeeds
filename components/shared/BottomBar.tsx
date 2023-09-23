"use client";

import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

const BottomBar = () => {

    const router = useRouter();
    const pathname = usePathname();
  return (
    <>
    <section className='bottombar'>
        <div className='bottombar_container'>
        {
                sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1 ) || pathname === link.route;



                return (
                    <Link
                     href={"/"}
                     
                     className={`bottombar_link  ${isActive && 'bg-purple-500'}`}
                     >
                        <Image src={link.imgURL} alt={link.label} width="24" height="24" />
                        <p className='text-light-1 text-subtle-medium max-sm:hidden'>
                            {link.label.split(/\s+/)[0]}
                            
                        </p>
                    </Link>
                ) })
            }

        </div>

    </section>
    </>
  )
}

export default BottomBar
