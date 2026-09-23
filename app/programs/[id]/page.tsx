import Link from "next/link";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import ApplicationForm from "@/components/application-form";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export default async function ProgramPage({
  params,
}: {
  params: { id: string };
}) {
  const program = await prisma.program.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          applications: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  if (!program) notFound();

  const remaining = program.capacity - program._count.applications;

  const details = [
    { label: "Date de début", value: formatDate(program.startDate) },
    { label: "Date de fin", value: formatDate(program.endDate) },
    { label: "Catégorie", value: program.category },
    {
      label: "Places restantes",
      value:
        remaining > 0
          ? `${remaining} sur ${program.capacity}`
          : "Complet",
    },
    { label: "Créé le", value: formatDate(program.createdAt) },
  ];

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]"> <Link
      href="/"
      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
    >
      ← Retour aux dispositifs </Link>

      <article className="mt-6 max-w-2xl">
        <header>
          <h1 className="text-3xl font-bold">{program.name}</h1>
          <p className="mt-2 text-foreground/70">
            {program.description}
          </p>
        </header>

        <dl className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08] dark:divide-white/[0.145] dark:border-white/[0.145]">
          {details.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <dt className="text-foreground/70">{label}</dt>
              <dd className="font-medium text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </article>

      <ApplicationForm programId={program.id} />
    </main>
  );
}