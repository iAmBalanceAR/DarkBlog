import Layout from "@/app/components/layout"
import { Hero } from "@/app/components/hero"
import { BlogGrid } from "@/app/components/blog-grid"
import { IMAGES } from "@/app/lib/constants"

const articles = [
  { img: IMAGES.geometricBlack, title: "The Architecture of Thought", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.colorfulHexagon, title: "Patterns in Chaos", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.pillsImage, title: "The Psychology of Color", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.wireCube, title: "Structure and Form", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.wireCube, title: "Digital Frameworks", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.geometricBlack, title: "The Space Between", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.colorfulHexagon, title: "Chromatic Harmony", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
  { img: IMAGES.pillsImage, title: "Form Follows Function", category: "INSIGHTS & TRENDS", subcategory: "TECHNOLOGY" },
]

export default function HomePage() {
  const formattedArticles = articles.map(article => ({
    img: article.img,
    title: article.title,
    category: article.category,
    subcategory: article.subcategory,
    slug: "",
    categorySlug: "",
    blurb: ""
  }))

  return (
    <Layout>
      <Hero />
      <BlogGrid 
        title="Latest Articles" 
        blogs={formattedArticles}
      />
    </Layout>
  )
}