import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": `https://icptiger.com${item.href}`,
        name: item.name,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav className="flex text-sm text-gray-600 my-4">
        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <Link
              href={item.href}
              className={`hover:text-primary transition-colors ${
                index === items.length - 1 ? 'text-gray-900 font-medium' : ''
              }`}
            >
              {item.name}
            </Link>
          </div>
        ))}
      </nav>
    </>
  );
} 