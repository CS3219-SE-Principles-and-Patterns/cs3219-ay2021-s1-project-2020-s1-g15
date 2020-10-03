import { ObjectId } from "mongodb";

export interface Util {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export enum Level {
  SECONDARY = "secondary",
  DEFAULT = "others",
}

export enum Subjects {
  GENERAL = "general",
  MATHEMATICS = "mathematics",
  CHEMISTRY = "chemistry",
  DEFAULT = "others",
}
