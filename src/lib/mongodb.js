import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri ? 'Exists' : 'Missing');

if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local')
}

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: 5, // Reduced for M0 tier
    minPoolSize: 0, // Start with no minimum connections
    maxIdleTimeMS: 30000, // Reduce idle time to 30 seconds
    connectTimeoutMS: 5000,
    family: 4 // Force IPv4
};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Add connection error handling
clientPromise.then(client => {
    console.log('Successfully connected to MongoDB');

    // Add event listeners for connection pool monitoring
    client.on('connectionPoolCreated', (event) => {
        console.log('Connection pool created');
    });

    client.on('connectionPoolClosed', (event) => {
        console.log('Connection pool closed');
    });
}).catch(error => {
    console.error('MongoDB connection error:', error);
});

export default clientPromise;
