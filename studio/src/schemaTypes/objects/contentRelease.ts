/**
 * Content Release Schema Object
 * 
 * Enables version management and release workflows
 * - Track document versions
 * - Schedule releases
 * - Manage release changelogs
 * - Webhook triggers on version changes
 * 
 * This is a singleton document that manages the release process
 * Usage: Add to any document that needs version tracking
 */

import { defineType, defineField } from 'sanity';
import { CalendarIcon } from '@sanity/icons';

export const contentRelease = defineType({
  name: 'contentRelease',
  title: 'Content Release',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Release Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
      description: 'When this content should be published',
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Semantic version (e.g., 1.0.0)',
      placeholder: '1.0.0',
    }),
    defineField({
      name: 'status',
      title: 'Release Status',
      type: 'string',
      options: {
        list: [
          { title: 'Planning', value: 'planning' },
          { title: 'Ready for Review', value: 'review' },
          { title: 'Approved', value: 'approved' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Released', value: 'released' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'planning',
    }),
    defineField({
      name: 'changelog',
      title: 'Changelog',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Change Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Added', value: 'added' },
                  { title: 'Modified', value: 'modified' },
                  { title: 'Fixed', value: 'fixed' },
                  { title: 'Removed', value: 'removed' },
                  { title: 'Deprecated', value: 'deprecated' },
                ],
              },
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
            {
              name: 'documentType',
              title: 'Affected Document Type',
              type: 'string',
              description: 'e.g., "post", "page", "settings"',
            },
          ],
        },
      ],
      description: 'Document all changes in this release',
    }),
    defineField({
      name: 'documents',
      title: 'Documents in Release',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'post' },
            { type: 'page' },
            { type: 'category' },
            { type: 'settings' },
            { type: 'home' },
          ],
        },
      ],
      description: 'Documents included in this release',
    }),
    defineField({
      name: 'author',
      title: 'Release Manager',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'Person responsible for this release',
    }),
    defineField({
      name: 'reviewers',
      title: 'Reviewers',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
      description: 'Team members who reviewed this release',
    }),
    defineField({
      name: 'notes',
      title: 'Release Notes',
      type: 'text',
      rows: 4,
      description: 'Additional notes about this release',
    }),
    defineField({
      name: 'webhookTriggered',
      title: 'Webhook Triggered',
      type: 'boolean',
      initialValue: false,
      description: 'Whether the release webhook has been triggered',
    }),
    defineField({
      name: 'previousVersion',
      title: 'Previous Release',
      type: 'reference',
      to: [{ type: 'contentRelease' }],
      description: 'Link to the previous release for version history',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      version: 'version',
      status: 'status',
      date: 'releaseDate',
    },
    prepare(selection) {
      const { title, version, status, date } = selection;
      const releaseDate = date
        ? new Date(date).toLocaleDateString()
        : 'No date';
      return {
        title: `${title} (v${version})`,
        subtitle: `${status} - ${releaseDate}`,
      };
    },
  },
});

/**
 * Versioning Object
 * 
 * Can be embedded in other documents to track their version history
 */
export const versioningObject = defineType({
  name: 'versioning',
  title: 'Versioning',
  type: 'object',
  fields: [
    defineField({
      name: 'version',
      title: 'Version Number',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'versionDate',
      title: 'Version Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'versionAuthor',
      title: 'Version Author',
      type: 'reference',
      to: [{ type: 'person' }],
    }),
    defineField({
      name: 'changeDescription',
      title: 'What Changed',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'parentVersion',
      title: 'Parent Version',
      type: 'string',
      description: 'The version this was based on',
    }),
  ],
  preview: {
    select: {
      title: 'version',
      date: 'versionDate',
      author: 'versionAuthor.firstName',
    },
    prepare(selection) {
      const { title, date, author } = selection;
      const versionDate = date
        ? new Date(date).toLocaleDateString()
        : 'No date';
      return {
        title: `v${title}`,
        subtitle: `${author || 'Unknown'} - ${versionDate}`,
      };
    },
  },
});
