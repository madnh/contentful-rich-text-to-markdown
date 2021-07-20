import { MarkRenderer } from '../index'

let renderMarkBold: MarkRenderer = text => `**${text}**`
let renderMarkItalic: MarkRenderer = text => `*${text}*`
let renderMarkUnderline: MarkRenderer = text => `<u>${text}</u>`
let renderMarkCode: MarkRenderer = text => `<code>${text}</code>`

export { renderMarkBold, renderMarkItalic, renderMarkUnderline, renderMarkCode }
