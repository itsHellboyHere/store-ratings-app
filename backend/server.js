const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 5000;
const path = require('path');
console.log(__dirname)
const staticPath = path.join(__dirname, "../frontend/store-app/build");
console.log("Serving static files from:", staticPath);
// cors
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://store-ratings-app.onrender.com']

}));
// middleware to parse to JSONs
app.use(express.json());

// Routes

console.log(__dirname)



app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/users', require("./routes/userRoutes"))
app.use('/api/admin/', require("./routes/adminDashboardRoutes"))
app.use('/api/stores', require("./routes/storeRoutes"))

app.use(express.static(staticPath));

app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
})

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})