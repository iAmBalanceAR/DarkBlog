'use client'

import { useState } from 'react'
import { Twitter, Facebook, Linkedin, Link2, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareToolsProps {
  title: string
  url: string
  description?: string
}

export function ShareTools({ title, url, description }: ShareToolsProps) {
  const [showCopied, setShowCopied] = useState(false)
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDesc = encodeURIComponent(description || '')

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <div className="bg-white z-10 p-4 rounded-lg border border-slate-500 fixed -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      <motion.div className="flex flex-col gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <button 
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 group"
        >
          <Twitter className="w-5 h-5 text-gray-600 group-hover:text-blue-400" />
        </button>

        <button 
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 group"
        >
          <Facebook className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
        </button>

        <button 
          onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`, '_blank')}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 group"
        >
          <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-700" />
        </button>

        <button 
          onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, '_blank')}
          className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 group"
        >
          <Mail className="w-5 h-5 text-gray-600 group-hover:text-green-500" />
        </button>

        <div className="relative">
          <button 
            onClick={copyToClipboard}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:-translate-y-1 group"
          >
            <Link2 className="w-5 h-5 text-gray-600 group-hover:text-purple-500" />
          </button>
          <AnimatePresence>
            {showCopied && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 40 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-black text-white text-sm py-1 px-2 rounded"
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
} 