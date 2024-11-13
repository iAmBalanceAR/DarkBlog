import Image from "next/image"
import { IMAGES } from "@/app/lib/constants"
import { cn } from "@/app/lib/utils"

interface SpacerProps {
  height?: string
  opacity?: number
  image?: string
  showHoverEffect?: boolean
  className?: string
}

export function Spacer({ 
  height = "h-32", 
  opacity = 0.1,
  image = IMAGES.wireCube,
  showHoverEffect = true,
  className
}: SpacerProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-black",
      height,
      className
    )}>
      <Image
        src={image}
        alt="Decorative geometric pattern"
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          showHoverEffect && "hover:opacity-20"
        )}
        style={{ opacity }}
      />
    </div>
  )
}