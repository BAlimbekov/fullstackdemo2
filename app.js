const { json } = require('express');
const express = require('express');
const app = express();
const port = 3030;
const {Client} = require('pg');
const connectionString = 'postgresql://postgres:docker@127.0.0.1:5432/phones_db';
const client = new Client({
    connectionString:connectionString
});

client.connect();
app.use(express.json());

app.get('/', (req, res)=> {
    res.status(200).send("Hello World")
})

app.get('/phones', (req, res) => {
    client.query('SELECT * FROM phones')
    .then((result) => {
        res.status(200).send(result.rows)
    })
    .catch((err)=> console.error(err.stack))
});

app.get('/api/phones/:id', (req, res) => {
    const id = req.params.id;
    client.query(`SELECT * FROM phones WHERE id=${id}`)
    .then((result) => {
        res.status(200).send(result.rows)
    })
    .catch((err)=> console.error(err.stack))
});

app.post('/api/phones', (req, res) => {
    const phone = req.body;
    const brand = phone.brand;
    const price = phone.price;
    client.query(`INSERT INTO phones (brand, price) VALUES ('samsung', 800)`)
    .then((result)=> {
        res.status(200).send(result.rows)
    })
    .catch((err)=> console.error(err.stack))
})

app.delete('/api/phones/:id', (req, res)=>{
    const phone = req.body;
    const brand = phone.brand;
    const price = phone.price;
    const id = req.params.id;
    client.query(`DELETE FROM phones WHERE id=${id}`)
    .then((result)=> {
        res.status(200).send('item was deleted')
    })
    .catch((err)=> console.error(err.stack))
    
});


app.patch('/api/phones/:id', (req, res)=>{
    const phone = req.body;
    const brand = phone.brand;
    const price = phone.price;
    const id = req.params.id;

    client.query(`UPDATE phones SET brand ='${brand}' WHERE id=${id}`)
    .then((result)=> {
        res.status(200).send("patched")
    })
    .catch((err)=> console.error(err.stack))
});


app.listen(port)