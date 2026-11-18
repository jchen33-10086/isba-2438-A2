import { promises as fs } from "fs";
import path from "path";

export async function readJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    const file = path.join(process.cwd(), "data", fileName);
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(fileName: string, value: unknown): Promise<void> {
  const file = path.join(process.cwd(), "data", fileName);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}
