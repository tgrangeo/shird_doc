import { toHast } from "minimark/hast";
import { pick } from "./utils.js";
const HEADING = /^h([1-6])$/;
const isHeading = (tag) => HEADING.test(tag);
export async function generateSearchSections(queryBuilder, opts) {
  const { ignoredTags = [], extraFields = [] } = opts || {};
  const documents = await queryBuilder.where("extension", "=", "md").select("path", "body", "description", "title", ...extraFields || []).all();
  return documents.flatMap((doc) => splitPageIntoSections(doc, { ignoredTags, extraFields }));
}
function splitPageIntoSections(page, { ignoredTags, extraFields }) {
  const body = !page.body || page.body?.type === "root" ? page.body : toHast(page.body);
  const path = page.path ?? "";
  const extraFieldsData = pick(extraFields)(page);
  const sections = [{
    ...extraFieldsData,
    id: path,
    title: page.title || "",
    titles: [],
    content: (page.description || "").trim(),
    level: 1
  }];
  if (!body?.children) {
    return sections;
  }
  let section = 1;
  let previousHeadingLevel = 0;
  const titles = [page.title ?? ""];
  for (const item of body.children) {
    const tag = item.tag || "";
    if (isHeading(tag)) {
      const currentHeadingLevel = Number(tag.match(HEADING)?.[1] ?? 0);
      const title = extractTextFromAst(item).trim();
      if (currentHeadingLevel === 1) {
        titles.splice(0, titles.length);
      } else if (currentHeadingLevel < previousHeadingLevel) {
        titles.splice(currentHeadingLevel - 1, titles.length - 1);
      } else if (currentHeadingLevel === previousHeadingLevel) {
        titles.pop();
      }
      sections.push({
        ...extraFieldsData,
        id: `${path}#${item.props?.id}`,
        title,
        titles: [...titles],
        content: "",
        level: currentHeadingLevel
      });
      titles.push(title);
      previousHeadingLevel = currentHeadingLevel;
      section += 1;
    } else {
      const content = extractTextFromAst(item, ignoredTags).trim();
      if (section === 1 && sections[section - 1]?.content === content) {
        continue;
      }
      sections[section - 1].content = `${sections[section - 1].content} ${content}`.trim();
    }
  }
  return sections;
}
function extractTextFromAst(node, ignoredTags = []) {
  let text = "";
  if (node.type === "text") {
    text += node.value || "";
  }
  if (ignoredTags.includes(node.tag ?? "")) {
    return "";
  }
  if (node.children?.length) {
    text += node.children.map((child) => extractTextFromAst(child, ignoredTags)).filter(Boolean).join("");
  }
  return text;
}
