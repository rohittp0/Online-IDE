import * as functions from "firebase-functions";
import { spawn } from "child_process";

function runFile(code: string) {
  const responseJSON = { output: "", error: "", code: 0 };

  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["-c", code]);
    python.stdin.end();
    python.stdout.on("data", (data: string) => (responseJSON.output += data));
    python.stderr.on(
      "data",
      (data: { toString: () => string }) =>
        (responseJSON.error += data.toString())
    );
    python.on("close", (exitCode: string) => {
      responseJSON.code = Number(exitCode);
      resolve(responseJSON);
    });
  });
}

export const run = functions.https.onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (request.body.code) return runFile(request.body.code).then(response.json);
  try {
    if (JSON.parse(request.body).code)
      return runFile(JSON.parse(request.body).code).then(response.json);
  } catch (error) {}
  return response.json({ error: "Please send a vaild post request." });
});
