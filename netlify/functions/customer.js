require('dotenv').config();
const { MongoClient } = require('mongodb');
console.log("🔐 MONGO_URI:", process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let client;

  try {
    const formatNames = (arr) =>
      [...new Set(
        arr
          .filter(Boolean) // remove null/undefined
          .map(item => item.trim().toLowerCase()) // normalize case + trim
      )]
      .map(item => item.charAt(0).toUpperCase() + item.slice(1)) // title-case first letter
      .sort(); // optional: alphabetical
    

    client = await MongoClient.connect(uri, { maxPoolSize: 5 }); // small pool for serverless
    const db = client.db("test");

    const customersRaw = await db.collection("sales").distinct("customer");
    const brandsRaw = await db.collection("sales").distinct("items.brand");

    const customers = formatNames(customersRaw);
    const brands = formatNames(brandsRaw);

    return {
      statusCode: 200,
      body: JSON.stringify({ customers, brands }),
    };
  } catch (error) {
    return { statusCode: 500, body: "Error: " + error.message };
  } finally {
    if (client) {
      await client.close();
    }
  }
};











/*require('dotenv').config();
const { MongoClient } = require('mongodb');
console.log("🔐 MONGO_URI:", process.env.MONGODB_URI);
const uri = process.env.MONGODB_URI;

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {

const formatNames = (arr) =>
  [...new Set(arr.map(item => (item || "Unknown").trim().toLowerCase()))]
    .map(item => item.charAt(0).toUpperCase() + item.slice(1));
    const client = await MongoClient.connect(uri);
    const db = client.db("test");
const customersRaw = await db.collection("sales").distinct("customer");
const brandsRaw = await db.collection("sales").distinct("items.brand");
const customers = formatNames(customersRaw);
const brands = formatNames(brandsRaw);

    return {
      statusCode: 200,
      body: JSON.stringify({customers,brands}),
    };
  } catch (error) {
    return { statusCode: 500, body: "Error: " + error.message };
  }
};
*/