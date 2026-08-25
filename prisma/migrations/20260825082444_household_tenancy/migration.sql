-- Existing unscoped records are preserved in an unclaimed legacy household.
-- A fresh, empty database does not receive a household or sample data.
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "Household" ("id", "name", "createdAt", "updatedAt")
SELECT 'legacy-household', 'わが家', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE EXISTS (
  SELECT 1 FROM "Child"
  UNION ALL SELECT 1 FROM "Todo"
  UNION ALL SELECT 1 FROM "NurseryItem"
  UNION ALL SELECT 1 FROM "MedicalSchedule"
  UNION ALL SELECT 1 FROM "ShoppingItem"
  LIMIT 1
);

-- CreateTable
CREATE TABLE "HouseholdMember" (
    "householdId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("householdId", "userId"),
    CONSTRAINT "HouseholdMember_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "HouseholdMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "clothingSize" TEXT,
    "shoeSize" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT NOT NULL,
    CONSTRAINT "Child_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Child" ("birthDate", "clothingSize", "createdAt", "id", "nickname", "note", "shoeSize", "updatedAt", "householdId") SELECT "birthDate", "clothingSize", "createdAt", "id", "nickname", "note", "shoeSize", "updatedAt", 'legacy-household' FROM "Child";
DROP TABLE "Child";
ALTER TABLE "new_Child" RENAME TO "Child";
CREATE INDEX "idx_child_household_created_at" ON "Child"("householdId", "createdAt");
CREATE UNIQUE INDEX "Child_id_householdId_key" ON "Child"("id", "householdId");
CREATE TABLE "new_MedicalSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "hospitalName" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT NOT NULL,
    CONSTRAINT "MedicalSchedule_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MedicalSchedule" ("createdAt", "date", "hospitalName", "id", "isCompleted", "note", "title", "updatedAt", "householdId") SELECT "createdAt", "date", "hospitalName", "id", "isCompleted", "note", "title", "updatedAt", 'legacy-household' FROM "MedicalSchedule";
DROP TABLE "MedicalSchedule";
ALTER TABLE "new_MedicalSchedule" RENAME TO "MedicalSchedule";
CREATE INDEX "idx_medical_household_status_date" ON "MedicalSchedule"("householdId", "isCompleted", "date");
CREATE UNIQUE INDEX "MedicalSchedule_id_householdId_key" ON "MedicalSchedule"("id", "householdId");
CREATE TABLE "new_NurseryItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT NOT NULL,
    CONSTRAINT "NurseryItem_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NurseryItem" ("createdAt", "date", "id", "isCompleted", "note", "title", "type", "updatedAt", "householdId") SELECT "createdAt", "date", "id", "isCompleted", "note", "title", "type", "updatedAt", 'legacy-household' FROM "NurseryItem";
DROP TABLE "NurseryItem";
ALTER TABLE "new_NurseryItem" RENAME TO "NurseryItem";
CREATE INDEX "idx_nursery_household_status_date" ON "NurseryItem"("householdId", "isCompleted", "date");
CREATE INDEX "idx_nursery_household_type_date" ON "NurseryItem"("householdId", "type", "date");
CREATE UNIQUE INDEX "NurseryItem_id_householdId_key" ON "NurseryItem"("id", "householdId");
CREATE TABLE "new_ShoppingItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "isPurchased" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT NOT NULL,
    CONSTRAINT "ShoppingItem_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ShoppingItem" ("category", "createdAt", "id", "isPurchased", "name", "note", "updatedAt", "householdId") SELECT "category", "createdAt", "id", "isPurchased", "name", "note", "updatedAt", 'legacy-household' FROM "ShoppingItem";
DROP TABLE "ShoppingItem";
ALTER TABLE "new_ShoppingItem" RENAME TO "ShoppingItem";
CREATE INDEX "idx_shopping_household_status_created_at" ON "ShoppingItem"("householdId", "isPurchased", "createdAt");
CREATE UNIQUE INDEX "ShoppingItem_id_householdId_key" ON "ShoppingItem"("id", "householdId");
CREATE TABLE "new_Todo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "dueDate" DATETIME,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "householdId" TEXT NOT NULL,
    CONSTRAINT "Todo_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Todo" ("category", "createdAt", "dueDate", "id", "isCompleted", "note", "title", "updatedAt", "householdId") SELECT "category", "createdAt", "dueDate", "id", "isCompleted", "note", "title", "updatedAt", 'legacy-household' FROM "Todo";
DROP TABLE "Todo";
ALTER TABLE "new_Todo" RENAME TO "Todo";
CREATE INDEX "idx_todo_household_status_due_date" ON "Todo"("householdId", "isCompleted", "dueDate");
CREATE UNIQUE INDEX "Todo_id_householdId_key" ON "Todo"("id", "householdId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "idx_session_user_id" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "idx_session_expires_at" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_household_member_user_id" ON "HouseholdMember"("userId");
