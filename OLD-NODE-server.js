const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");

const EventEmitter = require("events");

class Emitter extends EventEmitter {}

// init object instance
const myEmmiter = new Emitter();

myEmmiter.on("log", (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      contentType.includes("image") ? "" : "utf8"
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmmiter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");

    response.statusCode = 500;
    response.end();
  }
};
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  myEmmiter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  //   ! the right way
  const extension = path.extname(req.url);
  let contentType;

  // ! switch - efficient
  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }

  let filePath =
    //   ! if home ---> pathname is in views, file is index.html
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : //   ! this accounts for a subdir (last char will be a '/')
      contentType === "text/html" && req.url.slice(-1) === "/"
      ? //   ! if subdir ---> go to views->req.url(specifies subdir)->index/html (different index.html)
        path.join(__dirname, "views", req.url, "index.html")
      : // ! if these two above are false --> if it's html
      contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : //   ! this last one accounts for something different than html
        path.join(__dirname, req.url);

  //   ! makes .html extension not required in the browser - adds it automatically
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // serve file
    serveFile(filePath, contentType, res);
  } else {
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;

      case "www-page.html":
        res.writeHead(301, { Location: "/" });
        res.end();
        break;

      default:
        // serve 404 response
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }

  //   let filePath;
  //   ! not efficient
  //   if (req.url === "/" || req.url === "index.html") {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "text/html");
  //     filePath = path.join(__dirname, "views", "index.html");
  //     fs.readFile(filePath, "utf-8", (err, data) => {
  //       res.end(data);
  //     });
  //   }

  // ! switch - not efficient
  //   switch (req.url) {
  //     case "/":
  //       res.statusCode = 200;

  //       path = path.join(__dirname, "views", "index.html");
  //       fs.readFile(filePath, "utf-8", (err, data) => {
  //         res.end(data);
  //       });
  //       break;
  //   }
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
