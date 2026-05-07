import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.parquet.createMany({
    data: [
        { nom: 'Parquet de Gombe' },
        { nom: 'Parquet de Kinshasa' },
        { nom: 'Parquet de Lubumbashi' },
    ],
    skipDuplicates: true,
});
    console.log('Parquets créés avec succès');

    await prisma.registre.createMany({
    data: [
        { nom: 'Registre des Procès Verbaux', abreviation: 'PV' },
        { nom: 'Registre des Informations', abreviation: 'RI' },
        { nom: 'Registre des Flagrants Délits', abreviation: 'FD' },
        { nom: 'Registre des Ordonnances', abreviation: 'ORD' },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Registres créés');
}


main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());