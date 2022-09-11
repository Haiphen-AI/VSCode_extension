import * as vscode from "vscode";
import axios from "axios";
import { headers } from "./config";

/** Discover similar packages */
export async function discoverPackages() {
  const baseURL = "https://ml-api.haiphen.io/api";
  const placeHolder = "Enter a package name";
  const src = await vscode.window.showInputBox({ placeHolder });
  if (!src) {
    return;
  }

  const r: [string, number][] = await axios
    .post(baseURL, { src }, { headers })
    .then((res) => res.data)
    .catch(() => []);
  if (!r.length) {
    return;
  }

  const opts = r.map(([k, val]) => `${k} (${Math.round(val * 100)}%)`);
  const out = `Similar packages: ${opts.join(", ")}`;
  vscode.window.showInformationMessage(out);
}
