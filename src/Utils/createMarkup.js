export function createMarkup(par) {
  const bodyContent = extractBodyContent(par);
  const modifiedPar = bodyContent.replace(/\\n/g, '\n');
  return { __html: modifiedPar};
}

function extractBodyContent(html) {
  const bodyContent = html.replace(/.*?<body[^>]*>([\s\S]*?)<\/body>.*/i, '$1');
  return bodyContent;
}