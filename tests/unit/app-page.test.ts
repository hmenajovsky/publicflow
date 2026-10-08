import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";

import React, { type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

Object.assign(globalThis, { React });

type Program = {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: string;
  capacity: number;
  createdAt: Date;
  _count: { applications: number };
};

type HomeProps = {
  searchParams: {
    q?: string | string[];
    period?: string | string[];
  };
};

type Home = (props: HomeProps) => Promise<ReactElement>;
type FindManyArgs = {
  where: {
    name?: { contains: string };
    startDate?: { gte: Date; lt: Date };
  };
  orderBy: { startDate: "asc" };
  include: {
    _count: {
      select: {
        applications: { where: { status: "CONFIRMED" } };
      };
    };
  };
};

let programs: Program[] = [];
const findManyCalls: FindManyArgs[] = [];
const routerCalls: string[] = [];

const fakePrisma = {
  program: {
    findMany: async (args: FindManyArgs) => {
      findManyCalls.push(args);
      return programs;
    },
  },
};

mock.module("@/lib/prisma", {
  namedExports: { prisma: fakePrisma },
});

mock.module("next/navigation.js", {
  namedExports: {
    useRouter: () => ({
      push: (href: string) => {
        routerCalls.push(href);
      },
    }),
  },
});

function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    id: "program-1",
    name: "Dispositif de démonstration",
    description: "Une description utile.",
    startDate: new Date("2026-01-15T12:00:00Z"),
    endDate: new Date("2026-01-22T12:00:00Z"),
    category: "Formation",
    capacity: 4,
    createdAt: new Date("2025-12-01T12:00:00Z"),
    _count: { applications: 0 },
    ...overrides,
  };
}

function defaultExport<T>(module: unknown): T {
  const outerDefault = (module as { default?: unknown }).default;

  if (typeof outerDefault === "function") {
    return outerDefault as T;
  }

  if (
    outerDefault &&
    typeof outerDefault === "object" &&
    "default" in outerDefault
  ) {
    return (outerDefault as { default: T }).default;
  }

  throw new Error("Default export not found");
}

function visibleText(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

async function renderHome(
  searchParams: HomeProps["searchParams"] = {},
): Promise<string> {
  const Home = defaultExport<Home>(await import("../../app/page"));

  return renderToStaticMarkup(await Home({ searchParams }));
}

beforeEach(() => {
  programs = [];
  findManyCalls.length = 0;
  routerCalls.length = 0;
});

test("charge les dispositifs, les trie et affiche les informations principales", async () => {
  programs = [
    makeProgram({
      id: "alpha",
      name: "Atelier alpha",
      description: "Une description alpha.",
      capacity: 3,
      _count: { applications: 1 },
    }),
    makeProgram({
      id: "beta",
      name: "Atelier beta",
      description: "Une description beta.",
      capacity: 2,
      _count: { applications: 2 },
    }),
    makeProgram({
      id: "gamma",
      name: "Atelier gamma",
      description: "Une description gamma.",
      capacity: 1,
      _count: { applications: 0 },
    }),
  ];

  const html = await renderHome();
  const text = visibleText(html);

  assert.equal(findManyCalls.length, 1);
  assert.deepEqual(findManyCalls[0], {
    where: {},
    orderBy: { startDate: "asc" },
    include: {
      _count: {
        select: {
          applications: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });
  assert.ok(text.includes("Atelier alpha"));
  assert.ok(text.includes("Une description alpha."));
  assert.ok(text.includes("Formation"));
  assert.ok(text.includes("2 places restantes"));
  assert.ok(text.includes("1 place restante"));
  assert.ok(text.includes("Complet"));
  assert.ok(html.includes('href="/programs/alpha"'));
  assert.ok(html.includes('href="/programs/beta"'));
  assert.ok(html.includes('href="/programs/gamma"'));
  assert.deepEqual(routerCalls, []);
});

test("normalise la recherche et ignore une période invalide", async () => {
  await renderHome({ q: "  Yoga  ", period: "semaine" });

  assert.deepEqual(findManyCalls[0].where, {
    name: { contains: "Yoga" },
  });
});

test("ignore les paramètres de recherche sous forme de tableau", async () => {
  await renderHome({ q: ["Yoga"], period: ["week"] });

  assert.deepEqual(findManyCalls[0].where, {});
});

test("applique les bornes des périodes semaine et mois", async (context) => {
  context.mock.timers.enable({
    apis: ["Date"],
    now: new Date("2026-01-15T12:00:00Z"),
  });

  await renderHome({ period: "week" });

  const weekQuery = findManyCalls[0].where.startDate;
  assert.ok(weekQuery);
  assert.equal(weekQuery.gte.getTime(), new Date(2026, 0, 15).getTime());
  assert.equal(weekQuery.lt.getTime(), new Date(2026, 0, 22).getTime());

  await renderHome({ period: "month" });

  const monthQuery = findManyCalls[1].where.startDate;
  assert.ok(monthQuery);
  assert.equal(monthQuery.gte.getTime(), new Date(2026, 0, 15).getTime());
  assert.equal(monthQuery.lt.getTime(), new Date(2026, 1, 15).getTime());
});

test("affiche l’état vide et son bouton de réinitialisation", async () => {
  programs = [];

  const html = await renderHome({ q: "inconnu", period: "week" });
  const text = visibleText(html);

  assert.ok(text.includes("Aucun dispositif ne correspond à vos critères."));
  assert.ok(text.includes("Réinitialiser les filtres"));
  assert.ok(html.includes('type="button"'));
});
