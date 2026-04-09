// lib/error-handler.ts

import { errorResponse } from "./api-response";

export async function withErrorHandler(
  fn: () => Promise<Response>
): Promise<Response> {
  try {
    return await fn();
  } catch (error: unknown) {
    console.error("API Error:", error);

    let message = "Internal Server Error";

    if (error instanceof Error) {
      message = error.message;
    }

    return Response.json(errorResponse(message), {
      status: 500,
    });
  }
}