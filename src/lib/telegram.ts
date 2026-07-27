export interface TelegramMessageResponse {
  ok: boolean;
  description?: string;
  result?: Record<string, unknown>;
}

export async function sendTelegramMessage(
  chatId: string,
  text: string,
  parseMode: "HTML" | "Markdown" = "HTML"
): Promise<TelegramMessageResponse> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.warn("TELEGRAM_BOT_TOKEN environment variable is not defined.");
    return { ok: false, description: "TELEGRAM_BOT_TOKEN environment variable is missing." };
  }

  if (!chatId) {
    return { ok: false, description: "No chatId provided" };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
      }),
    });
    const data = (await res.json()) as TelegramMessageResponse;
    return data;
  } catch (err) {
    console.error("Error sending Telegram message:", err);
    return { ok: false, description: String(err) };
  }
}

export async function getTelegramChatIds(): Promise<string[]> {
  try {
    const { connectToDatabase } = await import("@/lib/db");
    await connectToDatabase();
    const Setting = (await import("@/models/Setting")).default;
    const setting = await Setting.findOne();
    if (setting && setting.telegramChatIds && setting.telegramChatIds.length > 0) {
      return setting.telegramChatIds;
    }
  } catch (err) {
    console.warn("Could not fetch Telegram chat IDs from MongoDB:", err);
  }

  const defaultId = process.env.DEFAULT_TELEGRAM_CHAT_ID;
  return defaultId ? [defaultId] : [];
}

export async function sendLeadTelegramNotification(
  lead: {
    id: string;
    type: "quote" | "book" | "contact";
    name: string;
    email?: string;
    phone: string;
    propertyType?: string;
    cameraCount?: string;
    preferredDate?: string;
    service?: string;
    notes?: string;
    createdAt: Date | string;
  }
): Promise<TelegramMessageResponse[]> {
  const chatIds = await getTelegramChatIds();
  if (chatIds.length === 0) {
    return [{ ok: false, description: "No Telegram Chat IDs configured." }];
  }

  const emoji =
    lead.type === "quote" ? "📋 QUOTE REQUEST" : lead.type === "book" ? "📅 SURVEY BOOKING" : "💬 CONTACT INQUIRY";

  const messageLines = [
    `<b>🚨 NEW LEAD SUBMISSION: ${emoji}</b>`,
    `➖➖➖➖➖➖➖➖➖➖`,
    `<b>Name:</b> ${escapeHtml(lead.name)}`,
    `<b>Phone:</b> ${escapeHtml(lead.phone)}`,
    lead.email ? `<b>Email:</b> ${escapeHtml(lead.email)}` : null,
    lead.propertyType ? `<b>Property Type:</b> ${escapeHtml(lead.propertyType)}` : null,
    lead.cameraCount ? `<b>Cameras Requested:</b> ${escapeHtml(lead.cameraCount)}` : null,
    lead.preferredDate ? `<b>Preferred Date:</b> ${escapeHtml(lead.preferredDate)}` : null,
    lead.service ? `<b>Service Requested:</b> ${escapeHtml(lead.service)}` : null,
    lead.notes ? `<b>Message/Notes:</b>\n<i>${escapeHtml(lead.notes)}</i>` : null,
    `➖➖➖➖➖➖➖➖➖➖`,
    `<b>Received:</b> ${new Date(lead.createdAt).toLocaleString("en-GB")}`,
    `<b>Lead ID:</b> <code>${lead.id}</code>`,
  ].filter(Boolean);

  const text = messageLines.join("\n");

  const results = await Promise.all(
    chatIds.map((chatId) => sendTelegramMessage(chatId, text))
  );

  return results;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
