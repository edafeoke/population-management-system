import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    min: [2, 'Location name should be two or more characters'],
    unique: true,
    trim: true,
    required: [ true, 'Location name required'],
  },
  maleResidents: {
    type: Number,
    default: 0,
    required: [ true, 'Number of male residents required'],
  },
  femaleResidents: {
    type: Number,
    default: 0,
    required: [ true, 'Number of females residents required'],
  },
  totalResidents: {
    type: Number,
    default: 0,
    required: [ true, 'Total number of residents']
  }
});
exports.Location = mongoose.model('Locations', locationSchema);
