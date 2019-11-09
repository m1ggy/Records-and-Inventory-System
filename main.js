const login = document.querySelector('.login');
const invalidtext= document.querySelector('.invalidtext');
const electron = require('electron');
const {ipcRenderer} = electron;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('password.json');
const db = low(adapter);
const success = document.querySelector('.success');
let username1 = 'admin';
let password1 ='';


db.defaults({password:{defaultpass:"admin"}}).write();




login.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(db.has('password.newpass').value()){
        password1 = db.get('password.newpass').value();
    }
    else{
        password1 = db.get('password.defaultpass').value();
    }
    console.log(password1);
        if(login.username.value == username1 & login.password.value == password1){
            invalidtext.style.display= "none";
            success.style.display = "";
            console.log('Hey im inside now');
            setTimeout(() =>{
                ipcRenderer.send('login:success');
            },1500);
           
        }
        else{
            invalidtext.style.display= "";
        }
})