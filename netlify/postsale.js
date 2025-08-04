const { MongoClient } = require('mongodb');
require('dotenv').config(); // use only in local dev
const uri = process.env.MONGODB_URI;
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const client = await MongoClient.connect(uri);
    const db = client.db("test");
    const result = await db.collection("sale").insertOne(data);

    client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sale recorded", id: result.insertedId }),
    };
  } catch (error) {
    return { statusCode: 500, body: "Error: " + error.message };
  }
};
