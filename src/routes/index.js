const express = require('express');
const { pool } = require('mssql');
const router = express.Router();
const sql = require('mssql');

const config = {
    user: 'orlando',
    password: 'orlando',
    server: 'localhost',
    database: 'prueba',
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
      }
}

async function getConnection(){
    try {
        const pool = await sql.connect(config)
        // const result = await pool.request().query('SELECT 1');
        // console.log(result);
        return pool;
    } catch (error) {
        console.log(error)
    }
    
}

    router

.get('/', async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM Products');
    const products = result.recordset;
    res.render('index', {
        products
    })
})

.get('/products/:id', async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM Products WHERE id = ${req.params.id}`);
    const productByID = result.recordset;
    console.log(productByID);

    res.render('product', {
        productByID
    })
})

.get('/products', async (req, res) => {
    res.render('addproduct');
})

.post('/products', async (req, res) => {
    const {name, description, quantity} = req.body;
    const consulta = `INSERT INTO Products (name, description, quantity) VALUES ('${name}', '${description}', '${quantity}')`
    
    const pool = await getConnection();
    const result = await pool.request().query(consulta);
    console.log('Success: '+ result);

    res.redirect('/');
})

.delete('/delete/:id', async (req, res) => {
    const pool = await getConnection();
    const result = await pool.request().query(`
        DELETE FROM Products WHERE id = ${req.params.id}
    `);
    console.log('Eliminado');
    res.redirect('/');

})

.put('/update/:id', async (req, res) => {
    let {name, description, quantity} = req.body;

    const pool = await getConnection();
    const result = await pool.request().query(`
        UPDATE Products SET name = 
        '${name}', description = '${description}', quantity = '${quantity}'
        WHERE id = '${req.params.id}'
    `);

    res.redirect('/');
})

module.exports = router;