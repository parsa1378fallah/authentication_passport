import { refreshToken } from "./auth";
import { getSession } from "./session";

export const authFetch = async (
  url: string | URL,
  options: RequestInit = {}
) => {
  const session = await getSession();

  const headers = new Headers(options.headers);

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.log(session?.refreshToken)
    if (!session?.refreshToken) {
      throw new Error("Refresh token not found");
    }

    const newAccessToken = await refreshToken(session.refreshToken);

    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);

      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  return response;
};
