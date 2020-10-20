import { formatDistanceToNow } from "date-fns";

function toJsDate(date: string | Date): Date {
  return new Date(date);
}

function toRelativeTimeAgo(date: string | Date): string {
  const dateObject: Date = toJsDate(date);

  return formatDistanceToNow(dateObject) + " ago";
}

export { toJsDate, toRelativeTimeAgo };
