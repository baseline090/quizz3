const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); 

const app = express();
require('dotenv').config();

// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//base Rotes for message 
app.get('/',(req,res)=>{
    res.status(200).json({ msg:"Basepath",code:200})
})

// Routes
app.use('/api', authRoutes); 



app.get('/api/admin/dashboard', (req, res) => {
    res.json({
        message: 'Welcome to the Admin Dashboard!',
        user: req.user 
    });
});


app.use(express.static('public'));



// Server listening on PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
