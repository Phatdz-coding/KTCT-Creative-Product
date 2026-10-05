import { z } from 'zod'

// Technical limits (TRD §7). UI ranges in parameters.data.ts are narrower.
export const simulationInputSchema = z.object({
  employeeCount: z.number().int().min(1).max(20),
  hourlyWage: z.number().min(0).max(500_000),
  workingHours: z.number().min(1).max(16),
  productivityPerWorkerHour: z.number().min(0).max(50),
  optimalWorkingHours: z.number().min(1).max(16),
  productPrice: z.number().min(0).max(1_000_000),
  materialCostPerUnit: z.number().min(0).max(1_000_000),
  dailyEquipmentCost: z.number().min(0).max(100_000_000),
  customerDemand: z.number().int().min(0).max(10_000),
})
