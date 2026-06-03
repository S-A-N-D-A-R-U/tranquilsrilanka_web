import type { BlogPost } from "./types";

export const posts: BlogPost[] = [
  {
    slug: "best-time-to-visit-sri-lanka-2026",
    title: "When is the best time to visit Sri Lanka? A 2026 month-by-month guide",
    excerpt: "From the dry south coast in January to whale watching in Trincomalee in August — pick the perfect window for your trip.",
    image: "/img23.jpg",
    category: "Travel Tips",
    author: "Tranquil Editor",
    date: "March 12, 2026",
    readTime: "7 min read",
    content: [
      "Sri Lanka has two monsoons, which means that no matter when you travel, somewhere on the island has perfect weather.",
      "December through April is the dry season for the south and west coasts — think Mirissa, Galle, Bentota. The east coast (Trincomalee, Arugam Bay) flips and is best from May through September.",
      "The Cultural Triangle and hill country are accessible all year, though the hills can be cool in January and lush after monsoon rains.",
      "Our recommendation: combine a coast and a hill stay. The drive between them is part of the magic.",
    ],
  },
  {
    slug: "sigiriya-vs-pidurangala",
    title: "Sigiriya vs Pidurangala — which rock should you climb?",
    excerpt: "Two iconic rocks, two very different climbs. Here's how to choose (or do both).",
    image: "/img8.jpg",
    category: "Things to Do",
    author: "Asanka Perera",
    date: "February 28, 2026",
    readTime: "5 min read",
    content: [
      "Sigiriya is the headline act — a 5th-century palace on top of a 200m monolith, complete with frescoes and water gardens.",
      "Pidurangala is right next door, cheaper to enter, and gives you the iconic photograph: Sigiriya rising out of the jungle at sunrise.",
      "Our advice: climb Pidurangala for sunrise (be there by 5am), then Sigiriya in the late afternoon when the heat eases.",
    ],
  },
  {
    slug: "sri-lanka-train-rides",
    title: "Riding the Kandy → Ella train: insider tips for the world's most beautiful rail journey",
    excerpt: "How to book the right seat, what to pack, and where to stand for the perfect photo.",
    image: "/img6.jpg",
    category: "Adventure",
    author: "Tranquil Editor",
    date: "February 15, 2026",
    readTime: "6 min read",
    content: [
      "The 7-hour journey from Kandy to Ella climbs through tea estates, tunnels and the famous Nine Arch Bridge.",
      "Book 1st-class observation 30 days ahead, or arrive early for an unreserved 2nd-class seat — the windows open and the breeze is glorious.",
      "Sit on the right side from Kandy to Nanu Oya, then swap to the left from Nanu Oya to Ella for the best views.",
    ],
  },
  {
    slug: "sri-lanka-food-guide",
    title: "A first-timer's guide to Sri Lankan food",
    excerpt: "From string hoppers to kottu — what to order, where to eat, and how spicy is too spicy.",
    image: "/img18.jpeg",
    category: "Food & Drink",
    author: "Niro Fernando",
    date: "January 30, 2026",
    readTime: "8 min read",
    content: [
      "Sri Lankan food is bold, coconut-rich and gloriously varied. Forget what you know about Indian curry — this is its spicier cousin.",
      "Must try: hoppers (appa) for breakfast, rice & curry for lunch, kottu roti for dinner, and curd & treacle for dessert.",
      "Pro tip: ask for 'tourist spicy' if you're unsure — even that will be hot for most palates.",
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);