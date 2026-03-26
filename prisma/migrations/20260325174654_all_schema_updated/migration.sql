-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "patienthealthdata" ALTER COLUMN "hasAllergy" SET DEFAULT false,
ALTER COLUMN "hasDiabetic" SET DEFAULT false,
ALTER COLUMN "smokingStatus" SET DEFAULT false,
ALTER COLUMN "pregnancyStatus" SET DEFAULT false,
ALTER COLUMN "hasPastSurgeries" SET DEFAULT false,
ALTER COLUMN "recentAnxiety" SET DEFAULT false,
ALTER COLUMN "recentDepression" SET DEFAULT false,
ALTER COLUMN "isDeleted" SET DEFAULT false;
