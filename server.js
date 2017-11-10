const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(process.env.PORT, process.env.IP, () => console.log('Starts at ' + process.env.IP + ':' + process.env.PORT))

// app.listen(8080, "0.0.0.0");
// console.log('Starts at 0.0.0.0:8080');
