/**
 * Enhanced Image with Aspect Ratio Support
 * 
 * Extends standard Sanity image with custom aspect ratio presets
 * Provides flexible media management with:
 * - Predefined aspect ratios
 * - Custom aspect ratio support
 * - Alt text and caption
 * - Asset metadata
 */

import { defineType, defineField } from 'sanity';
import { ImageIcon } from '@sanity/icons';

export const enhancedImage = defineType({
  name: 'enhancedImage',
  title: 'Enhanced Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
        accept: 'image/*',
      },
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (original)', value: 'auto' },
          { title: 'Square (1:1)', value: '1:1' },
          { title: 'Portrait (3:4)', value: '3:4' },
          { title: 'Landscape (4:3)', value: '4:3' },
          { title: 'Widescreen (16:9)', value: '16:9' },
          { title: 'Cinema (21:9)', value: '21:9' },
          { title: 'Golden Ratio (1.618:1)', value: '1.618:1' },
          { title: 'Custom', value: 'custom' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'auto',
      description: 'Select the aspect ratio for image display',
    }),
    defineField({
      name: 'customAspectRatio',
      title: 'Custom Aspect Ratio',
      type: 'string',
      hidden: ({ parent }) => parent?.aspectRatio !== 'custom',
      description: 'Enter custom aspect ratio as width:height (e.g., 3:2)',
      placeholder: '16:9',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;
          const match = value.match(/^\d+:?\d*$/);
          return match ? true : 'Format should be width:height (e.g., 3:2)';
        }),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative Text',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Describe the image content for accessibility',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption to display below the image',
    }),
    defineField({
      name: 'credit',
      title: 'Image Credit',
      type: 'string',
      description: 'Photographer, artist, or source credit',
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        {
          name: 'width',
          title: 'Original Width (px)',
          type: 'number',
          readOnly: true,
        },
        {
          name: 'height',
          title: 'Original Height (px)',
          type: 'number',
          readOnly: true,
        },
        {
          name: 'size',
          title: 'File Size (bytes)',
          type: 'number',
          readOnly: true,
        },
        {
          name: 'format',
          title: 'Format',
          type: 'string',
          readOnly: true,
        },
      ],
      hidden: true,
    }),
  ],
  preview: {
    select: {
      image: 'image',
      alt: 'alt',
      aspect: 'aspectRatio',
    },
    prepare(selection) {
      const { image, alt, aspect } = selection;
      return {
        title: alt || 'Untitled image',
        subtitle: aspect && aspect !== 'auto' ? `Aspect: ${aspect}` : undefined,
        media: image,
      };
    },
  },
});

/**
 * Media Asset - Centralized media management
 */
export const mediaAsset = defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Asset Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Detailed description of the asset',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Searchable tags for organization',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Images', value: 'hero' },
          { title: 'Blog Post Images', value: 'blog' },
          { title: 'Icons & Graphics', value: 'icons' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Product Images', value: 'products' },
          { title: 'Team Photos', value: 'team' },
          { title: 'Backgrounds', value: 'backgrounds' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'credit',
      title: 'Credit/Attribution',
      type: 'string',
      description: 'Who created or owns this asset',
    }),
    defineField({
      name: 'license',
      title: 'License',
      type: 'string',
      options: {
        list: [
          { title: 'Proprietary', value: 'proprietary' },
          { title: 'Creative Commons', value: 'cc' },
          { title: 'Stock License', value: 'stock' },
          { title: 'Public Domain', value: 'public_domain' },
          { title: 'Other', value: 'other' },
        ],
      },
      description: 'License terms for this asset',
    }),
    defineField({
      name: 'usageCount',
      title: 'Usage Count',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Number of times this asset is used in documents',
    }),
    defineField({
      name: 'uploadedBy',
      title: 'Uploaded By',
      type: 'reference',
      to: [{ type: 'person' }],
      readOnly: true,
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Upload Date',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      image: 'image',
    },
    prepare(selection) {
      const { title, category, image } = selection;
      return {
        title,
        subtitle: category,
        media: image,
      };
    },
  },
});
