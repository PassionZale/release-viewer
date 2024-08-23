-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Release" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appId" INTEGER,
    "pipelineId" INTEGER,
    "userId" INTEGER,
    "version" TEXT NOT NULL,
    "buildId" INTEGER,
    "desc" TEXT NOT NULL,
    "previewUrl" TEXT,
    CONSTRAINT "Release_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Release_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "Pipeline" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Release_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Release" ("appId", "buildId", "createdAt", "desc", "id", "pipelineId", "previewUrl", "updatedAt", "userId", "version") SELECT "appId", "buildId", "createdAt", "desc", "id", "pipelineId", "previewUrl", "updatedAt", "userId", "version" FROM "Release";
DROP TABLE "Release";
ALTER TABLE "new_Release" RENAME TO "Release";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
