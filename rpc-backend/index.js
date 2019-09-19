const app = require('express')();
const cors = require('cors')
const API = require('./api/index');
const PORT = 3001;

app.use('/api', API);
app.use(cors());

app.get('/', (req, res) => {
  res.send('RPC Dialer API');
})

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
})