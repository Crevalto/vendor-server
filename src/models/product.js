const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    productname: { type: String, required: true },
    pick_up_addr: { type: String, vrequired: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    size: { type: String },
    category: { type: String },
    product_images: { type: Buffer },
    proof_of_sale_price: { type: Buffer },
    tax_document: { type: Buffer },
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
const Product = mongoose.model('Product', productSchema)

module.exports = Product
