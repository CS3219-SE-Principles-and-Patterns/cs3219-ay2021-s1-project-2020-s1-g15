enum Question {
  NOT_FOUND = "Question not found",
  INVALID_ID = "Question ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
  INVALID_PAGINATION_FIELDS = "Page and Page size values are invalid",
}

enum Answer {
  NOT_FOUND = "Answer not found",
  MISSING_ID = "Answer ID is missing",
  INVALID_ID = "Answer ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
}

enum User {
  NOT_FOUND = "User not found",
  NOT_AUTHENTICATED = "User authentication failed",
  MISSING_REQUIRED_FIELDS = "Username, email or password is missing",
  INVALID_USERNAME = "Username must have at least four characters",
  INVALID_EMAIL = "Email must be valid",
  INVALID_PASSWORD = "Passwords must have at least six characters",
  ALREADY_EXISTS = "This username and/or email already exists",
  ID_OR_USERNAME_NEEDED = "User ID or username must be present",
}

enum Vote {
  MISSING_VOTE_COMMAND = "Missing vote command",
  INVALID_VOTE_COMMAND = "Invalid vote command",
}

export class ApiErrorMessage {
  public static readonly Question = Question;
  public static readonly Answer = Answer;
  public static readonly User = User;
  public static readonly Vote = Vote;
}
