import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: string;
  schema?: object;
}

export default function SEOHead({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  schema
}: SEOHeadProps) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Open Graph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', `https://www.comparetheconveyancingmarket.co.uk${canonicalPath}`);

    for (const [name, content] of Object.entries({
      'twitter:title': title,
      'twitter:description': description,
      'twitter:url': `https://www.comparetheconveyancingmarket.co.uk${canonicalPath}`,
    })) {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    }
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', ogType);

    // Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.comparetheconveyancingmarket.co.uk${canonicalPath}`);

    // Update JSON-LD Schema if provided
    let schemaScript = document.querySelector('#dynamic-page-schema') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = 'dynamic-page-schema';
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      schemaScript?.remove();
    }
  }, [title, description, canonicalPath, ogType, schema]);

  return null;
}
