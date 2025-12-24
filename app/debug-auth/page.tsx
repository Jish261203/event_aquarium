import { auth } from "@clerk/nextjs";
import { headers } from "next/headers";

export default function DebugAuthPage() {
  const { userId, orgId, sessionId } = auth();
  const hdrs = headers();

  const cookies: Record<string, string | null> = {};
  for (const [k, v] of Array.from(hdrs)) {
    if (k.toLowerCase().includes("cookie")) {
      cookies[k] = v;
    }
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 16 }}>
      {JSON.stringify({ userId, orgId, sessionId, cookies }, null, 2)}
    </pre>
  );
}
