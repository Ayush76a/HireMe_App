const { Transaction } = require('braintree');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: {
    type: String,
    ref:"User"
  },
  payment : {

  },
  helper :  {
    type: String,
    ref: "Helper"
  },
  status : {
    type : String,
    default:"Not Process",
    enum : ["Not Process",  "Processing", "Cancelled", "Done"],
  }


  
}, { timestamps: true });


const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction
