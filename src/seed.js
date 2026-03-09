/**
 * Seed script — run once to populate DB with initial data.
 * Usage: node src/seed.js
 */
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./models/User');
const Plan = require('./models/Plan');
const Trainer = require('./models/Trainer');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Plan.deleteMany(), Trainer.deleteMany()]);

  // Plans
  const plans = await Plan.insertMany([
    {
      name: 'Basic',
      description: 'Access to gym floor and basic equipment',
      price: 999,
      duration: 30,
      durationLabel: 'monthly',
      features: ['Gym floor access', 'Locker room', 'Basic equipment'],
    },
    {
      name: 'Standard',
      description: 'Includes group classes and trainer consultation',
      price: 1499,
      duration: 30,
      durationLabel: 'monthly',
      features: ['Everything in Basic', 'Group classes', '1 trainer consultation/month'],
    },
    {
      name: 'Premium',
      description: 'Full access with personal training sessions',
      price: 2999,
      duration: 30,
      durationLabel: 'monthly',
      features: ['Everything in Standard', '4 personal training sessions', 'Nutrition guidance', 'Spa access'],
    },
    {
      name: 'Annual Basic',
      description: 'Basic plan billed annually — save 20%',
      price: 7999,
      duration: 365,
      durationLabel: 'annual',
      features: ['Same as Basic', '2 months free'],
    },
  ]);
  console.log(`Seeded ${plans.length} plans`);

  // Trainers
  const trainers = await Trainer.insertMany([
    {
      name: 'Marcus Rivera',
      email: 'marcus@gym.com',
      phone: '555-1001',
      specialization: ['Strength', 'CrossFit'],
      experience: 8,
      bio: 'Certified strength & conditioning coach with 8 years of experience.',
      status: 'active',
    },
    {
      name: 'Aisha Patel',
      email: 'aisha@gym.com',
      phone: '555-1002',
      specialization: ['Yoga', 'Pilates'],
      experience: 5,
      bio: 'RYT-500 certified yoga instructor and Pilates specialist.',
      status: 'active',
    },
    {
      name: 'James Wu',
      email: 'james@gym.com',
      phone: '555-1003',
      specialization: ['Cardio', 'HIIT', 'Zumba'],
      experience: 6,
      bio: 'High-energy HIIT and cardio coach focused on fat loss.',
      status: 'active',
    },
  ]);
  console.log(`Seeded ${trainers.length} trainers`);

  // Admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@gym.com',
    password: 'admin123',
    role: 'admin',
  });

  // Regular user
  const user = await User.create({
    name: 'Demo User',
    email: 'user@gym.com',
    password: 'user123',
    role: 'user',
    currentPlan: plans[1]._id,
    subscriptionStart: new Date(),
    subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log(`Seeded users: ${admin.email}, ${user.email}`);
  console.log('Seed complete!');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
