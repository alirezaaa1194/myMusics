import { PrismaClient } from "../../generated/prisma";
import type * as PrismaType from "../../generated/prisma";

export const prisma = new PrismaClient();
export type { PrismaType };
