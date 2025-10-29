export function createMarkup(par) {
  const bodyContent = extractBodyContent(par);
  const cleanedContent = cleanHtmlContent(bodyContent);
  const modifiedPar = cleanedContent.replace(/\\n/g, "\n");
  return { __html: modifiedPar };
}

function extractBodyContent(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch && bodyMatch[1]) {
    return bodyMatch[1];
  }
  return html;
}

function cleanHtmlContent(html) {
  return html
    .replace(/\s*=\s*"/g, '="')
    .replace(/style=\\"[^"]*\\"/g, (match) => {
      return match
        .replace(/\s*;\s*/g, ";")
        .replace(/\s*:\s*/g, ":")
        .replace(/\s+/g, " ");
    })
    .replace(/<([^>]+)>/g, (match, tagContent) => {
      const cleanedTag = tagContent.replace(/\s+/g, " ").trim();
      return `<${cleanedTag}>`;
    });
}

export function createMarkupUniversal(par) {
  let content = par;

  if (par.includes("<body") && par.includes("</body>")) {
    const bodyMatch = par.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      content = bodyMatch[1];
    }
  }

  content = content
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return { __html: content };
}
