import connectMongo from './lib/mongodb.js';
import User from './models/User.js';

async function test() {
  await connectMongo();
  try {
    const user = await User.create({
      name: 'Test OAuth',
      email: 'testoauth@example.com',
      authProvider: 'google'
    });
    console.log('User created:', user);
  } catch (e) {
    console.error('Failed to create:', e);
  }
}

test();
