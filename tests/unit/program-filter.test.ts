import assert from "node:assert/strict";
import { beforeEach, mock, test } from "node:test";

import React, { type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

Object.assign(globalThis, { React });

type Period = "all" | "week" | "month";
type ProgramFilter = (props: { q: string; period: Period }) => ReactElement;

const routerCalls: string[] = [];

mock.module("next/navigation.js", {
  namedExports: {
    useRouter: () => ({
      push: (href: string) => {
        routerCalls.push(href);
      },
    }),
  },
});

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

async function renderFilter(
  q: string,
  period: Period,
): Promise<string> {
  const ProgramFilter = defaultExport<ProgramFilter>(
    await import("../../components/program-filter"),
  );

  return renderToStaticMarkup(
    React.createElement(ProgramFilter, { q, period }),
  );
}

beforeEach(() => {
  routerCalls.length = 0;
});

test("affiche les valeurs initiales et la configuration du formulaire", async () => {
  const html = await renderFilter("Yoga", "week");

  assert.ok(html.includes('method="get"'));
  assert.ok(html.includes('action="/"'));
  assert.ok(html.includes('name="q"'));
  assert.ok(html.includes('value="Yoga"'));
  assert.ok(html.includes('value="week" selected=""'));
  assert.ok(html.includes("Réinitialiser"));
  assert.deepEqual(routerCalls, []);
});

test("n’affiche le bouton de réinitialisation que lorsqu’un filtre est actif", async () => {
  const defaultHtml = await renderFilter("", "all");
  const filteredHtml = await renderFilter("", "month");

  assert.ok(!defaultHtml.includes("Réinitialiser"));
  assert.ok(filteredHtml.includes("Réinitialiser"));
});
