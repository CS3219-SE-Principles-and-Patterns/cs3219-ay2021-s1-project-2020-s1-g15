import { ObjectId } from "mongodb";

interface User {
  email: string;
  username: string;
  answer_ids: ObjectId[];
  question_ids: ObjectId[];
}

export default User;
