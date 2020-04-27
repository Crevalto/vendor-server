const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Order = require('./order')
const Product = require('./product')
const Account = require('./account')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shopname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email should be a valid address!')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error("Your password can't be a password!")
        }
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: Number,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 6,
    },
    tax_iden_no: {
      type: String,
      minlength: 15,
      maxlength: 15,
      unique: true,
    },
    doc_verify: { data: Buffer, contentType: String, required: true },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'owner',
})
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'owner',
})
userSchema.virtual('accounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.doc_verify
  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Check the credentials!')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Check the credentials')
  }
  return user
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
