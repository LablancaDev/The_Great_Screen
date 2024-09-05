// * CONEXIÓN A MONGODB Driver Oficial de MongoDB

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        const database = client.db('nombre_base_datos_mongo');
        const collection = database.collection('nombre_coleccion');

        const usuarios = await collection.find({}).toArray();
        console.log(usuarios);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

connectToMongo();
