import { ObjectId } from "mongodb";

interface Util {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export default Util;
