'use-strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const countConnect = () => {
  const numConnection = mongoose.connections.length
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024
    console.log(`Memory Usage: ${memoryUsage.toFixed(2)} MB`)
  }, 10000)
}

module.exports = { countConnect, checkOverload }
