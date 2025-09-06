"use server";

import { env } from "@/env";
import axios from "axios";

export async function sendDiscordMessage(message: string) {
  if (!env.DISCORD_WEBHOOK_URL) {
    console.warn(
      "DISCORD_WEBHOOK_URL is not set. Not sending Discord message.",
    );
    return;
  }

  try {
    await axios.post(env.DISCORD_WEBHOOK_URL, {
      content: message,
    });
  } catch (error) {
    console.error("Error sending Discord message", error);
  }
}
