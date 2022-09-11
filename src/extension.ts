// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import analyzeProject from "./commands/analyze-project";
import searchPackageByName from "./commands/search-package-by-name";
import { discoverPackages } from "./services/discover-packages";

// Called the very first time when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Extension "haiphen-ai" is now active!');

  // Add Commands to package.json in two important locations:
  // package.activationEvents: (activate ext when user calls any of these)
  // package.contributes.commands: (user-accessible command menu list)
  context.subscriptions.push(
    // Analyze project deps
    vscode.commands.registerCommand(
      "haiphen-ai.analyzeProject",
      analyzeProject
    ),

    // Search for a single dep
    vscode.commands.registerCommand(
      "haiphen-ai.searchPackageByName",
      searchPackageByName
    ),

    // Find similar packages to a dep
    vscode.commands.registerCommand(
      "haiphen-ai.discoverPackages",
      discoverPackages
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
