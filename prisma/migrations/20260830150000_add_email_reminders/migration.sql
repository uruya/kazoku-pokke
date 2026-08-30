ALTER TABLE "User"
ADD COLUMN "emailReminderEnabled" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "ReminderDelivery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReminderDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ReminderDelivery_userId_targetDate_key"
ON "ReminderDelivery"("userId", "targetDate");

CREATE INDEX "idx_reminder_delivery_target_date"
ON "ReminderDelivery"("targetDate");

ALTER TABLE "ReminderDelivery"
ADD CONSTRAINT "ReminderDelivery_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
