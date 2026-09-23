
import Link from "next/link";

import { prisma } from "@/lib/prisma";

import ProgramFilter, { type Period } from "@/components/program-filter";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(date: Date) {
  return dateFormatter.format(date);
}

function remainingPlaces(program: {
  capacity: number;
  _count: { applications: number };
}) {
  return program.capacity - program._count.applications;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

function periodRange(period: Period): { gte: Date; lt: Date } | null {
  const from = startOfToday();

  if (period === "week") {
    return { gte: from, lt: addDays(from, 7) };
  }

  if (period === "month") {
    return { gte: from, lt: addDays(from, 7) };
  }

  return null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string | string[]; period?: string | string[] };
}) {
  const q =
    typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const period: Period =
    searchParams.period === "week" || searchParams.period === "month"
      ? searchParams.period
      : "all";

  const range = periodRange(period);

  const programs = await prisma.program.findMany({
    where: {
      ...(q ? { name: { contains: q } } : {}),
      ...(range
        ? {
            startDate: {
              gte: range.gte,
              lt: range.lt,
            },
          }
        : {}),
    },
    orderBy: { startDate: "asc" },
    include: {
      _count: {
        select: {
          applications: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });

  return (
    <main className="min-h-screen p-8 sm:p-16 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">
          Dispositifs d'accompagnement disponibles
        </h1>

        <p className="mt-2 text-foreground/70">
          Recherchez par nom et filtrez par période de début.
        </p>
      </header>

      <section aria-label="Recherche et filtres" className="mb-8">
        <ProgramFilter q={q} period={period} />
      </section>

      <section aria-label="Liste des dispositifs" className="grid gap-6">
        {programs.map((program) => {
          const remaining = remainingPlaces(program);

          return (
            <div
              key={program.id}
              className="flex flex-col gap-4 rounded-xl border border-black/[0.08] p-6 dark:border-white/[0.145]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{program.name}</h2>

                  <p className="mt-1 text-sm text-foreground/70">
                    {formatDate(program.startDate)} →{" "}
                    {formatDate(program.endDate)}
                  </p>
                </div>

                <span className="rounded-full bg-foreground/5 px-3 py-1 text-sm font-medium">
                  {program.category}
                </span>
              </div>

              <p className="text-sm text-foreground/70">
                {program.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm">
                  {remaining > 0 ? (
                    <>
                      <span className="font-semibold">{remaining}</span>{" "}
                      place{remaining > 1 ? "s" : ""} restante
                      {remaining > 1 ? "s" : ""}
                    </>
                  ) : (
                    <span className="font-semibold text-red-600">
                      Complet
                    </span>
                  )}
                </p>

                <Link
                  href="/programs/cmuelvpks0000unowl35nckcx"
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
                >
                  Voir le détail
                </Link>
              </div>
            </div>
          );
        })}

        {programs.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/[0.2] p-8 text-center dark:border-white/[0.3]">
            <p className="text-foreground/70">
              Aucun dispositif ne correspond à vos critères.
            </p>

            <button
              type="button"
              className="mt-4 text-sm font-medium underline underline-offset-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

