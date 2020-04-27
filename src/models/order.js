const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
    status: {
      type: String,
    },
    companyName: {
      type: String,
    },
    totalPrice: {
      type: Number,
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
const Order = mongoose.model('Order', orderSchema)

module.exports = Order
