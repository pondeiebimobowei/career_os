export class BacklogError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'BACKLOG_ERROR'
  ) {
    super(message);
    this.name = 'BacklogError';
  }
}

export class ValidationError extends BacklogError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends BacklogError {
  constructor(message: string) {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class InfrastructureError extends BacklogError {
  constructor(message: string) {
    super(message, 'INFRASTRUCTURE_ERROR');
    this.name = 'InfrastructureError';
  }
}
