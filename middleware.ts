import { next } from "@vercel/edge";

const INSTAGRAM_URL = "https://www.instagram.com/coandsonprovence/";
const COOKIE_NAME = "__preview";

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie") ?? "";
  const hasPreviewCookie = cookies.includes(`${COOKIE_NAME}=1`);
  const hasPreviewParam = url.searchParams.get("preview") === "true";

  // Let the request through if preview mode is active
  if (hasPreviewCookie || hasPreviewParam) {
    // Set the cookie so the param isn't needed next time
    if (hasPreviewParam && !hasPreviewCookie) {
      const response = next();
      response.headers.set(
        "set-cookie",
        `${COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`,
      );
      return response;
    }
    return next();
  }

  // Everyone else gets redirected to Instagram
  return Response.redirect(INSTAGRAM_URL, 307);
}

export const config = {
  matcher: "/((?!_next/|favicon|apple-touch-icon|styles\\.css|script\\.js|.*\\.png$|.*\\.ico$).*)",
};
