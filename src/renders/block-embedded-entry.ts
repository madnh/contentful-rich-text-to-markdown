import { EntryPlain, NodeRenderer, RenderEmbeddedModelContext, validateEntry } from '../index'

export const renderBlockEmbeddedEntry: NodeRenderer = (node, context) => {
  const entry = node.data.target as EntryPlain
  const entryId = entry?.sys?.id
  const entryType = entry?.sys?.contentType?.sys?.id

  const { options } = context
  const validateResult = validateEntry(entry, context)

  if (validateResult !== true) {
    if (options.onModelInvalid) {
      options.onModelInvalid(entry, validateResult || '')
    }

    return ''
  }

  let renderModel = context.options.renderModels[entryType]
  if (!renderModel) {
    if (!context.options.renderModels.fallback) {
      throw new Error(`Embedded entry render not defined: type=${entryType} id=${entryId}`)
    }

    renderModel = context.options.renderModels.fallback
  }

  const renderContext: RenderEmbeddedModelContext = {
    ...context,
    get contentDataPath() {
      return entryId
    },
  }
  const data = renderModel(entry, renderContext)

  return `\n\n${data.trim()}\n\n`
}
