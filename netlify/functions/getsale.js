require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("test");
    const sales = await db.collection("sales").find().toArray();
    client.close();

    return {
      statusCode: 200,
      body: JSON.stringify(sales),
    };
  } catch (error) {
    return { statusCode: 500, body: "Error: " + error.message };
  }
};

