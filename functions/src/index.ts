import * as functions from "firebase-functions";
import { spawn } from "child_process";

function runFile(code: string, response: functions.Response) {
  const python = spawn("python3", ["-c", code]);
  const responseJSON = { output: "", error: "", code: 0 };

  python.stdin.end();
  python.stdout.on("data", (data: string) => (responseJSON.output += data));
  python.stderr.on(
    "data",
    (data: { toString: () => string }) =>
      (responseJSON.error += data.toString())
  );
  python.on("close", (code: string) => {
    responseJSON.code = Number(code);
    response.json(responseJSON);
  });
}

export const run = functions.https.onRequest((request, response) => {
  if (request.body.code) return runFile(request.body.code, response);
  try {
    if (JSON.parse(request.body).code)
      return runFile(JSON.parse(request.body).code, response);
  } catch (error) {}
  return response.json({ error: "Please send a vaild post request." });
});
