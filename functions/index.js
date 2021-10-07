const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")();
const serviceAccount = require("./drug-distribution-system-firebase-adminsdk-gzasb-37b7bb2983.json");
const axios = require("axios").default;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
exports.place_details = functions.https.onRequest((request, response) => {
  console.log(request.query, "request body");
  cors(request, response, () => {
    if (request.query.place_id) {
      let place_id = request.query.place_id;
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=AIzaSyCSfLqHtXZmHww98tHHDPkd70yB-3FVTT4`
        )
        .then((res) => {
          //   console.log(res.data);
          let result = res.data.result;
          response.send({ result });
        })
        .catch((error) => {
          console.log(error);

          response.sendStatus(404);
        });
    } else {
      response.sendStatus(403);
    }
  });
});
