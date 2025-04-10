// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import SidePanel from "./sidePanel/sidePanel";

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
    vscode.window.registerWebviewViewProvider("northnerds-co-pilot", provider)
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

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>North Nerds Co-Pilot</title>
      <style>
          body {
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .container {
              max-width: 100%;
              margin: 0 auto;
          }
          .header {
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
          }
          .chat-area {
              height: calc(100vh - 200px);
              overflow-y: auto;
              margin-bottom: 20px;
              padding: 10px;
              border: 1px solid #eee;
              border-radius: 4px;
          }
          .input-area {
              display: flex;
              gap: 10px;
          }
          input {
              flex: 1;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
          }
          button {
              padding: 8px 16px;
              background-color: #007acc;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
          }
          button:hover {
              background-color: #0062a3;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h2>North Nerds Co-Pilot</h2>
          </div>
          <div class="chat-area" id="chatArea">
              <!-- Chat messages will appear here -->
          </div>
          <div class="input-area">
              <input type="text" id="messageInput" placeholder="Type your message here...">
              <button id="sendButton">Send</button>
          </div>
      </div>
      <script>
          const vscode = acquireVsCodeApi();
          const chatArea = document.getElementById('chatArea');
          const messageInput = document.getElementById('messageInput');
          const sendButton = document.getElementById('sendButton');

          sendButton.addEventListener('click', () => {
              const message = messageInput.value;
              if (message) {
                  // Send message to extension
                  vscode.postMessage({
                      command: 'alert',
                      text: message
                  });
                  messageInput.value = '';
              }
          });

          messageInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') {
                  sendButton.click();
              }
          });
      </script>
  </body>
  </html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
