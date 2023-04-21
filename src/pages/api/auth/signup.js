import { hashPassword } from '../../../../lib/mongo/auth';
import { connectToDatabase } from '../../../../lib/mongo/db';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    return res.status(422).json({
      message:
        'Invalid input - password should also be at least 5 characters long.',
    });
  }

  const client = await connectToDatabase();

  const db = client.db('easyAI');

  const existingUser = await db.collection('users').findOne({ email: email });

  if (existingUser) {
    return res.status(422).json({ message: 'User exists already!' });
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  });

  return res.status(201).json({ message: 'Created user!' });
}

export default handler;
