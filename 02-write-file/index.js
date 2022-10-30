const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, "text.txt");
const { stdin } = process;
console.log("Привет! Введите текст для проверки:");


fs.writeFile(filePath, "", function(error){ 
    if(error) throw error;
});

process.on('SIGINT', () => {
    console.log("Хорошего дня!");
    process.exit();  
  });

stdin.on("data", data => {
    if (data.toString().trim() === "exit") {
       console.log("Пока! И не забудь о +20 баллах:)");
       process.exit();
    }
    fs.appendFile(filePath, data, error => {
      if (error)
        throw error;
    });
  });

