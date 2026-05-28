import mongoose from 'mongoose'

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('MONGODB_URI est manquant dans les variables d environnement')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connecte')
}
