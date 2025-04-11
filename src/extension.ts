// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import SidePanel from "./sidePanel/sidePanel";
import LLMController from "./controllers/LLMController";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "northnerds-co-pilot" is now active!'
  );

  const provider = new SidePanel(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("northnerds-co-pilot", {
      resolveWebviewView(webviewView) {
        // Set up the webview options and HTML content
        provider.resolveWebviewView(webviewView);

        // Add a message listener for the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
          if (message.command === "message") {
            try {
              const llmController = new LLMController();
              const response = await llmController.sendMessage(message.text);
              await vscode.window.showInformationMessage(
                response.content[0].text
              );
            } catch (error) {
              if (error instanceof Error) {
                await vscode.window.showErrorMessage(
                  `Error: ${error.message}. Please try again in a moment.`
                );
              } else {
                await vscode.window.showErrorMessage(
                  "An unexpected error occurred. Please try again later."
                );
              }
            }
          }
        });
      },
    })
  );

  // Register the LaunchCoPilot command
  const launchCommand = vscode.commands.registerCommand(
    "northnerds-co-pilot.LaunchCoPilot",
    () => {
      // Execute the command to reveal the side panel
      vscode.commands.executeCommand(
        "workbench.view.extension.northnerds-co-pilot"
      );
    }
  );

  context.subscriptions.push(launchCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
