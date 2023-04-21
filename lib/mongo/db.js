import { MongoClient } from 'mongodb';

export async function connectToDatabase() {
	const client = new MongoClient(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client;
  } catch (error) {
    console.log(error);
    throw new Error('Could not connect to MongoDB');
  }
}