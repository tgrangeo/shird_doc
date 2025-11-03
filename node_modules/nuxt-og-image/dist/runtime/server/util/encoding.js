export function htmlDecodeQuotes(html) {
  return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
}
export function decodeHtml(html) {
  return html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&cent;/g, "\xA2").replace(/&pound;/g, "\xA3").replace(/&yen;/g, "\xA5").replace(/&euro;/g, "\u20AC").replace(/&copy;/g, "\xA9").replace(/&reg;/g, "\xAE").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/").replace(/&#(\d+);/g, (full, int) => {
    return String.fromCharCode(Number.parseInt(int));
  }).replace(/&amp;/g, "&");
}
export function decodeObjectHtmlEntities(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string")
      obj[key] = decodeHtml(value);
  });
  return obj;
}
