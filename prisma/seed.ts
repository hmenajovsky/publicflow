
import { PrismaClient, ApplicationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.user.deleteMany();
  await prisma.program.deleteMany();

  const inDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const programs = await Promise.all(
    [
      {
        name: "Accompagnement à la création d'entreprise",
        description:
          "Dispositif d'accompagnement destiné aux personnes souhaitant créer leur entreprise.",
        startDate: inDays(3),
        endDate: inDays(10),
        category: "Entrepreneuriat",
        capacity: 20,
      },
      {
        name: "Formation aux métiers du numérique",
        description:
          "Programme de formation destiné aux personnes souhaitant développer leurs compétences numériques.",
        startDate: inDays(8),
        endDate: inDays(30),
        category: "Formation",
        capacity: 2,
      },
      {
        name: "Aide à la mobilité professionnelle",
        description:
          "Dispositif permettant d'accompagner les personnes dans un projet de mobilité professionnelle.",
        startDate: inDays(15),
        endDate: inDays(45),
        category: "Emploi",
        capacity: 50,
      },
      {
        name: "Accompagnement vers l'emploi",
        description:
          "Programme d'accompagnement personnalisé pour faciliter le retour à l'emploi.",
        startDate: inDays(25),
        endDate: inDays(60),
        category: "Emploi",
        capacity: 30,
      },
      {
        name: "Atelier découverte des métiers",
        description:
          "Atelier permettant de découvrir différents métiers et secteurs professionnels.",
        startDate: inDays(35),
        endDate: inDays(36),
        category: "Orientation",
        capacity: 15,
      },
      {
        name: "Soutien aux projets associatifs",
        description:
          "Dispositif d'accompagnement destiné aux associations développant un nouveau projet.",
        startDate: inDays(50),
        endDate: inDays(80),
        category: "Vie associative",
        capacity: 10,
      },
      {
        name: "Programme d'accompagnement des jeunes",
        description:
          "Accompagnement destiné aux jeunes dans leurs démarches d'insertion professionnelle.",
        startDate: inDays(65),
        endDate: inDays(100),
        category: "Jeunesse",
        capacity: 40,
      },
      {
        name: "Atelier numérique pour les seniors",
        description:
          "Atelier pratique pour développer l'autonomie dans l'utilisation des outils numériques.",
        startDate: inDays(8),
        endDate: inDays(9),
        category: "Numérique",
        capacity: 10,
      },
    ].map((data) => prisma.program.create({ data })),
  );

  const users = await Promise.all(
    [
      { name: "Camille Dupont", email: "camille.dupont@example.com" },
      { name: "Lucas Martin", email: "lucas.martin@example.com" },
      { name: "Emma Bernard", email: "emma.bernard@example.com" },
      { name: "Hugo Petit", email: "hugo.petit@example.com" },
      { name: "Léa Robert", email: "lea.robert@example.com" },
      { name: "Nathan Richard", email: "nathan.richard@example.com" },
      { name: "Marie Leroy", email: "marie.leroy@example.com" },
      { name: "Thomas Moreau", email: "thomas.moreau@example.com" },
      { name: "Sofia Rossi", email: "sofia.rossi@example.com" },
      { name: "Julien Garnier", email: "julien.garnier@example.com" },
    ].map((data) => prisma.user.create({ data })),
  );

  const applications = [
    {
      program: programs[0],
      user: users[0],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[0],
      user: users[1],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[1],
      user: users[2],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[1],
      user: users[3],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[2],
      user: users[0],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[2],
      user: users[4],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[3],
      user: users[1],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[3],
      user: users[5],
      status: ApplicationStatus.WAITLISTED,
    },
    {
      program: programs[4],
      user: users[3],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[5],
      user: users[2],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[6],
      user: users[0],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[6],
      user: users[4],
      status: ApplicationStatus.WAITLISTED,
    },
    {
      program: programs[7],
      user: users[6],
      status: ApplicationStatus.CONFIRMED,
    },
    {
      program: programs[7],
      user: users[7],
      status: ApplicationStatus.CONFIRMED,
    },
  ];

  for (const { program, user, status } of applications) {
    await prisma.application.create({
      data: {
        programId: program.id,
        userId: user.id,
        status,
      },
    });
  }

  console.log(
    `Seed terminé : ${programs.length} dispositifs, ${users.length} usagers, ${applications.length} demandes.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

