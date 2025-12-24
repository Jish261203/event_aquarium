import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs";

export default async function DebugClerkPage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <pre style={{ padding: 16 }}>
        {JSON.stringify({ error: "no userId from auth()" }, null, 2)}
      </pre>
    );
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    return (
      <pre style={{ whiteSpace: "pre-wrap", padding: 16 }}>
        {JSON.stringify({ user }, null, 2)}
      </pre>
    );
  } catch (err) {
    return (
      <pre style={{ whiteSpace: "pre-wrap", padding: 16 }}>
        {JSON.stringify({ error: String(err) }, null, 2)}
      </pre>
    );
  }
}
