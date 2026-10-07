import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const materials = [
  { name: "NYLEX", type: "German Leather", warrantyYears: 3 },
  { name: "MONTECARLO", type: "Italian Leather", warrantyYears: 5 },
  { name: "COPPER", type: "Italian Leather", warrantyYears: 5 },
];

const services = [
  "Leather Seat Cover",
  "Door Sidings Re-upholstery",
  "Ceiling Re-upholstery",
  "Home Service Installation",
];

async function main() {
  await Promise.all(materials.map((material) => prisma.material.upsert({
    where: { name: material.name },
    update: material,
    create: material,
  })));

  await Promise.all(services.map((name) => prisma.service.upsert({
    where: { name },
    update: { active: true },
    create: { name },
  })));
}

main()
  .then(() => console.log("TOP-G reference data seeded."))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
