import { ObjectId } from "mongodb";

export interface Util {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
