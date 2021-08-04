import { EntryPlain, ModelValidate, RenderContext } from './index'

export const baseModelValidate: ModelValidate = entry => {
  if (!entry) return 'entry is empty'
  if (!entry?.sys?.contentType?.sys?.id) return 'cannot detect content type'
  if (!Object.prototype.hasOwnProperty.call(entry, 'fields')) {
    return 'fields is empty'
  }

  return true
}

export function validateEntry(entry: EntryPlain, context: RenderContext): ReturnType<ModelValidate> {
  const { options } = context
  let validResult = baseModelValidate(entry)

  if (validResult !== true) return validResult
  if (options.modelValidate) {
    validResult = options.modelValidate(entry)
  }

  return validResult
}
