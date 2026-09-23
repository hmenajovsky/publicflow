"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type ApplicationResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string }
  | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseApplication(formData: FormData) {
  const programId = formData.get("programId");
  const name = formData.get("name");
  const email = formData.get("email");

  return {
    programId: typeof programId === "string" ? programId.trim() : "",
    name: typeof name === "string" ? name.trim() : "",
    email: typeof email === "string" ? email.trim().toLowerCase() : "",
  };
}

export async function createApplication(
  _prevState: ApplicationResult,
  formData: FormData,
): Promise<ApplicationResult> {
  const { programId, name, email } = parseApplication(formData);

  if (!programId || !name || !EMAIL_PATTERN.test(email)) {
    return {
      status: "error",
      message: "Veuillez renseigner un nom et une adresse e-mail valides.",
    };
  }

  const result = await prisma.$transaction(
    async (tx): Promise<ApplicationResult> => {
      const user = await tx.user.upsert({
        where: { email },
        update: {},
        create: { name, email },
      });

      const existing = await tx.application.findUnique({
        where: {
          programId_userId: {
            programId,
            userId: user.id,
          },
        },
      });

      if (existing) {
        return {
          status: "error",
          message:
            "Vous avez déjà déposé une demande pour ce dispositif avec cette adresse e-mail.",
        };
      }

      const program = await tx.program.findUnique({
        where: { id: programId },
        select: { capacity: true },
      });

      if (!program) {
        return {
          status: "error",
          message: "Ce dispositif n'existe pas ou n'est plus disponible.",
        };
      }

      const confirmedCount = await tx.application.count({
        where: {
          programId,
          status: "CONFIRMED",
        },
      });

      const status =
        confirmedCount < program.capacity ? "CONFIRMED" : "WAITLISTED";

      await tx.application.create({
        data: {
          programId,
          userId: user.id,
          status,
        },
      });

      return status === "CONFIRMED"
        ? {
            status: "success",
            message:
              "Votre demande est confirmée : vous bénéficiez d'une place dans le dispositif.",
          }
        : {
            status: "success",
            message:
              "Le dispositif est complet : votre demande est placée en liste d'attente.",
          };
    },
  );

  revalidatePath(`/programs/${programId}`);

  return result;
}