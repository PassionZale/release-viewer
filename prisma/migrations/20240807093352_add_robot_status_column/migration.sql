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
    "systemId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,
    CONSTRAINT "App_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "App_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_App" ("createdAt", "desc", "id", "name", "platformId", "subscribers", "systemId", "updatedAt") SELECT "createdAt", "desc", "id", "name", "platformId", "subscribers", "systemId", "updatedAt" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 3,
    "status" INTEGER NOT NULL DEFAULT 2
);
INSERT INTO "new_User" ("avatar", "createdAt", "id", "nickname", "password", "role", "status", "updatedAt", "username") SELECT "avatar", "createdAt", "id", "nickname", "password", "role", "status", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_username_idx" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
