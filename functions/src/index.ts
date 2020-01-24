import * as functions from "firebase-functions";

export const run = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});
