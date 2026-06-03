import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Since these use typescript aliases, we will use dynamic imports or just copy the data here to avoid TS compile issues in a raw node script.
// To avoid compilation errors and tsconfig path alias issues when running directly, we import the raw JS/TS data files if possible, 
// but the safest way is to just grab the raw data.
import { tours } from '../src/data/tours';
import { activities } from '../src/data/activities';
import Tour from '../src/models/Tour';
import Activity from '../src/models/Activity';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(MONGODB_URI as string);
    console.log('Connected.');

    console.log('Clearing existing data...');
    await Tour.deleteMany({});
    await Activity.deleteMany({});
    console.log('Old data cleared.');

    console.log('Seeding Tours...');
    const mappedTours = tours.map(t => {
      const doc = { ...t, slug: t.id };
      delete (doc as any).id;
      return doc;
    });
    await Tour.insertMany(mappedTours);
    console.log(`Inserted ${mappedTours.length} tours.`);

    console.log('Seeding Activities...');
    const mappedActivities = activities.map(a => {
      const doc = { ...a, slug: a.id };
      delete (doc as any).id;
      return doc;
    });
    await Activity.insertMany(mappedActivities);
    console.log(`Inserted ${mappedActivities.length} activities.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
