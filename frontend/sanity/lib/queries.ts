import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const linkReference = `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const postFields = `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  "excerpt": summary,
  "coverImage": relatedImage,
  "date": coalesce(publishDate, _updatedAt),
  "author": author->{
    username,
    firstName,
    lastName,
    "picture": headshotImage
  },
  tags,
  categories[]->{
    title,
    "slug": slug.current
  },
  featured,
`;

export const homeQuery = defineQuery(`
  *[_type == "home" && _id == "homePage"][0]{
    _id,
    _type,
    title,
    heroTitle,
    heroTitleHighlight,
    heroDescription,
    heroPrimaryAction,
    heroSecondaryAction,
    heroPill,
    showPostsSection,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "imageText" => {
        ...,
        "image": image{
          ...,
          asset->
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

const linkFields = `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[(_type == "page" || _type == "post") && defined(slug.current) && !(_id in path("drafts.**"))] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const filteredPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && (!defined($tag) || $tag in tags)
    && (!defined($featured) || featured == $featured)
  ] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const paginatedPostsQuery = defineQuery(`
  *[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && (!defined($tag) || $tag in tags)
    && (!defined($featured) || featured == $featured)
  ] | order(date desc, _updatedAt desc) [$start...$end] {
    ${postFields}
  }
`);

export const postCountQuery = defineQuery(`
  count(*[_type == "post"
    && defined(slug.current)
    && !(_id in path("drafts.**"))
    && (!defined($tag) || $tag in tags)
    && (!defined($featured) || featured == $featured)
  ])
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current) && !(_id in path("drafts.**"))] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const allTagsQuery = defineQuery(`
  array::unique(*[_type == "post" && !(_id in path("drafts.**")) && defined(tags)].tags[])
`);

export const allAuthorsQuery = defineQuery(`
  *[_type == "person"] | order(username asc) {
    _id,
    username,
    firstName,
    lastName,
    slug,
    "headshotUrl": headshotImage.asset->url
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))] [0] {
    "content": body[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);
