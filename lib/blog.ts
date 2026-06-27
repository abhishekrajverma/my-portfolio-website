import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const COPY_BUTTON_HTML = `<button type="button" class="code-block-copy" data-copy-code aria-label="Copy code"><svg class="code-block-copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><svg class="code-block-copy-check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span data-copy-label>Copy</span></button>`;

function wrapCodeBlocks(htmlContent: string): string {
  return htmlContent.replace(
    /<pre>([\s\S]*?)<\/pre>/g,
    `<div class="code-block">${COPY_BUTTON_HTML}<pre>$1</pre></div>`
  );
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(html).process(markdown);
  return wrapCodeBlocks(
    result
      .toString()
      .replace(/<table>/g, '<div class="table-scroll"><table>')
      .replace(/<\/table>/g, "</table></div>")
  );
}
