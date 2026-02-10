import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  structuredData?: Record<string, any>;
}

const SEO: React.FC<SEOProps> = ({
  title = "Victor Software - Giải Pháp Số Toàn Diện",
  description = "Chuyên cung cấp giải pháp thiết kế website, phần mềm và marketing online chuyên nghiệp.",
  keywords = "thiết kế website, phần mềm, marketing online, seo, ads",
  image = "/logo.png",
  url,
  type = "website",
  siteName = "Victor Software",
  structuredData
}) => {
  const location = useLocation();
<<<<<<< HEAD:src/components/SEO.tsx
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
=======
  const DOMAIN = 'https://www.victorsoftwave.com';
  const currentUrl = url || `${DOMAIN}${location.pathname}`;
>>>>>>> 539f2cc (Update_domain_and_backend_files):frontend/src/components/SEO.tsx
  
  // Ensure absolute URL for image
  const fullImageUrl = image?.startsWith('http') 
    ? image 
<<<<<<< HEAD:src/components/SEO.tsx
    : `${window.location.origin}${image?.startsWith('/') ? '' : '/'}${image}`;
=======
    : `${DOMAIN}${image?.startsWith('/') ? '' : '/'}${image}`;
>>>>>>> 539f2cc (Update_domain_and_backend_files):frontend/src/components/SEO.tsx

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
