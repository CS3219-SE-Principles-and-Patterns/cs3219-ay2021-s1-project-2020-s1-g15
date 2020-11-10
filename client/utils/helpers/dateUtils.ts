import { format, formatDistanceToNow } from "date-fns";

function toJsDate(date: string | Date): Date {
  return new Date(date);
}

function toRelativeTimeAgo(date: string | Date): string {
  const dateObject: Date = toJsDate(date);

  return formatDistanceToNow(dateObject) + " ago";
}

function toLocalisedDate(date: string | Date): string {
  const dateObject: Date = toJsDate(date);

  return format(dateObject, "do MMM yyyy");
}

export { toJsDate, toRelativeTimeAgo, toLocalisedDate };
