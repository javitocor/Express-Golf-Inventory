var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 20},
    description: {type: String, required: true, min: 5, max: 150},
    categorie: [{type: Schema.ObjectId, ref: 'Categorie', required: true}],
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0},
    image: {type: String},
});

// Virtual for this Item instance URL.
ItemSchema
.virtual('url')
.get(function () {
  return '/catalog/item/'+this._id;
});

// Export model.
module.exports = mongoose.model('Item', ItemSchema);