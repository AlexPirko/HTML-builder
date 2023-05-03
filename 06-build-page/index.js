const fs = require("fs");
const path = require("path");
const htmlStream = fs.ReadStream(path.join(__dirname, "template.html"));

fs.mkdir(path.join(__dirname, "project-dist"), {
        recursive: false
    },
    function () {}
);

function buildAssets(origDir, buildDir) {
    fs.mkdir(buildDir, {
            recursive: false
        },
        (err) => {
            if (err) console.log(err);
            fs.readdir(path.join(origDir), {
                    withFileTypes: true
                },
                (err, files) => {
                    if (err) console.log(err);
                    else {
                        files.forEach((file) => {
                            if (file.isFile()) {
                                fs.copyFile(path.join(origDir, file.name), path.join(buildDir, file.name),
                                    (err) => {
                                        if (err) console.log(err);
                                    });
                                return;
                            } else if (file.isDirectory()) {
                                buildAssets(path.join(origDir, file.name), path.join(buildDir, file.name));
                            }
                        });
                    }
                });
        });
}
buildAssets(path.join(__dirname, "assets"), path.join(__dirname, "project-dist", "assets"));


let dataStr = "";

htmlStream.on("readable", function () {
    const data = htmlStream.read();
    if (data)
        fs.writeFile(path.join(__dirname, "project-dist", "index.html"),
            data.toString(),
            function (err) {
                if (err) throw err;
            }
        );
    if (data) {
        dataStr = data.toString();
        fs.readdir(path.join(__dirname, "components"), {
                withFileTypes: true
            },
            (err, files) => {
                if (err) console.log(err);
                else {
                    buildHtml(files.filter((file) => file.isFile() && path.extname(file.name) == ".html"),
                        dataStr
                    );
                }
            });
    }
});

function buildHtml(files = [], dataStr) {
    if (!files.length) {
        fs.writeFile(path.join(__dirname, "project-dist", "index.html"), dataStr,
            function (err) {
                if (err) throw err;
            });
    } else {
        pathName = files.shift().name;
        fs.readFile(path.join(__dirname, "components", pathName),
            (err, comp) => {
                if (err) console.log(err);
                else
                    dataStr = dataStr.replace(`{{${path.parse(pathName).name}}}`,
                        comp.toString()
                    );
                buildHtml(files, dataStr);
            });
    }
}


const cssStream = fs.createWriteStream(path.join(__dirname, "project-dist", "style.css"));

fs.readdir(path.join(__dirname, "styles"), {
        withFileTypes: true
    },
    (err, files) => {
        if (err) console.log(err);
        else {
            buildCss(
                files.filter((file) => file.isFile() && path.extname(file.name) == ".css"),
                cssStream
            );
        }
    });

function buildCss(files = [], dataStr) {
    if (!files.length) {
        dataStr.end();
    } else {
        const curName = path.resolve(__dirname, "styles", files.shift().name);
        const createStream = fs.createReadStream(curName);

        createStream.pipe(dataStr, {
            end: false
        });
        createStream.on("end", function () {
            buildCss(files, dataStr);
        });
        createStream.on("err", function (err) {
            console.log(err);
            dataStr.close();
        });
    }
}