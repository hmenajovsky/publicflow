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

type ProgramPage = (props: { params: { id: string } }) => Promise<ReactElement>;
type FindUniqueArgs = {
  where: { id: string };
  include: {
    _count: {
      select: {
        applications: { where: { status: "CONFIRMED" } };
      };
    };
  };
};

let detailProgram: Program | null = null;
let applicationFormProgramId: string | undefined;
const findUniqueCalls: FindUniqueArgs[] = [];
const notFoundError = new Error("NEXT_NOT_FOUND");

const fakePrisma = {
  program: {
    findUnique: async (args: FindUniqueArgs) => {
      findUniqueCalls.push(args);
      return detailProgram;
    },
  },
};

mock.module("@/lib/prisma", {
  namedExports: { prisma: fakePrisma },
});

mock.module("next/navigation.js", {
  namedExports: {
    notFound: () => {
      throw notFoundError;
    },
  },
});

mock.module("@/components/application-form", {
  defaultExport: ({ programId }: { programId: string }) => {
    applicationFormProgramId = programId;
    return React.createElement(
      "section",
      { "data-testid": "application-form" },
      programId,
    );
  },
});

function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    id: "program-1",
    name: "Dispositif de démonstration",
    description: "Une description détaillée.",
    startDate: new Date("2026-01-15T12:00:00Z"),
    endDate: new Date("2026-01-22T12:00:00Z"),
    category: "Formation",
    capacity: 5,
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

async function renderProgram(id: string): Promise<string> {
  const ProgramPage = defaultExport<ProgramPage>(
    await import("../../app/programs/[id]/page"),
  );

  return renderToStaticMarkup(await ProgramPage({ params: { id } }));
}

beforeEach(() => {
  detailProgram = null;
  applicationFormProgramId = undefined;
  findUniqueCalls.length = 0;
});

test("affiche le dispositif demandé et transmet son identifiant au formulaire", async () => {
  detailProgram = makeProgram({
    id: "program-42",
    name: "Accompagnement numérique",
    description: "Apprendre les outils numériques.",
    category: "Numérique",
    capacity: 5,
    _count: { applications: 2 },
  });

  const html = await renderProgram("program-42");
  const text = visibleText(html);

  assert.equal(findUniqueCalls.length, 1);
  assert.deepEqual(findUniqueCalls[0], {
    where: { id: "program-42" },
    include: {
      _count: {
        select: {
          applications: { where: { status: "CONFIRMED" } },
        },
      },
    },
  });
  assert.ok(text.includes("Accompagnement numérique"));
  assert.ok(text.includes("Apprendre les outils numériques."));
  assert.ok(text.includes("Numérique"));
  assert.ok(text.includes("3 sur 5"));
  assert.ok(text.includes("15 janvier 2026"));
  assert.ok(text.includes("22 janvier 2026"));
  assert.ok(html.includes('href="/"'));
  assert.ok(html.includes('data-testid="application-form"'));
  assert.equal(applicationFormProgramId, "program-42");
});

test("affiche Complet lorsque la capacité est atteinte", async () => {
  detailProgram = makeProgram({
    capacity: 3,
    _count: { applications: 3 },
  });

  const text = visibleText(await renderProgram("program-1"));

  assert.ok(text.includes("Complet"));
  assert.ok(!text.includes("3 sur 3"));
});

test("déclenche notFound pour un dispositif inexistant", async () => {
  detailProgram = null;

  await assert.rejects(
    () => renderProgram("inconnu"),
    (error) => error === notFoundError,
  );
  assert.equal(findUniqueCalls[0].where.id, "inconnu");
});
