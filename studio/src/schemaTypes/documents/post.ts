import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the post to show up in the preview',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'High-level description of the blog post',
      type: 'text',
    }),
    defineField({
      name: 'relatedImage',
      title: 'Related Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.relatedImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedDate',
      title: 'Updated Date',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for categorizing and filtering posts (e.g., Featured, Technology, Design)',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark this post as featured',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      authorUsername: 'author.username',
      date: 'publishDate',
      media: 'relatedImage',
    },
    prepare({title, media, authorFirstName, authorLastName, authorUsername, date}) {
      const authorName = authorFirstName && authorLastName
        ? `${authorFirstName} ${authorLastName}`
        : authorUsername

      const subtitles = [
        authorName && `by ${authorName}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return {title, media, subtitle: subtitles.join(' ')}
    },
  },
})
