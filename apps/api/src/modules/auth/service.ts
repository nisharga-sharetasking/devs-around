import jwt from 'jsonwebtoken'
import { User, IUser } from '../../models/User'
import { Types } from 'mongoose'
import { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } from '../../utils/customError'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config'
import type { SignupInput, LoginInput } from './schemas'

interface AuthResponse {
  user: IUser
  token: string
}

export class AuthService {

  async signup(data: SignupInput): Promise<AuthResponse> {
    try {
      const { name, email, password, role } = data

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new ConflictError('User with this email already exists')
      }

      // Create new user
      const user = new User({
        name,
        email,
        passwordHash: password, // Will be hashed by pre-save hook
        role: role || 'author'
      })

      await user.save()

      // Generate JWT token
      const token = this.generateToken(user._id as Types.ObjectId)

      return { user, token }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data

    // Find user with password field
    const user = await User.findOne({ email }).select('+passwordHash')
    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    // Generate JWT token
    const token = this.generateToken(user._id as Types.ObjectId)

    // Remove password from user object
    user.passwordHash = undefined as any

    return { user, token }
  }

  async getMe(userId: string): Promise<IUser> {
    if (!userId) {
      throw new BadRequestError('User ID is required')
    }

    const user = await User.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }

  generateToken(userId: Types.ObjectId): string {
    return jwt.sign(
      { userId: userId.toString() },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    )
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
      return decoded
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired')
      }
      throw new UnauthorizedError('Invalid token')
    }
  }
}