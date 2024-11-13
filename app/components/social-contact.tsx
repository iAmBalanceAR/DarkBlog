'use client'
import { Button } from "@/app/components/UI/button"
import { Input } from "@/app/components/UI/input"
import { Textarea } from "@/app/components/UI/textarea"
import { 
  Facebook, 
  Twitter, 
  Youtube, 
  Instagram 
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/app/lib/utils"
import LoadingSpinner from '@/app/components/LoadingSpinner'

const socialLinks = [
  { 
    icon: Facebook, 
    label: "Facebook", 
    href: "#",
    ariaLabel: "Visit our Facebook page"
  },
  { 
    icon: Twitter, 
    label: "Twitter", 
    href: "#",
    ariaLabel: "Follow us on Twitter"
  },
  { 
    icon: Youtube, 
    label: "YouTube", 
    href: "#",
    ariaLabel: "Subscribe to our YouTube channel"
  },
  { 
    icon: Instagram, 
    label: "Instagram", 
    href: "#",
    ariaLabel: "Follow us on Instagram"
  },
]

interface FormData {
  name: string
  email: string
  message: string
}

export function SocialContact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formDisabled, setFormDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setShowSuccess(true)
      setFormDisabled(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)

    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  return (
    <section 
      className="text-white py-8"
      style={{
        background: 'url("/images/holder/socialbg.png") right no-repeat',
        backgroundColor: '#1d1a1b'
      }}
    >
      <div className="max-w-[1109px] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col">
            <h2 className="text-[1.4rem] font-mono mb-6">Socials</h2>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.ariaLabel}
                  className="flex items-center  rounded-sm gap-3 px-4 py-3 border-1 border-white/20 hover:bg-green-300 transition-colors group"
                >
                  <social.icon className="w-16 h-16 justify-center align-middle m-auto text-white/60 group-hover:text-black transition-colors" />

                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-[1.4rem] font-mono mb-6">Reach Out</h2>
            <div className="relative">
              <form 
                onSubmit={handleSubmit} 
                className={cn(
                  "space-y-3 transition-opacity duration-300",
                  formDisabled && "opacity-50 pointer-events-none"
                )}
              >
                <Input 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  disabled={formDisabled}
                  className="h-8 bg-white/5 border-white/10 focus-visible:border-green-300 border-1 rounded-sm focus-visible:ring-0 placeholder:text-white/40 text-sm"
                />
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={formDisabled}
                  className="h-8 bg-white/5 border-white/10 focus-visible:border-green-300 border-1 rounded-sm focus-visible:ring-0 placeholder:text-white/40 text-sm"
                />
                <Textarea 
                  placeholder="Message" 
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  disabled={formDisabled}
                  className="bg-white/5 border-white/10 focus-visible:border-green-300 border-1 rounded-sm focus-visible:ring-0 placeholder:text-white/40 text-sm resize-none"
                  rows={3}
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || formDisabled}
                  className="hover:bg-green-400 h-8 text-xs rounded-sm bg-green-200 text-black transition-colors w-auto float-right"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>

              {(isLoading || showSuccess) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isLoading ? (
                    <div className="bg-gray-800/90 border border-gray-700 rounded-lg p-4">
                      <LoadingSpinner size="large" />
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400 animate-fade-out">
                      Message sent successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}