import { ObjectId } from "mongodb";

export interface Util {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}
