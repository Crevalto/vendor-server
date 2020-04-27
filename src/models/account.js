const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: Number,
      minlength: 16,
      maxlength: 16,
      required: true,
    },
    cardHolderName: {
      type: String,
      required: true,
    },
    expiryMonth: {
      type: String,
      required: true,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    cvv: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)
const Account = mongoose.model('Account', accountSchema)

module.exports = Account
