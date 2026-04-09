// lib/api-response.ts

export function successResponse<T>(data: T) {
  return {
    success: true,
    data,
    error: null,
  };
}

export function errorResponse(message: string) {
  return {
    success: false,
    data: null,
    error: message,
  };
}