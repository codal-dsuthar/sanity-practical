import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {category} from './documents/category'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {featuresGrid} from './objects/featuresGrid'
import {imageText} from './objects/imageText'
import {settings} from './singletons/settings'
import {home} from './singletons/home'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {contentRelease, versioningObject} from './objects/contentRelease'
import {enhancedImage, mediaAsset} from './objects/enhancedImage'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  home,
  // Documents
  page,
  post,
  person,
  category,
  contentRelease,
  mediaAsset,
  // Objects
  blockContent,
  infoSection,
  callToAction,
  featuresGrid,
  imageText,
  link,
  enhancedImage,
  versioningObject,
]
