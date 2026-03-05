'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumb() {
  const paths = usePathname();
  const pathNames = paths.split('/').filter(path => path);

  if (pathNames.length === 0) return null;

  // Génération du JSON-LD pour Google (Structured Data)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": pathNames.map((path, index) => {
      const href = `/${pathNames.slice(0, index + 1).join('/')}`;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        "item": `https://keepproof.com${href}`
      };
    })
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      {/* Script JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="hover:text-blue-400 transition">KeepProof</Link>
        </li>
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`;
          const itemLink = link.charAt(0).toUpperCase() + link.slice(1).replace(/-/g, ' ');
          const isLast = index === pathNames.length - 1;

          return (
            <li key={index} className="flex items-center">
              <span className="mx-2 text-gray-700">/</span>
              {isLast ? (
                <span className="text-white font-medium cursor-default">{itemLink}</span>
              ) : (
                <Link href={href} className="hover:text-blue-400 transition">
                  {itemLink}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
