/*
  Warnings:

  - You are about to drop the `DingDingRobot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkWeixinRobot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DingDingRobot";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "WorkWeixinRobot";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "RobotDingDing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "webhook" TEXT NOT NULL,
    "secret" TEXT
);

-- CreateTable
CREATE TABLE "RobotWorkWeixin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "webhook" TEXT NOT NULL,
    "secret" TEXT
);
