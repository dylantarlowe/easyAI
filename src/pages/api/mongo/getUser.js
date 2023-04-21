import { hashPassword } from '../../../../lib/mongo/auth';
import { connectToDatabase } from '../../../../lib/mongo/db';
import { getSession } from "next-auth/react";

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  try {
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
      client.close()
      return res.status(201).json({ existingUser });
    }
    else {
      return res.status(422).json({ message: 'user not found' });
    }
  }
  catch(e) {
    console.log("error!"  + e)
    client.close()
    return res.status(422).json({ message: 'user not found' });
  }
}

export default handler;
