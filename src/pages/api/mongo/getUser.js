import { hashPassword } from '../../../../lib/mongo/auth';
import { connectToDatabase } from '../../../../lib/mongo/db';
import { getSession } from "next-auth/react";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const data = req.body;
  const email = data.email;

  const client = await connectToDatabase();

  if (client) {
    const db = client.db('easyAI');

    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
      res.status(201).json({ existingUser });
      client.close();
    }
    
    res.status(422).json({ message: 'user not found' });
    client.close();
  }
}

export default handler;
