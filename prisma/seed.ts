import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { name: 'Vende S.A.' },
      update: {},
      create: { name: 'Vende S.A.' },
    }),
    prisma.company.upsert({
      where: { name: 'Acme Corp' },
      update: {},
      create: { name: 'Acme Corp' },
    }),
  ]);

  console.log('Seed listo. Companies:');
  companies.forEach(c => console.log(`- ${c.name} → ${c.id}`));
}

main().finally(() => prisma.$disconnect());
