import sharp from "sharp";
// placeholders de muestra (imágenes, no texto real)
for (const n of [1, 2, 3]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="1754">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <rect x="0" y="0" width="1240" height="14" fill="#7fb6e3"/>
  <rect x="110" y="170" width="520" height="34" rx="6" fill="#e6eef6"/>
  <rect x="110" y="236" width="840" height="60" rx="8" fill="#d4e4f3"/>
  <rect x="110" y="380" width="1020" height="560" rx="24" fill="#f2f6fa"/>
  <circle cx="620" cy="660" r="110" fill="none" stroke="#c9a24a" stroke-width="6" opacity=".6"/>
  ${[1010,1060,1110,1160,1210,1300,1350,1400,1450].map((y,i)=>`<rect x="110" y="${y}" width="${i%4===3?640:1020}" height="18" rx="9" fill="#eceff3"/>`).join("")}
  <text x="620" y="1640" font-family="Inter, DejaVu Sans" font-size="34" fill="#9aa7b4" text-anchor="middle">Página de muestra ${n} · pendiente</text>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(`public/muestra/pagina-${n}.webp`);
}
