import HttpStatusCode from "../HttpStatusCode";

class ApiError extends Error {
  public status: Readonly<HttpStatusCode>;

  /**
   * @param status HTTP status code to be returned to the caller
   * @param message Friendly error message for the caller
   */
  constructor(status: HttpStatusCode, message: string) {
    super(message);
    this.status = status;
  }
}

export default ApiError;
