import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function requiredEnvironmentValue(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} must be set before creating an admin.`);
  return value;
}

try {
  const name = requiredEnvironmentValue("ADMIN_NAME");
  const email = requiredEnvironmentValue("ADMIN_EMAIL").toLowerCase();
  const password = requiredEnvironmentValue("ADMIN_PASSWORD");

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("ADMIN_EMAIL must be a valid email address.");
  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters and no more than 72 UTF-8 bytes.");
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email }, select: { id: true } });
  if (existingAdmin) {
    console.log(`Admin already exists for ${email}; no changes were made.`);
  } else {
    await prisma.admin.create({
      data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log(`Admin created for ${email}.`);
  }
} finally {
  await prisma.$disconnect();
}
