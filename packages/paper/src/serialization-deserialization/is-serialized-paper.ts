import { z } from 'zod';
import { SerializedDocument, SerializedPaper } from '../types';

const zodSerializedDocumentSchema: z.ZodType<SerializedDocument> = z.object({
  __meta__: z.object({
    DOCUMENT_KEY: z.string(),
    DOCUMENT_CONNECTIONS: z.record(z.string(), z.array(z.string())),
    DOCUMENT_GRAPHQL_TYPENAME: z.string(),
  }),
});

const zodSerializedPaperSchema: z.ZodType<SerializedPaper> = z
  .object({
    __meta__: z.object({
      NULL_DOCUMENT_KEY: z.string(),
    }),

    store: z.record(z.string(), z.array(zodSerializedDocumentSchema)),
  })
  .strict();

export function isSerializedPaper(
  possiblySerializedPaper: SerializedPaper,
): possiblySerializedPaper is SerializedPaper {
  const parsed = zodSerializedPaperSchema.safeParse(possiblySerializedPaper);
  return parsed.success;
}

export function assertValidSerializedPaper(
  possiblySerializedPaper: unknown,
): possiblySerializedPaper is SerializedPaper {
  try {
    zodSerializedPaperSchema.parse(possiblySerializedPaper);
  } catch (originalError) {
    const error = new Error('SerializedPaper is not valid. See `cause` property for validation error');
    error.cause = originalError;
    throw error;
  }
  return true;
}
