enum Question {
  NOT_FOUND = "Question not found",
  INVALID_ID = "Question ID is invalid",
  MISSING_MARKDOWN_FIELD = "Required field markdown is missing",
  INVALID_MAKDOWN_FIELD = "Required field markdown cannot be empty string",
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
