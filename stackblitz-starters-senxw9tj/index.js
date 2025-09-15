const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true }
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);


app.post('/menu', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ message: "Name and Price are required." });
  }

  const item = new MenuItem({ name, description, price });
  item.save()
    .then(savedItem => {
      res.status(201).json({ message: "Item added successfully", item: savedItem });
    })
    .catch(err => {
      res.status(500).json({ message: "Error adding item", error: err.message });
    });
});

app.get('/menu', (req, res) => {
  MenuItem.find()
    .then(items => {
      res.json(items);
    })
    .catch(err => {
      res.status(500).json({ message: "Error fetching items", error: err.message });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));