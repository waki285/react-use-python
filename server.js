const express = require("express");
const childProcess = require("child_process");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const os = require("os");

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.static("dist"));
app.use(express.json());

function spawn(command, args) {
  return new Promise((resolve) => {
    // damn this api is shit
    const p = childProcess.spawn(command, args);
    const stdouts = [];
    const stderrs = [];

    p.stdout.on("data", (data) => {
      stdouts.push(data);
    });

    p.stderr.on("data", (data) => {
      stderrs.push(data);
    });

    p.on("close", (code) => {
      resolve({
        code: code,
        stdout: Buffer.concat(stdouts).toString(),
        stderr: Buffer.concat(stderrs).toString(),
      });
    });
  });
}

function maketmp() {
  return new Promise((resolve, reject) => {
    fs.mkdtemp(path.join(os.tmpdir(), "use-python"), (err, dir) => {
      if (err !== null) reject(err);
      else resolve(dir);
    });
  });
}

async function runPython(code) {
  const dir = await maketmp();
  const pyFile = path.join(dir, "main.py");
  await fsPromises.writeFile(pyFile, decodeURIComponent(code));
  const out = await spawn("python3", [pyFile]);
  return out;
}

app.post("/rpc/rce", async (req, res) => {
  const { code } = req.body;
  const out = await runPython(code);
  res.json(out);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
