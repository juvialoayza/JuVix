const { Schema, model} = require("mongoose");

const supplierSchema = new Schema({
  name: {
    type: String,
  },
  location: {
    type: String,
  },
  admin: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Supplier = model("Supplier", supplierSchema);

module.exports = Supplier;
