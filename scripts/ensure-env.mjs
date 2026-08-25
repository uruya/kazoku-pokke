import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const environmentFile = resolve(".env");
const exampleFile = resolve(".env.example");

if (!existsSync(environmentFile) && existsSync(exampleFile)) {
  copyFileSync(exampleFile, environmentFile);
  console.log(".env.example から .env を作成しました。");
}
