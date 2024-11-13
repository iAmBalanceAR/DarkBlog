const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const categories = [
    {
      name: "Digital Marketing",
      slug: "digital-marketing",
      description: "Insights into digital marketing strategies and trends",
      image: "/images/articleHeaders/header2.jpg"
    },
    {
      name: "Artificial Intelligence",
      slug: "artificial-intelligence",
      description: "Exploring AI, machine learning, and data science",
      image: "/images/articleHeaders/header3.jpg"
    },
    {
      name: "Cybersecurity",
      slug: "cybersecurity",
      description: "Topics covering security, privacy, and data protection",
      image: "/images/articleHeaders/header1.jpg"
    },
    {
      name: "Mobile Development",
      slug: "mobile-development",
      description: "Mobile app development and mobile technologies",
      image: "/images/articleHeaders/header2.jpg"
    },
    {
      name: "Cloud Computing",
      slug: "cloud-computing",
      description: "Cloud technologies, services, and infrastructure",
      image: "/images/articleHeaders/header3.jpg"
    },
    {
      name: "DevOps",
      slug: "devops",
      description: "DevOps practices, tools, and methodologies",
      image: "/images/articleHeaders/header1.jpg"
    },
    {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "User interface and experience design principles",
      image: "/images/articleHeaders/header2.jpg"
    },
    {
      name: "Blockchain",
      slug: "blockchain",
      description: "Blockchain technology and cryptocurrency developments",
      image: "/images/articleHeaders/header3.jpg"
    },
    {
      name: "Data Science",
      slug: "data-science",
      description: "Data analysis, visualization, and big data topics",
      image: "/images/articleHeaders/header1.jpg"
    }
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 