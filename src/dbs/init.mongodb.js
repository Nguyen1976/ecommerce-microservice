'use-strict'

const mongoose = require('mongoose')

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose
      .connect(`mongodb://localhost:27017/shopDev`, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
      })
      .then(() => {
        console.log(`${type} connected`)
      })
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB
