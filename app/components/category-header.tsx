import Image from "next/image"
import { Button } from "@/app/components/UI/button"
import { RssIcon } from "lucide-react"
import { IMAGES } from "@/app/lib/constants"

interface CategoryHeaderProps {
  title: string
  description: string
  articleCount?: number
  image?: string
  showRssFeed?: boolean
}

export function CategoryHeader({
  title,
  description,
  articleCount,
  image = IMAGES.geometricBlack,
  showRssFeed = true
}: CategoryHeaderProps) {
  return (
    <section className="container mx-auto">
      <div className="bg-white border-l-2 border-r-2 max-w-[1109px] mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12 items-center ">
          <div>
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-mono mb-4 leading-tight">
                  {title}
                </h1>
                <p className="text-lg text-[rgba(0,0,0,0.65)] leading-relaxed">
                  {description}
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                {articleCount !== undefined && (
                  <div className="text-sm">
                    <span className="font-medium">{articleCount}</span>
                    <span className="text-[rgba(0,0,0,0.45)]"> articles</span>
                  </div>
                )}
                
                {showRssFeed && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-2 rounded-none hover:bg-[rgba(0,0,0,0.04)]"
                  >
                    <RssIcon className="h-4 w-4" />
                    <span>RSS Feed</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className=" relative aspect-square w-full md:w-auto">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.02)]" />
            <Image
              src={image}
              alt={`${title} category`}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}