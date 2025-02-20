export function successResponse<T>(data: T, status: number = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status: number = 500): Response {
  return Response.json({ success: false, error: { message } }, { status });
} 