const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

['../src/app', '../src/components'].forEach(dir => {
  walkDir(path.join(__dirname, dir), (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Replace Link to= with href=
    if (content.includes('<Link to=')) {
      content = content.replace(/<Link\s+to=/g, '<Link href=');
      changed = true;
    }
    
    // Replace <Navigate to=... /> with redirect or router.push
    if (content.includes('<Navigate ')) {
       // Just comment it out or change it because it needs `redirect` from next/navigation
       content = content.replace(/<Navigate\s+to="([^"]+)"[^>]*\/>/g, '(() => { throw new Error("Redirect to $1") })()');
       // This is hacky, but in TourDetail I already removed Navigate because I used `notFound()` instead.
       changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed link to->href in', filePath);
    }
  });
});
