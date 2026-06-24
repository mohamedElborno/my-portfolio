import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification in dev");
    return process.env.NODE_ENV !== "production";
  }

  if (!token) return false;

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    },
  );

  const data = (await response.json()) as {
    success: boolean;
    score?: number;
  };

  return data.success && (data.score ?? 0) >= 0.5;
}

export const storeContactSubmission = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    budget: v.string(),
    message: v.string(),
    lang: v.union(v.literal("en"), v.literal("ar"), v.literal("tr")),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contactSubmissions", args);
  },
});

export const submitContactForm = action({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    budget: v.string(),
    message: v.string(),
    recaptchaToken: v.string(),
    lang: v.union(v.literal("en"), v.literal("ar"), v.literal("tr")),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const valid = await verifyRecaptcha(args.recaptchaToken);
    if (!valid) {
      throw new Error("reCAPTCHA verification failed");
    }

    await ctx.runMutation(internal.contact.storeContactSubmission, {
      name: args.name,
      email: args.email,
      subject: args.subject,
      budget: args.budget,
      message: args.message,
      lang: args.lang,
      submittedAt: args.submittedAt,
    });
  },
});
