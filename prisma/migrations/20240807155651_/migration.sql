/*
  Warnings:

  - You are about to drop the column `platformId` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `systemId` on the `App` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[label]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `Platform` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `System` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `System` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `platformValue` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemValue` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Platform_label_value_key";

-- DropIndex
DROP INDEX "System_label_value_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "subscribers" TEXT,
    "robotDingDingStatus" INTEGER NOT NULL DEFAULT 1,
    "robotWorkWeixinStatus" INTEGER NOT NULL DEFAULT 1,
    "systemValue" TEXT NOT NULL,
    "platformValue" TEXT NOT NULL,
    CONSTRAINT "App_systemValue_fkey" FOREIGN KEY ("systemValue") REFERENCES "System" ("value") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "App_platformValue_fkey" FOREIGN KEY ("platformValue") REFERENCES "Platform" ("value") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_App" ("createdAt", "desc", "id", "name", "robotDingDingStatus", "robotWorkWeixinStatus", "subscribers", "updatedAt") SELECT "createdAt", "desc", "id", "name", "robotDingDingStatus", "robotWorkWeixinStatus", "subscribers", "updatedAt" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Platform_label_key" ON "Platform"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_value_key" ON "Platform"("value");

-- CreateIndex
CREATE INDEX "Platform_label_value_idx" ON "Platform"("label", "value");

-- CreateIndex
CREATE UNIQUE INDEX "System_label_key" ON "System"("label");

-- CreateIndex
CREATE UNIQUE INDEX "System_value_key" ON "System"("value");

-- CreateIndex
CREATE INDEX "System_label_value_idx" ON "System"("label", "value");
