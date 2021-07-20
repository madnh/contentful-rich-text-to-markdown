import { NodeRenderer, RenderEmbeddedModelContext } from '../index'
import { Entry } from '../contentful-data-types'

export const renderBlockEmbeddedEntry: NodeRenderer = (node, context) => {
  const entry = node.data.target as Entry<any>
  const entryId = entry?.sys?.id
  const entryType = entry?.sys?.contentType?.sys?.id

  const renderModel = context.options.renderModels[entryType]
  if (!renderModel) {
    const message = `Embedded entry render not defined: type=${entryType} id=${entryId}`
    if (context.options.embeddedEntryRenderNotFound === 'throw') {
      throw new Error(message)
    } else {
      if (context.options.embeddedEntryRenderNotFound === 'warn') {
        console.warn(`[WARN] ${message}`)
      }
      return `\n\n<!-- WARN: ${message} -->\n\n`
    }
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
