const fs = require('fs');
const path = require('path');

const OLD_PAGES_DIR = path.join(__dirname, '../..', 'serene-sri-lanka-escapes/src/pages');
const NEW_APP_DIR = path.join(__dirname, '../src/app');

const pagesToMigrate = [
  { file: 'About.tsx', route: 'about' },
  { file: 'Contact.tsx', route: 'contact' },
  { file: 'Tours.tsx', route: 'tours' },
  { file: 'Offers.tsx', route: 'offers' },
  { file: 'Blog.tsx', route: 'blog' },
  { file: 'SeatInCoach.tsx', route: 'seat-in-coach' },
  { file: 'ThingsToDo.tsx', route: 'things-to-do' },
  { file: 'Transfer.tsx', route: 'transfer' },
  { file: 'TravelGuide.tsx', route: 'travel-guide' },
];

pagesToMigrate.forEach(({ file, route }) => {
  const oldPath = path.join(OLD_PAGES_DIR, file);
  if (!fs.existsSync(oldPath)) return;

  let content = fs.readFileSync(oldPath, 'utf8');

  // Basic SEO extraction
  let title = "Tranquil Sri Lanka";
  let description = "Discover Sri Lanka";
  const titleMatch = content.match(/title="([^"]+)"/);
  const descMatch = content.match(/description="([^"]+)"/);
  if (titleMatch) title = titleMatch[1];
  if (descMatch) description = descMatch[1];

  // Remove SEO component usage
  content = content.replace(/<SEO[^>]+>\s*<\/SEO>/g, '');
  content = content.replace(/<SEO[^>]+\/>/g, '');
  content = content.replace(/import SEO from "[^"]+";/g, '');

  // Add Metadata export
  const metadataStr = `
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title}",
  description: "${description}",
};
`;

  // Fix imports from react-router-dom
  if (content.includes('import { Link } from "react-router-dom"')) {
    content = content.replace('import { Link } from "react-router-dom";', 'import Link from "next/link";');
  }

  // Add "use client" if there are hooks
  let isClient = false;
  if (content.includes('useState(') || content.includes('useEffect(')) {
    isClient = true;
    content = '"use client";\n' + content;
  }

  if (!isClient) {
    content = metadataStr + '\n' + content;
  }

  const newRouteDir = path.join(NEW_APP_DIR, route);
  fs.mkdirSync(newRouteDir, { recursive: true });
  fs.writeFileSync(path.join(newRouteDir, 'page.tsx'), content);
});

console.log('Pages migrated.');
