/* eslint-disable no-useless-escape */
export const REGEX = {
  HTML_TAGS_INSENSITIVE: /(<([^>]+)>)/i,
  HTML_TAGS_GLOBAL: /(<([^>]+)>)/g,
  HTML_TAGS_EXCEPT: (tagName: string): RegExp => new RegExp(`\<(?!${tagName}).*?\>`, 'g'),
  LINE_BREAK: /\\n/i,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i,
  URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i,
  DOMAIN: /^[a-zA-Z0-9](?:[a-zA-Z0-9-.]*[a-zA-Z0-9])?$/i,
  ALPHABETIC: /^[a-z\s]+$/i,
  ALPHANUMERIAL: /^[a-z0-9\s]+$/i,
  NUMERIC: /^\d+$/i,
  LAND_LINE_NUMBER: /^[\d\s]+$/i,
  IS_ALL_UPPER_CASE: /^[A-Z]+$/s,
  ONLY_SPECIAL_KEY: /[$&+,:;=?@#|'<>.^*()%!-]/i,
};
