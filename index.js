const electron = require('electron');
const {Menu,app,BrowserWindow,ipcMain} = electron;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const adapterInvent = new FileSync('db1.json')
const db1 = low(adapterInvent);
const adapterArchive = new FileSync('Archive.json');
const dbArchive = low(adapterArchive);
let mainWindow;
let secondWindow;
let counter;
let inventoryCounter;

if(db.has('user').value == true){
    counter = db.get('user').map(`count`).reverse().take(1).value();
 }
 else{
 counter = 0;
 }


if(db1.has('Item').value == true){
    inventoryCounter = db1.get('Item').map(`Count`).reverse().take(1).value();
 }
 else
 inventoryCounter = 0;

   
app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true
        }
       
    });
    mainWindow.loadURL(`File://${__dirname}/index.html`);

    mainWindow.on('closed', () =>{
        
    })

    
});

function addNewWindow(){
    secondWindow = new BrowserWindow({
        height:600,
        width:800,
        title:'Add New Records',
        webPreferences: {
            nodeIntegration: true
            }
    });
    secondWindow.loadURL(`File://${__dirname}/add_records.html`);
    secondWindow.on('closed', ()=>{
        secondWindow = null;
    });
};

function addNewInventoryWindow(){
    secondWindow = new BrowserWindow({
        height:600,
        width:800,
        title:'Update Inventory',
        webPreferences: {
            nodeIntegration: true
            }
    });
    secondWindow.loadURL(`File://${__dirname}/add_inventory.html`);
    
    secondWindow.on('closed', ()=>{
        secondWindow = null;
    });

}


//listeners
ipcMain.on('open:addrecords',e=>{
addNewWindow();
});

ipcMain.on('record:add',(e, employee, service, payment,dateOfToday,timeOfToday) =>{
    counter++;

    mainWindow.webContents.send('records:add', employee, service, payment, counter,dateOfToday,timeOfToday);
    secondWindow.close();
});

ipcMain.on('open:addinventory',e=>{
    addNewInventoryWindow();
});

ipcMain.on('inventory:addNew', (e, item, quantity, payment,dateOfToday,timeOfToday) =>{
    inventoryCounter++;
    mainWindow.webContents.send('inventory:add', item, quantity, payment, dateOfToday,timeOfToday,inventoryCounter);
    secondWindow.close();
})

ipcMain.on('password:changed', () =>{
    mainWindow.loadURL(`File://${__dirname}/index.html`);
})

ipcMain.on('login:success',e=>{
    mainWindow.loadURL(`File://${__dirname}/home.html`);
});
ipcMain.on('open:archiverecords', e=>{
    mainWindow.loadURL(`File://${__dirname}/archive_records.html`);
});
ipcMain.on('archive:goback', ()=>{
    mainWindow.loadURL(`File://${__dirname}/records.html`);
})

ipcMain.on('archive:records', e=>{
    mainWindow.loadURL(`File://${__dirname}/records.html`);
});





