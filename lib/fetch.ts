import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

type FetchApiOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  withAuth?: boolean;
};

export async function fetchApi<T>(
  path: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  const { headers = {}, withAuth = true, ...rest } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const { getToken } = await auth();
    const token = await getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  return res.json() as Promise<ApiResponse<T>>;
} 