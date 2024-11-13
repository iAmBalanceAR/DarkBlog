'use client'

import { Facebook, Linkedin, Mail, Link as LinkIcon, X } from 'lucide-react'
import { useState } from 'react'

interface SocialShareProps {
  title: string
  url: string
}

export function SocialShare({ title, url }: SocialShareProps) {
  const [showCopied, setShowCopied] = useState(false)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'X',
      icon: X,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-black',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: 'hover:bg-blue-700',
    },
    {
      name: 'Email',
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      color: 'hover:bg-green-600',
    },
  ]

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 2000)
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-full bg-gray-100 text-gray-600 hover:text-white transition-colors ${link.color}`}
          title={`Share on ${link.name}`}
        >
          <link.icon className="w-5 h-5" />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-700 hover:text-white transition-colors relative"
        title="Copy link"
      >
        <LinkIcon className="w-5 h-5" />
        {showCopied && (
          <span className="absolute left-full ml-2 whitespace-nowrap bg-gray-800 text-white text-sm px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  )
} 