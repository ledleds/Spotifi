const { app, BrowserWindow, Tray, Menu, net } = require('electron');
const path = require('path');

let window
function createWindow() {
  window = new BrowserWindow({
    width: 100,
    height: 64,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  window.loadFile('index.html');
}

// const getSong = () => {
//   console.log('----ACCESS->', process.env.accessToken)
//   const request = net.request('https://api.spotify.com/v1/me/player/currently-playing')
//   request.setHeader('Authorization', process.env.accessToken)
//   request.on('response', (response) => {
//     console.log(`STATUS: ${response.statusCode}`)
//     console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
//     response.on('data', (chunk) => {
//       console.log(`BODY: ${chunk}`)
//     })
//     response.on('end', () => {
//       console.log('No more data in response.')
//     })
//   })
//   request.end()
// }

const login = () => {
  const window = new BrowserWindow({ 
    width: 250, 
    height: 80, 
    x: 990,
    y: 20,
    frame: false });

  window.loadURL('http://localhost:3004/login');

  // /*
  //   This is a hack to check if we are on the "/accepted" page
  //   if we are, we destroy the tray and create a new one.
  //   Must find a better way of doing this!
  //   Can I even get rid of express at use electron's net?
  //   Or is that dangerous with the secrets?
  // */
  // win.webContents.on("will-redirect", function (event, url) {
  //   if (url === 'http://localhost:3004/accepted') {
  //     // win.close();

  //     // const response = getSong()
  //     // console.log('response', response)

  //     tray.destroy()

  //     tray = new Tray('./assets/images/logo-16x16.png')

  //     const contextMenu = Menu.buildFromTemplate([
  //       {
  //         label: 'New item',
  //         click() {

  //         }
  //       },
  //       {
  //         label: 'Quit',
  //         click() { app.quit(); }
  //       }
  //     ])

  //     tray.setContextMenu(contextMenu)
  //   }
  // });

  window.on('blur', function() {
    window.close()
  })
};

let tray = null;

app.whenReady().then(() => {
  console.log('App ready');
  // Hide dock icon .... We only want this to live in the tray
  if (app.dock) app.dock.hide();

  tray = new Tray('./assets/images/icon-dark.png');

  tray.on('click', () => {
    if (process.env.accessToken) {
      window.loadURL('http://localhost:3004/accepted');
    } else {
      login();
    }
  });
});

// stop the app closing when all windows are closed
app.on('window-all-closed', event => event.preventDefault() )

// add app.rightClick where we can quit the app. Or log out?
