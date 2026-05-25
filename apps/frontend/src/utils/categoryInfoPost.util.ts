import { category, categoryWithInfoPosts } from "@/types/category.type";

export const categoryArticleInfoPost = (category: category): categoryWithInfoPosts => ({
  id: category.id,
  slug: category.slug,
  image: category.image,
  mobileImage: category.mobileImage,
  parentId: category.parentId,
  name: category.name,
  description: category.description,
  pageView: category.pageView,
  infoPosts: (category.articles || []).map((article) => ({
    image: article.image,
    mobileImage: article.mobileImage,
    slug: article.slug,
    title: article.title,
    url: `/articolo/${article.slug}`,
    description: article.description,
  })),
});

export const categoryEventInfoPost = (category: category): categoryWithInfoPosts => ({
  id: category.id,
  slug: category.slug,
  image: category.image,
  mobileImage: category.mobileImage,
  parentId: category.parentId,
  name: category.name,
  description: category.description,
  pageView: category.pageView,
  infoPosts: (category.events || []).map((event) => ({
    image: event.image,
    mobileImage: event.mobileImage,
    title: event.title,
    slug: event.slug,
    url: `/evento/${event.slug}`,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
  })),
});

export const categoryPodcastInfoPost = (category: category): categoryWithInfoPosts => ({
  id: category.id,
  slug: category.slug,
  image: category.image,
  mobileImage: category.mobileImage,
  parentId: category.parentId,
  name: category.name,
  description: category.description,
  pageView: category.pageView,
  infoPosts: (category.podcasts || []).map((podcast) => ({
    image: podcast.image,
    mobileImage: podcast.mobileImage,
    title: podcast.title,
    youtubeLink: podcast.youtubeLink,
    slug: podcast.slug,
    url: `/podcast/${podcast.slug}`,
    description: podcast.description,
  })),
});
