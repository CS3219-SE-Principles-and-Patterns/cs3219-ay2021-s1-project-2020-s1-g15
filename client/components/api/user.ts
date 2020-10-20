import { RegisterUserReq, User, GetSingleUserRes } from "../../util";
import { USERS_API_URL, throwApiError } from "./util";

function getUsersIdUrl(id: string) {
  return `${USERS_API_URL}/${id}`;
}

async function registerUser(param: RegisterUserReq): Promise<GetSingleUserRes> {
  const { email, password } = param;

  const res = await fetch(USERS_API_URL, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      authorization: "basic" + btoa(email + ":" + password),
    },
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  const userApi = (await res.json()) as GetSingleUserRes;
  return userApi;
}

async function getSingleUser(id: string): Promise<User> {
  const res = await fetch(getUsersIdUrl(id), {
    method: "GET",
  });

  if (!res.ok) {
    return throwApiError(res);
  }

  const userApi = (await res.json()) as GetSingleUserRes;
  return userApi as User;
}

export { registerUser, getSingleUser };
