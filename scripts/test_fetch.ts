import { connect } from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
import Tour from '../src/models/Tour';
import { getTours } from '../src/lib/api';

async function test() {
  await connect(process.env.MONGODB_URI as string);
  console.log("Connected");
  const tours = await getTours();
  console.log("First Tour:");
  console.log({ id: tours[0].id, slug: tours[0].slug });
  process.exit(0);
}

test();
