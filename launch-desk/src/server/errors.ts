type PublicError = {
  code: string;
  message: string;
  retryable: boolean;
};

function errorText(error: unknown) {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

export function isAbortLike(error: unknown) {
  const text = errorText(error);
  return /AbortError|aborted|abort|cancelled|canceled/i.test(text);
}

export function publicAgentError(error: unknown): PublicError {
  const text = errorText(error);
  const status = (error as { status?: number; code?: string })?.status;
  const code = (error as { code?: string })?.code;

  if (isAbortLike(error)) {
    return {
      code: 'request_cancelled',
      message: 'The launch planning request was cancelled before it finished.',
      retryable: true
    };
  }

  if (status === 401 || status === 403 || /api key|authentication|unauthorized|forbidden/i.test(text)) {
    return {
      code: 'openai_auth_error',
      message: 'The OpenAI API key could not authorize this request. Check the server environment and project key.',
      retryable: false
    };
  }

  if (status === 429 || code === 'rate_limit_exceeded' || /rate limit|too many requests/i.test(text)) {
    return {
      code: 'openai_rate_limited',
      message: 'OpenAI rate limits were reached. Try again shortly or use a lower-volume model path.',
      retryable: true
    };
  }

  if (status === 400 || /invalid_request|invalid value|unsupported/i.test(text)) {
    return {
      code: 'openai_invalid_request',
      message: 'The model request was rejected because of an unsupported setting. Check the Launch Desk model configuration.',
      retryable: false
    };
  }

  if (status && status >= 500) {
    return {
      code: 'openai_service_unavailable',
      message: 'The model service is temporarily unavailable. Try again in a moment.',
      retryable: true
    };
  }

  if (/max turns/i.test(text)) {
    return {
      code: 'agent_max_turns',
      message: 'The agent needed too many planning turns. Try a shorter brief or fewer constraints.',
      retryable: false
    };
  }

  if (/timeout|timed out/i.test(text)) {
    return {
      code: 'request_timeout',
      message: 'The launch planning request timed out. Try again with a shorter brief or fewer assets.',
      retryable: true
    };
  }

  return {
    code: 'agent_error',
    message: 'Launch Desk could not complete this plan. Please try again.',
    retryable: true
  };
}
