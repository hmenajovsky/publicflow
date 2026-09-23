"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

export type Period = "all" | "week" | "month";

export default function ProgramFilter({
  q,
  period,
}: {
  q: string;
  period: Period;
}) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  function handleReset() {
    const form = formRef.current;


    if (form) {
      (form.elements.namedItem("q") as HTMLInputElement).value = "";
      (form.elements.namedItem("period") as HTMLSelectElement).value = "all";
    }

    router.push("/");

  }

  return (
    <form
      ref={formRef}
      method="get"
      action="/"
      className="flex flex-wrap items-center gap-3"
    > <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Rechercher par nom…"
        className="min-w-64 rounded-full border border-black/[0.08] px-4 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[0.145]"
      />


      <select
        name="period"
        defaultValue={period}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border border-black/[0.08] px-4 py-2 text-sm outline-none transition-colors focus:border-foreground/40 dark:border-white/[0.145]"
      >
        <option value="all">Toutes les dates</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
      </select>

      <button
        type="submit"
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
      >
        Rechercher
      </button>

      {(q !== "" || period !== "all") && (
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-black/[0.08] px-5 py-2 text-sm font-medium transition-colors hover:border-foreground/40 dark:border-white/[0.145]"
        >
          Réinitialiser
        </button>
      )}
    </form>


  );
}
