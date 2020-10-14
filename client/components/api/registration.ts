import { ApiError, RegisterUserParam, UserApi } from "../../util";

const baseUrl =
  process.env.NODE_ENV == "development"
    ? `${process.env.baseUrlDev}users/`
    : `${process.env.baseUrlDev}users/`;

export const registerUser = async (
  param: RegisterUserParam
): Promise<UserApi> => {
  const { email, password } = param;

  const res = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
      authorization: "basic" + btoa(email + ":" + password),
    },
  });

  if (res.ok) {
    const userApi = (await res.json()) as UserApi;
    return userApi;
  } else {
    const { message } = (await res.json()) as ApiError;
    throw new Error(message);
  }
};
