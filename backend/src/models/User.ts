import bcrypt from 'bcryptjs'
import { Schema, model, type Document } from 'mongoose'

export type UserRole = 'admin' | 'user'

export interface IUser extends Document {
  id: string
  nom: string
  email: string
  password: string
  role: UserRole
  actif: boolean
  comparePassword(password: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      required: true,
    },
    actif: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        const user = ret as Record<string, unknown>
        delete user._id
        delete user.__v
        delete user.password
        return ret
      },
    },
    toObject: {
      virtuals: true,
    },
  },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function comparePassword(
  password: string,
) {
  return bcrypt.compare(password, this.password)
}

export default model<IUser>('User', userSchema)
