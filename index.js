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
const shortid = require('shortid');
let mainWindow;
let secondWindow;
let counter;
let inventoryCounter;
let menuTemplate;
let menuLogin;
let subMenu

app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration:true
        }
       
    });
    const menu = Menu.buildFromTemplate(menuLogin);
    Menu.setApplicationMenu(menu);
    mainWindow.loadURL(`File://${__dirname}/index.html`);
    mainWindow.on('closed', () =>{
        mainWindow = null;
        app.quit();
        
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
    const menu = Menu.buildFromTemplate(subMenu);
    Menu.setApplicationMenu(menu);
    secondWindow.loadURL(`File://${__dirname}/add_records.html`);
    secondWindow.on('closed', ()=>{
        const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
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
    const menu = Menu.buildFromTemplate(subMenu);
    Menu.setApplicationMenu(menu);
    secondWindow.loadURL(`File://${__dirname}/add_inventory.html`);
    
    secondWindow.on('closed', ()=>{
        const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
        secondWindow = null;
    });

}
function updateItemWindow(){
    secondWindow = new BrowserWindow({
        height:450,
        width:800,
        title:'Update Inventory',
        webPreferences: {
            nodeIntegration: true
            }
    })
    const menu = Menu.buildFromTemplate(subMenu);
    Menu.setApplicationMenu(menu);
    secondWindow.loadURL(`File://${__dirname}/update_item_inventory.html`);
    
    secondWindow.on('closed', ()=>{
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
        secondWindow = null;
    });
}


//listeners
ipcMain.on('open:addrecords',e=>{
addNewWindow();
});

ipcMain.on('record:add',(e, employee, service, payment,dateOfToday,timeOfToday) =>{

    if(db.has('user[0].count').value){
        counter = db.get('user').map(`count`).reverse().take(1).value();
     }
     else{
     counter = 0;
     }

    counter++;

    mainWindow.webContents.send('records:add', employee, service, payment, counter,dateOfToday,timeOfToday);
    secondWindow.close();
});

ipcMain.on('open:addinventory',e=>{
    addNewInventoryWindow();
});

ipcMain.on('inventory:addNew', (e, item, quantity, payment,dateOfToday,timeOfToday) =>{
    if(db1.has('Item').value){
        inventoryCounter = db1.get('Item').map(`Count`).reverse().take(1).value();
     }
     else{
     inventoryCounter = 0;
     }
    inventoryCounter++;
    let itemID = shortid.generate();
    mainWindow.webContents.send('inventory:add', item, quantity, payment, dateOfToday,timeOfToday,inventoryCounter,itemID);
    secondWindow.close();
})

ipcMain.on('password:changed', () =>{
    mainWindow.loadURL(`File://${__dirname}/index.html`);
})

ipcMain.on('login:success',e=>{
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
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
ipcMain.on('update:inventory',()=>{
    updateItemWindow();
})
ipcMain.on('update:success',()=>{
    secondWindow.close();
    mainWindow.loadURL(`File://${__dirname}/inventory.html`);
})

menuTemplate=[
{
    label:'File',
        submenu:[
            {
                label:'Quit',
                click:()=>{
                    mainWindow.close();
                },
                accelerator:'Ctrl+Q'
            }
        ]
    },
    {
    label:'Records',
        submenu:[
            {
                label:'Add new record',
                click:()=>{
                    addNewWindow();
                },
                accelerator:'Ctrl+N'
            },
            {
                label:'View archived records',
                click:()=>{
                    mainWindow.loadURL(`File://${__dirname}/view_archive_records.html`);
                },
                accelerator:'Ctrl+R'
            }

        ]},{
        label:'Inventory',
        submenu:[
            {
                label:'Add new item',
                click:()=>{
                    addNewInventoryWindow();
                },
                accelerator:'Ctrl+Shift+N'
            },
            {
                label:'Update item',
                click:()=>{
                    updateItemWindow();
                },
                accelerator:'Ctrl+Shift+R'
            }
        ]
}
]
menuLogin=[
    {
        label:'Please Login first!',
        
    }
]
subMenu=[
    {
        label:' '
    }
]