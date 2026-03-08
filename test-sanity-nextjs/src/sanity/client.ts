import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "20v0e7rh",
  dataset: "production",
  apiVersion: "2026-03-08",
  useCdn: false,
});
