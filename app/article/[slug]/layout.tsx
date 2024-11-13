import Header from '@/app/components/header'
import { Footer } from '@/app/components/footer'
import { Hero } from '@/app/components/hero'

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <Hero />
      <main>{children}</main>
      <Footer />
    </>
  )
} 