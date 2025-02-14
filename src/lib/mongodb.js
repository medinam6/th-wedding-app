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
    tlsAllowInvalidCertificates: true, // For development only
    maxPoolSize: 10, // Maximum number of connections in the pool
    minPoolSize: 5,  // Minimum number of connections in the pool
    maxIdleTimeMS: 60000, // How long a connection can be idle before being removed
    connectTimeoutMS: 10000, // How long to wait for a connection to be established
};

// In development, we might want different pool sizes
// if (process.env.NODE_ENV === 'development') {
//     options.maxPoolSize = 5;
//     options.minPoolSize = 1;
// }

let client;
let clientPromise;


// In production, it's best to not use a global variable.
client = new MongoClient(uri, options);
clientPromise = client.connect()
    .then(client => {
        console.log('Successfully connected to MongoDB');
        return client;
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
        throw error;
    });


// Add a function to gracefully close the connection
export async function closeConnection() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

// Add error handling for unexpected shutdowns
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
});

export default clientPromise;
