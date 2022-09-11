import * as vscode from "vscode";
import analyzePackageDeps from "./analyze-package-deps";
import selectPackageJSON from "./select-package-json";

const {
  showInformationMessage,
  showErrorMessage,
  showInputBox,
  showQuickPick
} = vscode.window;
const { fs, findFiles } = vscode.workspace;

/**
 * Assess root or all `package.json` files in a project for dependency vulnerabilities.
 * @param recursive Search for `package.json` files in child directories
 * @returns
 */
export const analyzeProject = async (recursive = false) => {
  const include = recursive ? "**/package.json" : "package.json";
  const exclude = "**/node_modules/**";
  const files = await findFiles(include, exclude);
  if (!files.length) {
    showErrorMessage("No package.json file found");
  }

  const dependency = await selectPackageJSON(files);
  if (dependency) {
    return analyzePackageDeps(dependency.name);
  }
};

export default analyzeProject;
