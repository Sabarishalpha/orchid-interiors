import { Redis } from "@upstash/redis";

let redis: Redis | null | undefined;

export function getProductionRedis() {
  if (redis !== undefined) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redis = new Redis({ url, token });
    return redis;
  }

  if (process.env.VERCEL) {
    throw new Error("Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for persistent production data.");
  }

  redis = null;
  return redis;
}