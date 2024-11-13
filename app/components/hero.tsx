'use client';

import Image from "next/image"
import { IMAGES } from "@/app/lib/constants"
import { Input } from "@/app/components/UI/input"
import { Button } from "@/app/components/UI/button"
import { Search } from "lucide-react"
import { useState } from "react"
import { Navigation } from "./navigation"
import { NavigationWrapper } from "./navigation-wrapper"

interface Author {
  name: string
  image: string
  role: string
}
    
interface HeroProps {
}

export function Hero({ 

}: HeroProps) {
  return (
    <>
      <section 
        style={{
          maxHeight: 300,
          background: 'url("/images/holder/headbgnew.png") center ',
        }}
      >  
        <div className="max-w-[1109px] mx-auto px-4 pt-4 pb-8">
          <div className="flex justify-start mb-4">
            <div className="flex justify-left items-start gap-12">
              <div className="flex-2">
                <h1 className="text-4xl md:text-5xl font-mono ml-2 mr-2 mt-5 mb-5 float-left">
                  <span className="bg-green-200 bg-opacity-80 mb-4 leading-relaxed">
                    The thoughts of a<br />wandering mind with a <br />twist of technobabble.
                  </span>               
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>     
      <NavigationWrapper />
    </>
  )
}