const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://Aarthis09:Aarthi1234@cluster0.kexotzh.mongodb.net/PhotoManagementApp?retryWrites=true&w=majority&appName=Cluster00', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Could not connect to MongoDB', error));


const photoSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String, 
  createdAt: { type: Date, default: Date.now },
});

const Photo = mongoose.model('Photo', photoSchema);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).send('No file uploaded.');

    // Convert file to base64
    const imageUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    const newPhoto = new Photo({ title, description, imageUrl });
    await newPhoto.save();

    res.status(201).send(newPhoto);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

app.get('/photos', async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).send(photos);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

app.get('/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).send('Photo not found');
    res.status(200).send(photo);
  } catch (error) {
    res.status(500).send('Server Error: ' + error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
