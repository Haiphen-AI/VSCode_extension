import * as vscode from "vscode";

const { showInformationMessage, showQuickPick } = vscode.window;

/** `package.json` type definition */
export type PackageJSON = Record<string, any> & {
  name: string;
  version: string;
  private?: boolean;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

/**
 * Select either one of multiple (or root) package.json file(s) to analyze
 * @param files List returned from `vscode.workspace.findFiles()`
 */
export const selectPackageJSON = async (files: vscode.Uri[]) => {
  let link: vscode.Uri = files[0];
  if (files.length > 1) {
    showInformationMessage(`Found ${files.length} package.json files`);
    const opts = files.map((f) => ({
      label: "package.json",
      detail: f.path,
      link: f
    }));

    const pkg = await showQuickPick(opts, { title: "Select package.json:" });
    if (!pkg) {
      return;
    }
    link = pkg.link;
  }

  // Load package.json from workspace
  const file = await vscode.workspace.fs.readFile(link);
  if (!file || !file.length) {
    return;
  }

  return selectDependency(JSON.parse(Buffer.from(file).toString("utf-8")));
};

/**
 * Allow the user to select a dependency for analysis
 * @param pkg `package.json` file
 */
export const selectDependency = async (pkg: PackageJSON) => {
  type PkgEntry = [string, string];
  const toQPOption = ([label, detail]: PkgEntry) => ({ label, detail });
  const opts = [
    ...Object.entries(pkg.dependencies).map(toQPOption),
    ...Object.entries(pkg.devDependencies).map(toQPOption)
  ];
  const dep = await showQuickPick(opts, { title: "Select a dependency" });
  if (dep) {
    return { name: dep.label, version: dep.detail };
  }
};

export default selectPackageJSON;
