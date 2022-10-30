const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");
const stream = fs.createReadStream(filePath, "utf-8");
const out = process.stdout;
stream.pipe(out);