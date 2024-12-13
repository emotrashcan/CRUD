const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost:27017/simpleAPI');


const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
});
const Item = mongoose.model('Item', ItemSchema);

// API Endpoints
app.post('/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.send(item);
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

app.get('/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.send(item);
});

app.put('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).send('Item not found');
  res.send(item);
});

app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).send('Item not found');
  res.send({ message: 'Item deleted' });
});

// Start the Server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
