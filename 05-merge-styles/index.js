const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const styles = path.join(__dirname, 'styles');
const pathDir = path.join(__dirname, 'project-dist', 'bundle.css');

const buildStream = fs.createWriteStream(pathDir, 'utf-8');
async function buildBundle(input) {
    try {
        const files = await readdir(input, { withFileTypes: true });
        files.forEach(function (file) {
            if (file.isFile()) { 
                if (path.extname(path.join(input, file.name)) == '.css') {
                const inputStream = fs.createReadStream(path.join(input, file.name), 'utf-8');
                    inputStream.on('data', (chunk) => {
                        buildStream.write(chunk);
                    });
                }
            }
        });
    } 
    catch (error) {
        console.log(error.message);
    }
}
buildBundle(styles); 


