import { CreateApplicant } from "@/types/api"

export async function createApplicant() {
  const res = await fetch("/api/applicants/create")
  const data = (await res.json()) as CreateApplicant

  if (data.error) {
    if (data.error instanceof Array) {
      throw new Error(data.error.join(", "))
    }
    throw new Error(data.error ?? "Something went wrong")
  }

  return data.createdApplicant
}