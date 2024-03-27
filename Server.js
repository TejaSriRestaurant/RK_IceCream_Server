const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');


const app = express();

app.use(cors());
app.use(bodyparser.json());

// let data = [];

// temp db
const { insertOrCreate, getData , removeData, clearAllData, StoreProducts, getorders , updateAcceptedStatus, delivarDataByIP } = require('./DbHand.js');


const port = 3001;

// Define a route
app.post('/insertintocart', (req, res) => {
  const body = req.body;
  console.log(body);
  // data.push(body.item);
  insertOrCreate(body.ip, body.item);
  res.send("Success");
});

app.put('/getcart', async (req, res) => {
        const data = await getData(req.body.ip);
        res.json(data); // Send the data as JSON response
});

app.post('/placeorder', (req, res) => {
  let resp = req.body;
  console.log(resp.item);
  clearAllData(req.body.ip);
  StoreProducts(req.body.ip,resp);
  res.send("success");
});

app.post('/deleteintocart', (req, res) => {
  const body = req.body;
  removeData(body.ip,body.item)
  res.send("Success");
});

app.get('/admindata', async (req, res) => {
  res.send(await getorders());
});

app.put('/adminaccept', async (req, res) => {
  res.send(await updateAcceptedStatus(req.body.ip));
});

app.put('/admindelivar', async (req, res) => {
  await delivarDataByIP(req.body.ip);
  res.send( "ok");
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

