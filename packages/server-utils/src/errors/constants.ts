export const ErrorName = {
  NOT_FOUND: 'Resource Not Found',
  FORBIDDEN: 'Access Denied',
  UNAUTHORIZED: 'Authentication Required',
  BAD_REQUEST: 'Invalid Request',
  VALIDATION: 'Invalid Input',
  CONFLICT: 'Resource Already Exists',
  INTERNAL_SERVER: 'Something Went Wrong',
  VALIDATION_ERROR: 'Validation Error',
} as const;

export type ErrorName = keyof typeof ErrorName;

