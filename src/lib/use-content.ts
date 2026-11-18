import { getRouteApi } from "@tanstack/react-router";
import type { UniverseContent } from "@/content/types";

const universeRoute = getRouteApi("/universe");

export function useContent(): UniverseContent {
  return universeRoute.useLoaderData();
}
