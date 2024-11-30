import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { dialogue } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const dialogueRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ dialogueId: z.string() }))
    .query(async ({ ctx, input }) => {
      const dialogueData = await ctx.drizzle.query.dialogue.findFirst({
        where: eq(dialogue.id, input.dialogueId),
      });

      if (!dialogueData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dialogue not found",
        });
      }

      return {
        id: dialogueData.id,
        speaker: dialogueData.speaker,
        text: dialogueData.text,
        choices: dialogueData.choices,
      };
    }),

  progress: protectedProcedure
    .input(
      z.object({
        dialogueId: z.string(),
        choiceIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dialogueData = await ctx.drizzle.query.dialogue.findFirst({
        where: eq(dialogue.id, input.dialogueId),
      });

      if (!dialogueData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dialogue not found",
        });
      }

      const choice = dialogueData.choices[input.choiceIndex];
      if (!choice) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid choice index",
        });
      }

      return {
        nextDialogueId: dialogueData.nextId,
        isEnd: !dialogueData.nextId,
      };
    }),
});
