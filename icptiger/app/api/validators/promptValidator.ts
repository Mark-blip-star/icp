interface ValidationResult {
  isValid: boolean;
  matches?: string[];
  message: string;
}

export class PromptValidator {
  public validate(creativeBrief: string): ValidationResult {
    // Dictionary mapping patterns to human-readable explanations
    const patternExplanations: Record<string, string> = {
      "###\\w+\\s*###": "Detected attempt to modify system tags",
      "\\b(?:system|shell|process|execute|command)\\b": "Detected system command-related keywords",
      "\\b(?:inject|attack|malicious|hack)\\b": "Detected security-related suspicious terms",
      "(\\$\\{.*\\})": "Detected potential variable injection",
      "(<.*?>)": "Detected potential HTML/JS injection",
      "%3C.*?%3E": "Detected encoded HTML tags",
      "%3Cscript%3E.*?%3C/script%3E": "Detected encoded script tags",
      "\\b(?:explain|describe|alter|inject|modify|rewrite|override|change)\\b.*\\b(?:previous instructions|past inputs)\\b":
        "Detected attempt to modify previous instructions",
      "\\b(?:as a poem|in verse|like a story)\\b": "Detected request for non-business format",
      "\\b(?:do not|must not|cannot|should not)\\b.*\\b(?:detect|flag|stop)\\b":
        "Detected attempt to disable security checks",
      "\\b(?:ignore|disregard|neglect|overlook)\\b.*\\b(?:previous instructions|given context|directions)\\b":
        "Detected attempt to ignore previous instructions",
      "\\b(?:say|speak)\\b.*\\b(?:mean|hurtful|negative|insulting|offensive)\\b":
        "Detected request for negative content",
      "\\b(?:disregard|ignore)\\b.*\\b(?:guidelines|rules|constraints|direction)\\b":
        "Detected attempt to bypass guidelines",
    };

    // Check for forbidden patterns
    for (const [pattern, explanation] of Object.entries(patternExplanations)) {
      const regex = new RegExp(pattern);
      const match = creativeBrief.match(regex);
      if (match) {
        console.log(`Rejected - ${explanation}: ${match[0]}.`);
        return {
          isValid: false,
          matches: match,
          message: `Oops! Looks like "${match[0]}" might not work here. Some words can cause issues, so try tweaking or removing it to keep going!`,
        };
      }
    }

    return {
      isValid: true,
      message: "Creative brief is valid.",
    };
  }
}
