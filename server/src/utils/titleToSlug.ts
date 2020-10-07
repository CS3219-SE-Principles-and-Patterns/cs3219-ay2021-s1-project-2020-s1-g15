import slugify from "slugify";

function titleToSlug(title: string): string {
  const strippedTitle = title.replace(/[<>]/g, " ");

  return slugify(strippedTitle, {
    replacement: "-",
    lower: true,
    strict: true,
  });
}

export default titleToSlug;
