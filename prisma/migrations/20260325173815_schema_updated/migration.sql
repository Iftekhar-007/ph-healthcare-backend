/*
  Warnings:

  - Added the required column `doctorId` to the `prescriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "idx_prescription_doctorId" ON "prescriptions"("doctorId");

-- CreateIndex
CREATE INDEX "idx_prescription_aptientId" ON "prescriptions"("patientId");

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
