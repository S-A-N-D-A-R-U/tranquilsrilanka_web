const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, '../src/components'), (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Link replacements
  if (content.includes('import { Link } from "react-router-dom"')) {
    content = content.replace('import { Link } from "react-router-dom";', 'import Link from "next/link";');
    changed = true;
  }
  if (content.includes('import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"')) {
    content = content.replace(
      'import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";',
      'import Link from "next/link";\nimport { usePathname, useRouter } from "next/navigation";'
    );
    // Add "use client" if it uses hooks
    if (!content.startsWith('"use client"')) {
      content = '"use client";\n' + content;
    }
    // Replace useLocation with usePathname
    content = content.replace(/const location = useLocation\(\);/g, 'const pathname = usePathname();');
    content = content.replace(/location\.pathname/g, 'pathname');
    // Replace useNavigate with useRouter
    content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
    content = content.replace(/navigate\(/g, 'router.push(');
    // Replace NavLink with Link
    content = content.replace(/<NavLink/g, '<Link');
    content = content.replace(/<\/NavLink>/g, '</Link>');
    
    changed = true;
  }
  
  if (content.includes('import { useNavigate } from "react-router-dom"')) {
    content = content.replace('import { useNavigate } from "react-router-dom";', 'import { useRouter } from "next/navigation";');
    if (!content.startsWith('"use client"')) {
      content = '"use client";\n' + content;
    }
    content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
    content = content.replace(/navigate\(/g, 'router.push(');
    changed = true;
  }
  
  // Also check if any file has hooks like useState/useEffect and add "use client"
  if ((content.includes('useState(') || content.includes('useEffect(')) && !content.startsWith('"use client"')) {
    content = '"use client";\n' + content;
    changed = true;
  }

  // Next.js Image component optimization? For now just keep standard img tags to keep styling same,
  // or use next/image. The original app used <img src={image} />. We can leave it as is to avoid styling issues.

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
});
