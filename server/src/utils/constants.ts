enum Level {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  JUNIOR_COLLEGE = "junior college",
  DEFAULT = "others",
}

enum Subject {
  ENGLISH = "english",
  MATHEMATICS = "mathematics",
  SCIENCE = "science",
  PHYSICS = "physics",
  CHEMISTRY = "chemistry",
  BIOLOGY = "biology",
  GENERAL = "general",
  DEFAULT = "others",
}

enum VoteType {
  UPVOTE = 1,
  DOWNVOTE = -1,
}

export { Level, Subject, VoteType };
