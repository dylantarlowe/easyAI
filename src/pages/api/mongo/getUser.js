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
    console.log("client is connected")
  }
  else {
    console.log("client is not connected")
  }

  const db = client.db('easyAI')  

  const existingUser = await db.collection('users').findOne({ email: email }) 


  if (existingUser) {
    console.log("existingUser is true")
    res.status(201).json({ existingUser });
    return;
  }
  else {
    res.status(422).json({ message: 'user not found' });
    return;
  }
}

export default handler;
