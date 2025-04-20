/* eslint-disable */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * HTTP function to receive a JSON payload { heart_rate: string|number },
 * write it into Firestore as a history entry and a 'latest' doc,
 * using ISO 8601 timestamps, and return the new document's ID.
 */
exports.submitHealthData = functions.https.onRequest(async (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Expect payload: { heart_rate: string|number }
  let heartRate = req.body.heart_rate;
  if (typeof heartRate === 'string') {
    heartRate = parseFloat(heartRate);
  }
  if (typeof heartRate !== 'number' || isNaN(heartRate)) {
    console.error('Invalid heart_rate:', req.body.heart_rate);
    return res.status(400).send('Missing or invalid heart_rate');
  }

  try {
    const db = admin.firestore();
    const nowIso = new Date().toISOString();

    // Write a new history entry with ISO timestamp
    const historyRef = await db.collection('apple-health').add({
      heart_rate: heartRate,
      timestamp: nowIso
    });

    // Overwrite the 'latest' document with ISO timestamp
    await db.collection('apple-health').doc('latest').set({
      heart_rate: heartRate,
      timestamp: nowIso
    });

    // Return the new history document ID
    return res.status(200).json({ id: historyRef.id });
  } catch (error) {
    console.error('Error writing to Firestore:', error);
    return res.status(500).send(error.toString());
  }
});
