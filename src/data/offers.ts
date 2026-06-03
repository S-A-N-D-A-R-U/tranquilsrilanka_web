import type { Offer } from "./types";

export const offers: Offer[] = [
  { id: "1", title: "Summer Special — 15% Off Round Tours", description: "Book any round tour package this summer and save 15% on the total price. Experience Sri Lanka's wonders at unbeatable rates.", image: "/img14.jpg", discount: "15% OFF", valid: "Valid until August 31, 2026", link: "/tours?type=round" },
  { id: "2", title: "Family Day Tour Deal", description: "Families of 4 or more get an extra 10% discount on all day tours. Create memories together for less.", image: "/img18.jpeg", discount: "10% OFF", valid: "Groups of 4 or more", link: "/tours?type=day" },
  { id: "3", title: "Early Bird — Free Airport Transfer", description: "Book your tour 2 months in advance and enjoy a complimentary airport transfer on arrival.", image: "/img20.jpg", discount: "Free Transfer", valid: "Book 60+ days ahead", link: "/transfer" },
  { id: "4", title: "Honeymoon Romance Package", description: "Complimentary couple's spa, candlelit dinner and room upgrade for newlyweds booking our Honeymoon tour.", image: "/img17.jpg", discount: "Free Upgrade", valid: "Show marriage cert.", link: "/tours" },
];