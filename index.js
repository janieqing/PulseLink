/* eslint-disable */

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Admin SDK
admin.initializeApp();

// HTTP function to receive POSTed JSON and write it into Firestore
exports.submitHealthData = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Grab the JSON body
  const data = req.body;

  try {
    // Add the data to the "apple-health" collection
    const writeResult = await admin
      .firestore()
      .collection('apple-health')
      .add(data);

    // Respond with the new document ID
    return res.status(200).json({ id: writeResult.id });
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    return res.status(500).send(error.toString());
  }
});