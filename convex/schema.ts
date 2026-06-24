import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    budget: v.string(),
    message: v.string(),
    lang: v.union(v.literal("en"), v.literal("ar"), v.literal("tr")),
    submittedAt: v.number(),
  }).index("by_email", ["email"]),
});
