enum Question {
  NOT_FOUND = "Question not found",
  INVALID_ID = "Question ID is invalid",
  MISSING_REQUIRED_FIELDS = "Required fields are missing",
  INVALID_FIELDS = "Required fields are invalid",
}

enum Answer {
  NOT_FOUND = "Answer not found",
  INVALID_ID = "Answer ID is invalid",
}

class ApiErrorMessage {
  public static readonly Question = Question;
  public static readonly Answer = Answer;
}

export default ApiErrorMessage;
