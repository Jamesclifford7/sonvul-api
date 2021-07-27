require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const fetch = require('node-fetch');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
// app.use(express.json())

app.get('/api/yelp-venues/:location', (req, res) => {
    // https://api.yelp.com/v3/businesses/search?term=music venues&location=san diego

    const { location } = req.params; 

    fetch(`https://api.yelp.com/v3/businesses/search?term=music+venues&location=${location}&limit=5`, {
        method: 'GET', 
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json', 
            'Authorization': `Bearer ${process.env.API_KEY_YELP}`
        }
    })
    .then((results) => {
        if (!results.ok) {
            throw new Error()
        }
        // console.log(values)
        return results.json()
        // return console.log(values.json())
    })
    .then((resultsJson) => {
        // console.log(valuesJson)
        return res.send(resultsJson)
    })
    .catch((error) => {
        console.log(error)
    })

})

app.get('/api/music-blogs', (req, res) => {
    // https://serpapi.com/search?engine=google&gl=us&hl=en&api_key=c72f311bff73dd799dd3918cde9e2c8e831ae3b7fc336573c93a4c5ac955dcc0&q=indie music blogs
    fetch(`https://serpapi.com/search?engine=google&gl=us&hl=en&api_key=${process.env.API_KEY_SERP}&q=indie+music+blogs`, {
        method: 'GET', 
        headers: {
            'Access-Control-Allow-Origin': '*',
            'content-type': 'application/json' 
        }
    })
    .then((results) => {
        if (!results.ok) {
            throw new Error()
        }
        return results.json()
    })
    .then((resultsJson) => {
        return res.send(resultsJson.organic_results)
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app