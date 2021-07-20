import { MarkRenderer } from '../index'

const renderMarkBold: MarkRenderer = text => `**${text}**`
const renderMarkItalic: MarkRenderer = text => `*${text}*`
const renderMarkUnderline: MarkRenderer = text => `<u>${text}</u>`
const renderMarkCode: MarkRenderer = text => `<code>${text}</code>`

export { renderMarkBold, renderMarkItalic, renderMarkUnderline, renderMarkCode }
