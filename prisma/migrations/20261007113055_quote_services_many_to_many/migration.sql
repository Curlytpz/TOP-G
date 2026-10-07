-- CreateTable
CREATE TABLE "QuoteService" (
    "quoteId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuoteService_pkey" PRIMARY KEY ("quoteId","serviceId")
);

-- CreateIndex
CREATE INDEX "QuoteService_serviceId_idx" ON "QuoteService"("serviceId");

-- AddForeignKey
ALTER TABLE "QuoteService" ADD CONSTRAINT "QuoteService_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuoteService" ADD CONSTRAINT "QuoteService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve existing single-service quotes in the new relation table.
INSERT INTO "QuoteService" ("quoteId", "serviceId")
SELECT "id", "serviceId"
FROM "Quote"
WHERE "serviceId" IS NOT NULL
ON CONFLICT ("quoteId", "serviceId") DO NOTHING;