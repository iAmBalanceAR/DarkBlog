'use client';

import Link from "next/link"
import Image from "next/image"
import { IMAGES } from "@/app/lib/constants"
import { FOOTER_LINKS } from "@/app/lib/constants"

export function Footer() {
  return (
    <footer className="bg-black text-white py-6 border-t-2 border-green-300">
      <div className="max-w-[1109px] mx-auto px-4">
        <div className="grid grid-cols-6 gap-8">
          <div className="col-span-3">
            <Image 
              src="/images/darkbloglogo.jpg"
              alt="Company Logo" 
              width={145} 
              height={135}
              className="mb-4"
            />
            <div className="space-y-2 text-sm text-white/60">
              <p>123 Dark Blog Ave.72015</p>
              <p>
                <a 
                  href="mailto:arkansasdj@gmail.com"
                  className="hover:text-white transition-colors"
                >
                 arkansasdj@gmail.com
                </a>
              </p>
              <p>
                <a 
                  href="tel:+15016440200"
                  className="hover:text-white transition-colors"
                >
                  +1 (501) 644-0200
                </a>
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {FOOTER_LINKS.Categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Recent Posts</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {FOOTER_LINKS.RecentPosts.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {FOOTER_LINKS.Legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>



      </div>
      <div className="text-xs text-white/40 pt-2 text-center">
            © {new Date().getFullYear()} Simple Web Suff LLC. ALL RIGHTS RESERVED.
          </div>
      </div>
    </footer>
  )
}