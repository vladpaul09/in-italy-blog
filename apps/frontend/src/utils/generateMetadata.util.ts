import { Metadata } from "next";
import config from "@/config";

interface GenerateMetadataParams {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export const generatePageMetadata = ({
  title,
  description,
  image,
  url,
  type = "website",
}: GenerateMetadataParams): Metadata => {
  const fullTitle = title.includes("|") ? title : `${title} | ${config.seo.APP_NAME}`;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${config.domain}${image}`
    : `${config.domain}/statics/website/logo.png`;
  const pageUrl = url ? `${config.domain}${url}` : config.domain;

  return {
    title: fullTitle,
    description,
    openGraph: {
      type,
      siteName: config.seo.APP_NAME,
      title: fullTitle,
      description,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: config.seo.APP_DEFAULT_TITLE,
    },
  };
};

