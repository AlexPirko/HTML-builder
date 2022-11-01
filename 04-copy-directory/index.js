const fs = require('fs/promises');
const path = require('path');

const files = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'copy');

fs.rm(filesCopy, {recursive: true, force: true
})
.finally(function() {
    fs.mkdir(filesCopy, {recursive: true
    });
    fs.readdir(files, {
        withFileTypes: true
    })
    .then(function(elements) {
        for (const elem of elements) {
            if (elem.isFile()) {
                let pathOrig = path.join(files, elem.name);
                let pathCopy = path.join(filesCopy, elem.name);
                fs.copyFile(pathOrig, pathCopy);}
        };
    });
});
      