import { analyzePackageDeps } from "./analyze-package-deps";
import { window, workspace } from "vscode";

const { showInputBox } = window;

/**
 * Analyze a dependency's vulnerability by entering its name
 * @returns Package analysis
 */
export const searchPackageByName = async () => {
  const prompt = "Enter dependency name (e.g. react-scipts)";
  const name = await showInputBox({ prompt });
  if (name) {
    return analyzePackageDeps(name);
  }
};

export default searchPackageByName;
