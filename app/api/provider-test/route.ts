import {NextResponse} from "next/server";

export const dynamic = "force-dynamic";

function isBlockedTarget(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase();
    return host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be" || host.endsWith(".youtu.be");
  } catch {
    return true;
  }
}

export async function GET() {
  const endpoint = process.env.PROVIDER_TEST_URL?.trim();
  const accessKey = process.env.PROVIDER_ACCESS_KEY?.trim();

  if (!endpoint || !accessKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Provider test is not configured. Add PROVIDER_TEST_URL and PROVIDER_ACCESS_KEY in Vercel Environment Variables.",
      },
      {status: 503},
    );
  }

  if (isBlockedTarget(endpoint)) {
    return NextResponse.json(
      {ok: false, error: "Use a provider-owned test/status endpoint rather than a direct YouTube URL."},
      {status: 400},
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });

    const contentType = response.headers.get("content-type") || "";
    let providerResponse: unknown;

    if (contentType.includes("application/json")) {
      providerResponse = await response.json();
    } else {
      const text = await response.text();
      providerResponse = text.slice(0, 1200);
    }

    return NextResponse.json(
      {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType: contentType || "unknown",
        providerResponse,
      },
      {status: response.ok ? 200 : 502},
    );
  } catch (error: any) {
    return NextResponse.json(
      {ok: false, error: error?.message || "Could not connect to the configured provider endpoint."},
      {status: 502},
    );
  }
}
