export type AppendFunction = {
  (value: string, index: number): string
}

export function prependLines(content: string, append: string | AppendFunction): string {
  return content
    .split(/\n/g)
    .map((str, index) => {
      const appendString = typeof append === 'string' ? append : append(str, index)
      return `${appendString}${str}`
    })
    .join('\n')
}

type RegexMatchGroups<Keys extends string = ''> = Record<Keys, any>

export function extractRegExp<Groups extends string>(re: RegExp, str: string): [boolean, RegexMatchGroups<Groups>] {
  re.lastIndex = 0
  const result = re.exec(str)
  if (result) {
    return [true, (result.groups || {}) as RegexMatchGroups<Groups>]
  }

  return [false, {} as RegexMatchGroups<Groups>]
}

export function extractRegExps<Groups extends string>(
  regexes: Array<RegExp>,
  str: string
): [boolean, RegexMatchGroups<Groups>] {
  for (const regex of regexes) {
    const result = extractRegExp<Groups>(regex, str)
    if (result[0]) return result
  }

  return [false, {} as RegexMatchGroups<Groups>]
}

export function prependNotEmpty(content: string, prependContent: string): string {
  if (!content) return content
  return `${prependContent}${content}`
}

export function prependUrlProtocol(url: string, protocol = 'https'): string {
  if (url.startsWith('//')) return `${protocol}:${url}`
  return url
}
