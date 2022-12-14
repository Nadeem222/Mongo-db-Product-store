import express from 'express';
import path from 'path';

const app = express()
const port = process.env.PORT || 5001;

app.get('/water', (req, res) => {
    console.log(`${req.ip} is asking for water`)
  res.send('Hello World!')
})

const _dirname = path.resolve();

app.use('/' , express.static(path.join(_dirname, "web")));
app.use('*' , express.static(path.join(_dirname, "web")));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})