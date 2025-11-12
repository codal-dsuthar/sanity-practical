import type {DocumentActionComponent} from 'sanity'

/**
 * Document actions for singleton documents
 * This removes the delete action from singleton documents to prevent accidental deletion
 * Learn more: https://www.sanity.io/docs/document-actions
 */
export const singletonActions: DocumentActionComponent[] = (
  prev,
  {schemaType},
): DocumentActionComponent[] => {
  const isSingleton = schemaType === 'settings' || schemaType === 'home'

  if (isSingleton) {
    return prev.filter(
      (action) => action.action !== 'delete' && action.action !== 'duplicate',
    )
  }

  return prev
}
