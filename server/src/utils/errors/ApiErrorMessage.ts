enum Question {
  NOT_FOUND = "Question not found",
  INVALID_ID = "Question ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
  INVALID_PAGINATION_FIELDS = "Page and Page size values are invalid",
}

enum Answer {
  NOT_FOUND = "Answer not found",
  INVALID_ID = "Answer ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
}

enum User {
  NOT_FOUND = "User not found",
  NOT_AUTHENTICATED = "User authentication failed",
  MISSING_REQUIRED_FIELDS = "Email or password is missing",
  INVALID_FIELDS = "Email or password is invalid",
}

export class ApiErrorMessage {
  public static readonly Question = Question;
  public static readonly Answer = Answer;
  public static readonly User = User;
}
