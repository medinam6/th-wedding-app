import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri ? 'Exists' : 'Missing');

if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local')
}

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true // For development only
};

let client;
let clientPromise;

try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();

    // Test the connection
    clientPromise.then(() => {
        console.log('Successfully connected to MongoDB');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
} catch (error) {
    console.error('MongoDB client creation error:', error);
    throw new Error('Failed to initialize MongoDB client');
}

export default clientPromise;
