import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";

/**
 * Keeps our application `users` table (username, language, role) in sync
 * with Clerk identity events. Clerk remains the source of truth for auth;
 * this table only ever stores app-specific preferences, never credentials.
 *
 * Configure this endpoint's URL in the Clerk Dashboard → Webhooks, and set
 * CLERK_WEBHOOK_SECRET from the signing secret it gives you.
 */
export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") {
    const data = event.data as {
      id: string;
      public_metadata?: { role?: string };
      username?: string | null;
    };

    await db.user.upsert({
      where: { id: data.id },
      create: {
        id: data.id,
        username: data.username ?? undefined,
        role: data.public_metadata?.role === "admin" ? "admin" : "citizen",
      },
      update: {
        role: data.public_metadata?.role === "admin" ? "admin" : "citizen",
      },
    });
  }

  if (event.type === "user.deleted") {
    const data = event.data as { id: string };
    await db.user
      .delete({ where: { id: data.id } })
      .catch(() => undefined); // already gone / FK constraints handled via cascade at app level
  }

  return new Response("OK", { status: 200 });
}
