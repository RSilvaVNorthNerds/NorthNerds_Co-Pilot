import * as vscode from "vscode";

export default class SidePanel {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getHtmlContent();
  }

  private getHtmlContent(): string {
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
                      command: 'message',
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
}
