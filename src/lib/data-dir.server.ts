import os from "node:os";
import path from "node:path";

/** Em serverless (Vercel), só /tmp é gravável — local usa ./data */
export function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), "raise-one-data");
  }
  return path.join(process.cwd(), "data");
}
