import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hash(password, 12);

    await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        emailVerified: false
    });

    res.status(201).json({ message: 'User created' });
}
