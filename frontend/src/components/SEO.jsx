import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_SITE_TITLE = "K6 LAB — Local-First Performance Testing";
const DEFAULT_DESCRIPTION =
  "K6 LAB is a local-first performance testing platform with native k6 execution, real-time telemetry, visual test builder, and AI-powered insights.";
const DEFAULT_KEYWORDS =
  "k6, performance testing, load testing, local-first, developer tools, telemetry, benchmarking, API testing, visual k6 GUI";
const DEFAULT_IMAGE = "/logo.png";
const SITE_NAME = "K6 LAB";

const DEFAULT_SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "K6 LAB",
  "operatingSystem": "macOS, Linux, Windows",
  "applicationCategory": "DeveloperApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": DEFAULT_DESCRIPTION,
  "url": "https://k6lab.com",
  "featureList": [
    "Native k6 test engine",
    "Real-time latency telemetry",
    "Visual k6 test builder",
    "AI bottleneck analysis",
    "Local-first data isolation"
  ]
};

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  schema = null,
}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : DEFAULT_SITE_TITLE;
    document.title = fullTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (attributeName, attributeValue, contentValue) => {
      let element = document.querySelector(
        `meta[${attributeName}="${attributeValue}"]`
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper function to update or create link tags
    const setLinkTag = (relValue, hrefValue) => {
      let element = document.querySelector(`link[rel="${relValue}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", relValue);
        document.head.appendChild(element);
      }
      element.setAttribute("href", hrefValue);
    };

    // Helper function to inject or update JSON-LD Schema
    const setJsonLdSchema = (schemaData) => {
      let script = document.getElementById("json-ld-seo-schema");
      if (!schemaData) {
        if (script) script.remove();
        return;
      }
      if (!script) {
        script = document.createElement("script");
        script.id = "json-ld-seo-schema";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schemaData);
    };

    // Current page canonical URL
    const currentUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${location.pathname}`
        : location.pathname;

    const fullImageUrl = image.startsWith("http")
      ? image
      : typeof window !== "undefined"
      ? `${window.location.origin}${image}`
      : image;

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    // 3. Open Graph (OG) Meta Tags
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("property", "og:image", fullImageUrl);

    // 4. Twitter Card Meta Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", fullImageUrl);

    // 5. Canonical Link
    setLinkTag("canonical", currentUrl);

    // 6. JSON-LD Schema (Structured Data for Search Engines)
    if (!noindex) {
      const activeSchema = schema || DEFAULT_SOFTWARE_SCHEMA;
      setJsonLdSchema(activeSchema);
    } else {
      setJsonLdSchema(null);
    }
  }, [title, description, keywords, image, type, noindex, schema, location.pathname]);

  return null;
}
