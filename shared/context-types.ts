import { z } from 'zod';

export const StageContextSchema = z.enum(['dev', 'prod']);
export type StageContext = z.infer<typeof StageContextSchema>;

export const EnvContextSchema = z.object({
  account: z.string(),
  service: z.object({
    subnetId: z.string(),
    environment: z.object({
      name: z.string(),
    }),
  }),
});

export type EnvContext = z.infer<typeof EnvContextSchema>;

export const GlobalContextSchema = z.object({
  appName: z.string(),
  region: z.string(),
});

export type GlobalContext = z.infer<typeof GlobalContextSchema>;
