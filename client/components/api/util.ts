import { ApiError } from "../../util";

export const getAuthorizationString = (idToken: string) => "Bearer " + idToken;

export const throwAPiError = async (res: Response) => {
  const { message } = (await res.json()) as ApiError;
  throw new Error(message);
};
