/*
  Warnings:

  - You are about to drop the `_ArticleToKeyword` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ArticleToKeyword_B_index";

-- DropIndex
DROP INDEX "_ArticleToKeyword_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ArticleToKeyword";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "headerImage" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" DATETIME,
    "publishedAt" DATETIME,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "keywordId" TEXT,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("authorId", "blurb", "categoryId", "content", "createdAt", "headerImage", "id", "isFeatured", "publishedAt", "scheduledFor", "slug", "title", "updatedAt") SELECT "authorId", "blurb", "categoryId", "content", "createdAt", "headerImage", "id", "isFeatured", "publishedAt", "scheduledFor", "slug", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
