-- DropForeignKey (recreate with ON DELETE CASCADE)
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_roomId_fkey";
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- AlterTable User: tighter column types + timestamptz
ALTER TABLE "User"
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
  ALTER COLUMN "username" SET DATA TYPE VARCHAR(30),
  ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
  ALTER COLUMN "photo" SET DATA TYPE VARCHAR(2048),
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable Room
ALTER TABLE "Room"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
  ALTER COLUMN "slug" SET DATA TYPE VARCHAR(120),
  ALTER COLUMN "adminId" SET DATA TYPE UUID USING "adminId"::uuid,
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable Chat: Text for large shape JSON payloads
ALTER TABLE "Chat"
  ALTER COLUMN "userId" SET DATA TYPE UUID USING "userId"::uuid,
  ALTER COLUMN "message" SET DATA TYPE TEXT,
  ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
  ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AddForeignKey with cascade deletes
ALTER TABLE "Room" ADD CONSTRAINT "Room_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Room_adminId_idx" ON "Room"("adminId");
CREATE INDEX "Chat_roomId_createdAt_idx" ON "Chat"("roomId", "createdAt");
CREATE INDEX "Chat_userId_idx" ON "Chat"("userId");
