export const hyphenToUnderscore = (word: string) => {
  return word.replace('-', '_');
};

export const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const removeExtraSpaces = (text: string): string => {
  return text.trim().replace(/\s+/g, ' ');
};

export const removeBreakLines = (text: string): string => {
  return text.replace(/(\r\n|\r|\n)/g, '');
};
