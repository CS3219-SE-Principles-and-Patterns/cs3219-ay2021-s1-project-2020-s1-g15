enum Question {
  NOT_FOUND = "Question not found",
  INVALID_ID = "Question ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
}

enum Answer {
  NOT_FOUND = "Answer not found",
  INVALID_ID = "Answer ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
}

enum User {
  MISSING_REQUIRED_FIELDS = "Email or password is missing",
  INVALID_FIELDS = "Email or password is invalid",
}

class ApiErrorMessage {
  public static readonly Question = Question;
  public static readonly Answer = Answer;
  public static readonly User = User;
}

export default ApiErrorMessage;
