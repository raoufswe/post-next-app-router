import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "../../utils/apiResponse";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET_KEY!;

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id') as string,
    'svix-timestamp': headerPayload.get('svix-timestamp') as string,
    'svix-signature': headerPayload.get('svix-signature') as string,
  };
  
  if (!svixHeaders['svix-id'] || !svixHeaders['svix-timestamp'] || !svixHeaders['svix-signature']) {
    console.error("[WEBHOOK_CLERK_HEADERS]", "Missing required svix headers");
    return errorResponse('Missing svix headers', 400);
  }

  const payload = await req.json();
  const wh = new Webhook(webhookSecret);
  
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("[WEBHOOK_CLERK_VERIFICATION]", err);
    return errorResponse('Webhook verification failed', 400);
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, public_metadata } = evt.data;
    const { isInvited, role, projectId } = public_metadata as {
      isInvited: boolean;
      role: string;
      projectId: string;
    };

    if (!isInvited) {
      return successResponse({ message: 'User not invited' });
    }

    try {
      await prisma.user.create({
        data: {
          id,
          email: email_addresses[0]?.email_address as string,
          role,
        },
      });

      await prisma.project.update({
        where: { id: projectId },
        data: {
          users: {
            connect: { id }
          }
        }
      });

      return successResponse({ message: 'Webhook processed successfully' });
    } catch (error) {
      console.error("[WEBHOOK_CLERK_DB]", error);
      return errorResponse('Database operation failed', 500);
    }
  }

  return successResponse({ message: 'Webhook received' });
} 