// Import Libs
const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const express = require("express");
const xpress = express();
const http = require("http");
const tmi = require("tmi.js");
const server = http.createServer(xpress);
const { Server } = require("socket.io");
const io = new Server(server);
const sqlite = require("sqlite3");
const { default: fish } = require("./src/classes/new_fish");
const appdata = app.getPath("userData");
// Game Vars
let isGameRunning = false;
let fishies = new Array();
// Menu Setup
const template = [
  {
    label: "DB",
    submenu: [
      {
        label: "Create New Database",
        click: function () {
          CreateSql();
        },
      },
    ],
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo",
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut",
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy",
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste",
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        role: "selectall",
      },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Reload",
        accelerator: "CmdOrCtrl+R",
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      {
        label: "Toggle Full Screen",
        accelerator: (function () {
          if (process.platform === "darwin") return "Ctrl+Command+F";
          else return "F11";
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        },
      },
      {
        label: "Toggle Developer Tools",
        accelerator: (function () {
          if (process.platform === "darwin") return "Alt+Command+I";
          else return "Ctrl+Shift+I";
        })(),
        click: function (item, focusedWindow) {
          if (focusedWindow) focusedWindow.toggleDevTools();
        },
      },
    ],
  },
  {
    label: "Window",
    role: "window",
    submenu: [
      {
        label: "Open Console",
        click: () => {
          createConsoleWindow();
        },
      },
      {
        label: "Minimize",
        accelerator: "CmdOrCtrl+M",
        role: "minimize",
      },
      {
        label: "Close",
        accelerator: "CmdOrCtrl+W",
        role: "close",
      },
    ],
  },
  {
    label: "Help",
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: function () {
          shell.openExternal("http://electron.atom.io");
        },
      },
    ],
  },
  {
      label: "Debug",
      submenu: [
          {
              label: "CreateFish",
              click: ()=>{CreateFish({type:"default",name:"DemoFish",color:"Purple",id:"000"})}
          }
      ]
  }
];
if (process.platform === "darwin") {
  const { name } = app;
  template.unshift({
    label: name,
    submenu: [
      {
        label: "About " + name,
        role: "about",
      },
      {
        type: "separator",
      },
      {
        label: "Services",
        role: "services",
        submenu: [],
      },
      {
        type: "separator",
      },
      {
        label: "Hide " + name,
        accelerator: "Command+H",
        role: "hide",
      },
      {
        label: "Hide Others",
        accelerator: "Command+Shift+H",
        role: "hideothers",
      },
      {
        label: "Show All",
        role: "unhide",
      },
      {
        type: "separator",
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function () {
          app.quit();
        },
      },
    ],
  });
  const windowMenu = template.find(function (m) {
    return m.role === "window";
  });
  if (windowMenu) {
    windowMenu.submenu.push(
      {
        type: "separator",
      },
      {
        label: "Bring All to Front",
        role: "front",
      }
    );
  }
}
// SQLITE Server Setup
function CheckSql() {
  return fs.existsSync(path.join(appdata, "fishbase.db"));
}
function CreateSql() {
  fs.writeFile(path.join(appdata, "fishbase.db"), "", () => {
    io.send("SqlStatus", CheckSql());
  });
}
function StartSql() {}
function StopSql() {}
// IPC Functions
ipcMain.on("CheckSql", (e) => {
  e.sender.send("SqlStatus", CheckSql() ? 1 : 0);
});
ipcMain.on("StartSql", (e) => {
  if (!CheckSql) return;
  e.sender.send("SqlStatus", 2);
});
ipcMain.on("StartGame",(e)=>{
    if (!CheckSql) return;
    StartExpressServer();
    StartGame();
    e.sender.send("SqlStatus", 2);
    e.sender.send("MainServerStatus", 2);
});
ipcMain.on("StopGame", (e) =>{
    StopExpressServer();
});
// Game Functions
function StartGame() {
    isGameRunning = true;
    while(isGameRunning)
    {
        fishies.forEach((fsh) => fsh.think());
    }
}
function CreateFish(params) {
    fishies.push(new fish(params))
}

// Express Server Setup
function StartExpressServer() {
    xpress.use("/", express.static(path.join(__dirname, "src")));
  //Server Start
  server.listen(3000, () => {
    console.log("listening on *:3000");
  });
}
function StopExpressServer() {
    server.close();
};
// Electron Functions
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Loading...",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./admin/ControlPannel.html");
};
const createConsoleWindow = () => {
  // Create the browser window.
  const consoleWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  consoleWindow.loadFile("./src/console.html");
};

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
