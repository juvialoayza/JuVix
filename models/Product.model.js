const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    enum: ["maquillaje", "ropa", "cuidado de la piel", "estilo de vida"],
  },
  supplier: [
    {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
    },
  ],
  admin: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Product = model("Product", productSchema);

module.exports = Product;
