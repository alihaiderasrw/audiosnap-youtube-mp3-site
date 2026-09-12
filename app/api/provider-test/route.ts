import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Learning-only demo. No secret, subscription, or external downloader is required.
  // This shows the same server-side Bearer-header pattern used by authenticated APIs.
  const demoToken = "audiosnap-demo-token";
  const authorization = `Bearer ${demoToken}`;

  const bearerAccepted = authorization.startsWith("Bearer ") && authorization.slice(7).length > 0;

  return NextResponse.json({
    ok: bearerAccepted,
    mode: "demo",
    message: bearerAccepted
      ? "Bearer authentication demo is working."
      : "Bearer authentication demo failed.",
    requestExample: {
      method: "GET",
      authorizationHeaderSent: "Bearer •••••••••••••••••",
    },
    explanation: [
      "The browser calls this AudioSnap server route.",
      "A real integration would read its secret token on the server.",
      "The server would send Authorization: Bearer <token> to an authorized provider.",
      "The provider response would then be validated before returning safe data to the browser.",
    ],
    secretExposedToBrowser: false,
  });
}
