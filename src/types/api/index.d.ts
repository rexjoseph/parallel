import { ApiKey, EmailSubscribers } from "@prisma/client"
import { type ZodIssue } from "zod";

export interface CreateApiData {
  error: string | ZodIssue[] | null
  createdApiKey: ApiKey | null
}

export interface RevokeApiData {
  error: string | ZodIssue[] | null
  success: boolean
}

export interface CreateApplicant {
  error: string | ZodIssue[] | null
  createdApplicant: EmailSubscribers | null
}