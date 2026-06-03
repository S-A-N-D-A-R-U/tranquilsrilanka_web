import connectToDatabase from './mongodb';
import Tour from '../models/Tour';
import Activity from '../models/Activity';
import HeroSlide from '../models/HeroSlide';
import Offer from '../models/Offer';
import Post from '../models/Post';

/**
 * Helper to transform MongoDB _id to string for Next.js serialization
 */
function serializeDocument(doc: any) {
  if (!doc) return null;
  const serialized = JSON.parse(JSON.stringify(doc));
  if (serialized._id) {
    serialized.id = serialized._id;
    delete serialized._id;
  }
  return serialized;
}

export async function getTours() {
  try {
    await connectToDatabase();
    const tours = await Tour.find({}).populate('linkedOffers').lean();
    return tours ? tours.map(serializeDocument) : [];
  } catch (error) {
    console.error("Error fetching tours from DB:", error);
    return [];
  }
}

export async function getTourBySlug(slug: string) {
  try {
    await connectToDatabase();
    const tour = await Tour.findOne({ slug }).populate('linkedOffers').lean();
    return tour ? serializeDocument(tour) : null;
  } catch (error) {
    console.error(`Error fetching tour ${slug} from DB:`, error);
    return null;
  }
}

export async function getActivities() {
  try {
    await connectToDatabase();
    const activities = await Activity.find({}).lean();
    return activities ? activities.map(serializeDocument) : [];
  } catch (error) {
    console.error("Error fetching activities from DB:", error);
    return [];
  }
}

export async function getActivityBySlug(slug: string) {
  try {
    await connectToDatabase();
    const activity = await Activity.findOne({ slug }).lean();
    return activity ? serializeDocument(activity) : null;
  } catch (error) {
    console.error(`Error fetching activity ${slug} from DB:`, error);
    return null;
  }
}

export async function getHeroSlides() {
  try {
    await connectToDatabase();
    const slides = await HeroSlide.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return slides ? slides.map(serializeDocument) : [];
  } catch (error) {
    console.error("Error fetching hero slides from DB:", error);
    return [];
  }
}

export async function getOffers() {
  try {
    await connectToDatabase();
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    return offers ? offers.map(serializeDocument) : [];
  } catch (error) {
    console.error("Error fetching offers from DB:", error);
    return [];
  }
}

export async function getOfferBySlug(slug: string) {
  try {
    await connectToDatabase();
    const offer = await Offer.findOne({ slug, isActive: true }).lean();
    return offer ? serializeDocument(offer) : null;
  } catch (error) {
    console.error(`Error fetching offer ${slug} from DB:`, error);
    return null;
  }
}

export async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
    return posts ? posts.map(serializeDocument) : [];
  } catch (error) {
    console.error("Error fetching posts from DB:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug }).lean();
    return post ? serializeDocument(post) : null;
  } catch (error) {
    console.error(`Error fetching post ${slug} from DB:`, error);
    return null;
  }
}
