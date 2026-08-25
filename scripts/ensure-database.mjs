import { PrismaClient } from "@prisma/client";

// Prisma Migrate cannot initialize a brand-new SQLite file on some mounted
// Windows filesystems. A harmless PRAGMA creates a valid empty database first.
const prisma = new PrismaClient();

try {
  await prisma.$executeRawUnsafe("PRAGMA user_version=0");
} finally {
  await prisma.$disconnect();
}
