const express = require('express');
const connectToMongo = require('./db');

connectToMongo(); // this will connect to MongoDB

const app = express();
const port = 5000;

//available Routes

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
