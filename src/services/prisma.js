import { PrismaClient } from '@prisma/client';

// Réutiliser l'instance de lib/prisma.js pour éviter les conflits
import prisma from '@/lib/prisma';

export default prisma;
