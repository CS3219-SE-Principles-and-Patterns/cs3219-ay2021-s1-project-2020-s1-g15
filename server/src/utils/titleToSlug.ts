import slugify from "slugify";

function titleToSlug(title: string): string {
  return slugify(title, { lower: true });
}

export default titleToSlug;
