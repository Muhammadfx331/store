import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/** كل عملية تنزيل لحزمة التحديث — لنشوف كم مرة اننزّل كل ملف */
export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  file: text("file").notNull(),
  label: text("label"),
  bytes: integer("bytes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** قائمة خطوات الرفع على GitHub — حالة محفوظة لكل زيارة */
export const checklist = pgTable("checklist", {
  key: text("key").primaryKey(),
  done: boolean("done").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Download = typeof downloads.$inferSelect;
export type ChecklistRow = typeof checklist.$inferSelect;
