const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000
const axios = require('axios');
const nodemailer = require('nodemailer');

app.use(cors())

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/coviddaily', async (req, res) => {
    const response = await axios.get('https://api.covidtracking.com/v1/us/daily.json')
    let data = response.data.map(({date, positive, negative, pending, death}) => ({date: formatDate(date), positive: positive ? positive : 0, negative: negative ? negative : 0, pending: pending ? pending : 0, death: death ? death : 0}))
    function formatDate(string){
        let dateString = string.toString()
        return dateString.toString().slice(0,4) + '-' + dateString.slice(4, 6) + '-' + dateString.slice(6, 8)
    }
    if (!req.query.date) {
        res.send(data)
    } else {
        let result = data.find(({date}) => date==req.query.date)
        res.send(result)
    }
})

app.post('/sendNotification', function (req, res) {
    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
           auth: {
                user: 'covidupdatestest@gmail.com',
                pass: 'hnhggynewsglwjhr',
             },
        secure: true,
    });
    let to = req.query.destinatarios
    let msg = req.query.mensaje.toString()

    to.forEach((mail) => {
        const mailData = {
            from: 'covidupdatestest@gmail.com',
              to: mail.name, 
              text: msg
            };
            transporter.sendMail(mailData, function (err, info) {
                if(err)
                  console.log(err)
                else
                  console.log(info);
             });
    })  
})

app.use((req, res) => {
    res.send('No se encontro esta ruta')
})

app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", port);
});