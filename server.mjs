import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { createServer } from "node:http";

const rootDir = resolve(".");
const port = Number(process.env.PORT || process.argv[2] || 8081);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
};

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url || "/", "http://localhost").pathname;
    const filePath = resolve(rootDir, pathname === "/" ? "index.html" : `.${pathname}`);
    if (!filePath.startsWith(rootDir)) {
      throw new Error("forbidden");
    }

    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(request.method === "HEAD" ? "" : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
