var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CategorieSchema = new Schema({
    name: {type: String, required: true, min: 3, max: 20},
    description: {type: String, required: true, min: 5, max: 100}
});

// Virtual for this categorie instance URL.
CategorieSchema
.virtual('url')
.get(function () {
  return '/catalog/category/'+this._id;
});

// Export model.
module.exports = mongoose.model('Categorie', CategorieSchema);
