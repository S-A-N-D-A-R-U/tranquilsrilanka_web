const mongoose = require('mongoose');

async function checkDb() {
  const uri = "";
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const toursCollection = db.collection('tours');
  const count = await toursCollection.countDocuments();
  console.log("Number of tours in DB:", count);
  
  if (count > 0) {
    const sample = await toursCollection.find({}).limit(1).toArray();
    console.log("Sample tour title:", sample[0].title);
  }
  
  await mongoose.disconnect();
}

checkDb().catch(console.error);
