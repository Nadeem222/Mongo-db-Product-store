import express from 'express';
import path from 'path';
// import cors from 'cors'
import mongoose from 'mongoose';
import { stringify } from 'querystring';

let productSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: Number,
  category: String,
  description: String,
  createdOn: {type: Date, default:Date.now}
});
const productModel = mongoose.model('products', productSchema);






const app = express()
app.use(express.json())


const port = process.env.PORT || 5001;

app.post("/product", () => {

  const body = req.body;
  if(
    !body.name ||
    !body.price ||
    !body.category ||
    !body.description
  ) {
    res.status(400).send(` required parameter missing. example request body:
    {
      "name": "value",
      "price": "value",
      "category": "value"
      "description": "value"
    }`)
    return;
  }
   newProduct = productModel.create({
    name: body.name,
    price: body.price,
    category: body.category,
    description : body.descriptionk

  },
      (err,saved) => {
        if(!err) {
          console.log(saved);

          res.send({
            message: "your product is saved"
          })
        }else{
          res.status(500).send({
            message: "server error"
          })
        }
      })

})

app.get('/products', (req, res) => {

  productModel.find({}, (err , data)=> {
    if(!err) {
      res.send({
        message: "here is your product",
        data: data
      })
    }else{
      res.status(500).send({
        message:"error"
      })
    }
  });
})

app.get('/product/:id', (req, res) => {

  const id = req.params.id;

  productModel.findOne({_id: id}, (err , data)=> {
    if(!err) {

      if(data) {
        res.send({
          message: "here is your product",
          data: data
        })
      } else {
        res.status(404).send({
          message:"product not found",
        })
      }
    }else{
      res.status(500).send({
        message:"server error"
      })
    }
  });
})

app.put('/product/:id', async ( req, res) => {

  const body = req.body;
  const id = req.params.id;

  if(
    !body.name ||
    !body.price ||
    !body.category ||
    !body.description
  ) {
    res.status(400).send(` required parameter missing. example request body:
    {
      "name": "value",
      "price": "value",
      "category": "value"
      "description": "value"
    }`)
    return;
  }

  try{
    let data = await productModel.findByIdAndUpdate(
        id,
        {
          name: body.text,
          price: body.price,
          category: body.category,
          description: body.description
        },
        {new: true}
      )
      .exec();

      console.log('updated: ', data);

      res.send({
        message: "product is updated successsfully",
        data:data
      })
  } catch (error) {
    res.status(500).send({
      message:"server error"
    })
  }
})

app.delete('/products', (req , res) => {

  productModel.deleteMany({}, (err,data)  => {
    if(!err) {
      res.send({
        message: "all products has been deleted successfully",
      })
    }else {
      res.status(500).send({
        message:"server error"
      })
    }
  });
})

app.delete('/product/:id', (req, res)  =>{

  const id = req.params.id;

    productModel.deleteOne({_id: id}, (err, deletedData)  => {

      console.log ("deleted: ", deletedData);
      if(!err) {
        if (deletedData.deletedCount !== 0){
          res.send ({
            message: "product has been deleted successfully",
          })
        }else {
          res.send({
            message: "No product found with this id:" +id,
          })
        }
      }else{
        res.status(500).send({
          message: "server error"
        });
      }
    })
})




const _dirname = path.resolve();

app.get('/' , express.static(path.join(_dirname, "web")));
app.use('/' , express.static(path.join(_dirname, "web")));
// app.use('*' , express.static(path.join(_dirname, "web")));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let mongodbUri = 'mongodb+srv://dbuser:snadeema@cluster0.intzdzn.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(mongodbUri);

mongoose.connection.on('connected' , function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected' , function (){
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on('error' , function (err){
  console.log('Mongoose connection error:', err);
  process.exit(1);
})

process.on('SIGINT' , function (){
  console.log ("app is terminatiing");
  mongoose.connection.close(function () {
    conloge.log('Mongoose default connection closed');
    process.exit(0);
  })
})

