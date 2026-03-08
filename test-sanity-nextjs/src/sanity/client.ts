import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "kyrhgayn",
  dataset: "production",
  apiVersion: "2026-03-08",
  useCdn: false,
});
