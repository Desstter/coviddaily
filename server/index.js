const express = require('express')
const cors = require('cors')
const path = require('path')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3022

app.use(cors())

// Serve the built Vue client
app.use(express.static(path.join(__dirname, '../client/dist')))

app.get('/coviddaily', async (req, res) => {
    try {
        const response = await axios.get('https://api.covidtracking.com/v1/us/daily.json')
        const formatDate = (string) => {
            const s = string.toString()
            return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8)
        }
        const data = response.data.map(({ date, positive, negative, pending, death }) => ({
            date: formatDate(date),
            positive: positive || 0,
            negative: negative || 0,
            pending: pending || 0,
            death: death || 0,
        }))
        if (!req.query.date) return res.json(data)
        const result = data.find(({ date }) => date === req.query.date)
        res.json(result || { date: req.query.date, positive: 0, negative: 0, pending: 0, death: 0 })
    } catch (err) {
        console.error('coviddaily fetch error:', err.message)
        res.status(502).json({ error: 'Upstream data source unavailable' })
    }
})

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'))
})

app.listen(port, (err) => {
    if (err) console.log(err)
    console.log('COVID Daily server listening on PORT', port)
})
