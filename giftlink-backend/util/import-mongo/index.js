require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const express = require('express');

const app = express();
const PORT = 3060; // Must match containerPort in deployment.yml

let url = `${process.env.MONGO_URL}`;
let filename = `${__dirname}/gifts.json`;
const dbName = 'giftdb';
const collectionName = 'gifts';
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// Load gift data to MongoDB if not present
async function loadData() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();

        if (documents.length === 0) {
            const insertResult = await collection.insertMany(data);
            console.log(`Inserted ${insertResult.insertedCount} documents`);
        } else {
            console.log("Gifts already exist in DB");
        }
    } catch (err) {
        console.error("Error loading data:", err);
    } finally {
        await client.close();
    }
}

loadData();

// Start Express server
app.get("/", (req, res) => {
    res.send("Giftlink backend is running!");
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
