export function hyphenToUnderscore(word: string) {
  return word.replaceAll('-', '_')
}

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function removeExtraSpaces(text: string) {
  return text.trim().replace(/\s+/g, ' ')
}

export function removeBreakLines(text: string) {
  return text.replace(/(\r\n|\r|\n)/g, '')
}

export function noIndent(text: string) {
  return text.replace(/(\n)\s+/g, '$1').trim()
}

export function toUpperSnakeCase(str: string): string {
  return (
    str
      // Convert camelCase to snake_case
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      // Replace hyphens with underscores
      .replace(/-/g, '_')
      .toUpperCase()
  )
}
