export const IMAGES = {
  geometricBlack: "/images/holder/image(1).png",
  wireCube: "/images/holder/image(2).png",
  colorfulHexagon: "/images/holder/image(3).png",
  pillsImage: "/images/holder/image(4).png"
}

export const ROUTES = {
  home: '/',
  category: (slug: string) => `/category/${slug}`,
  article: (slug: string) => `/article/${slug}`,
  about: '/about',
  contact: '/contact'
}

export const CATEGORIES = [
  {
    name: 'EXPERTS',
    slug: 'experts',
    description: 'Insights from industry leaders and technical experts'
  },
  {
    name: 'INSIGHTS & TRENDS',
    slug: 'insights-and-trends',
    description: 'Analysis of emerging patterns and future directions'
  },
  {
    name: 'HOW TO',
    slug: 'how-to',
    description: 'Step-by-step guides and tutorials'
  },
  {
    name: 'B2B',
    slug: 'b2b',
    description: 'Business-to-business strategies and solutions'
  },
  {
    name: 'NEWS',
    slug: 'news',
    description: 'Latest updates and announcements'
  },
  {
    name: 'STORIES',
    slug: 'stories',
    description: 'Real-world case studies and experiences'
  }
]

export const SITE_CONFIG = {
  name: 'Balance Blog Dark',
  description: 'A blog template for people being serious about searious things.',
  url: 'https://localhostL3000',
  ogImage: "/images/holder/holder2.jpg",
  links: {
    twitter: 'https://twitter.com/nope',
    github: 'https://github.com/nope'
  }
}

export const FOOTER_LINKS = {
  Categories: [
    { name: 'Experts', href: '#' },
    { name: 'B2B', href: '#' },
    { name: 'Stories', href: '#' },
    { name: 'Thoughts', href: '#' }
  ],
  RecentPosts: [
    { name: 'Platform Features', href: '#' },
    { name: 'Alloy Method', href: '#' },
    { name: 'Headless Mode', href: '#' },
    { name: 'Custom Connector Builder', href: '#' }
  ],
  Legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Status', href: '#' }
  ]
}