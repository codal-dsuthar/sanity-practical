import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Home page schema Singleton
 * This singleton allows you to manage the content on the home page
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const home = defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  options: {
    singleton: true,
  },
  fields: [
    defineField({
      name: 'title',
      description: 'Page title for SEO',
      title: 'Title',
      type: 'string',
      initialValue: demo.homeTitle,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      description: 'Main hero section title',
      title: 'Hero Title',
      type: 'string',
      initialValue: demo.homeHeroTitle,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroTitleHighlight',
      description: 'Highlighted word in hero title (optional)',
      title: 'Hero Title Highlight',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      description: 'Hero section description',
      title: 'Hero Description',
      type: 'text',
      initialValue: demo.homeHeroDescription,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroPrimaryAction',
      title: 'Hero Primary Action',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroSecondaryAction',
      title: 'Hero Secondary Action',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'heroPill',
      title: 'Hero Pill Badge',
      type: 'object',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Link',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'showPostsSection',
      title: 'Show Posts Section',
      type: 'boolean',
      description: 'Toggle to show/hide the posts section on the home page',
      initialValue: true,
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      description: 'Add content sections to the home page',
      type: 'array',
      of: [
        {type: 'callToAction'},
        {type: 'infoSection'},
        {type: 'featuresGrid'},
        {type: 'imageText'},
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
