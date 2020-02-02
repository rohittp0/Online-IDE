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
  python.on("close", (Exitcode: string) => {
    responseJSON.code = Number(Exitcode);
    response.json(responseJSON);
  });
}

export const run = functions.https.onRequest((request, response) => {
  try {
    if (request.body.code) runFile(request.body.code, response);
    else if (JSON.parse(request.body).code)
      runFile(JSON.parse(request.body).code, response);
    else response.json({ error: "Please send a vaild post request.", code: 1 });
  } catch (error) {
    console.error(error);
  }
});
