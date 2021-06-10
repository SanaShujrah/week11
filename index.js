const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const Bookmodel= require('./models/Books.model')

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://sana:abc1234@cluster0.n6b1z.mongodb.net/Test2?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => { console.log('database connected ') }).catch((err) => { console.log('database error: ', err) })

app.post("/insert",async (req,res)=>{  //async is used as a promise and will return either ture or false
    const title = req.body.title;
    const isbn = req.body.isbn;
    const pageCount = req.body.pageCount;
    const shortDescription = req.body.shortDescription;

            //this is from the DB collection  //and the other one is the one we are reciveing  
    const book = new Bookmodel({ title: title, isbn: isbn, pageCount: pageCount, shortDescription: shortDescription });
    try {
        await book.save();
        console.log('book added to db')
    } catch (err) {
        console.log(err);
    }
})


app.get("/read",async (req,res)=>{
    Bookmodel.find({}, (err, result) => {
        if (err) res.send(err);  

        res.send(result);  //fetching all the records from DB and sending it to the frontend
    });
})


app.put("/update",async (req,res)=>{

    const newtitle = req.body.newtitle;
    const id = req.body.id;

    try {
        await Bookmodel.findById(id, (err, updatedtitle) => {
            updatedtitle.title = newtitle;
            updatedtitle.save();
            res.send('Updated.')
        })
    } catch (err) {
        
        console.log(err);
    }

})


app.delete("/delete/:id",async (req,res)=>{

    const id = req.params.id;

    await Bookmodel.findByIdAndRemove(id).exec();
    res.send('Deleted.');
    console.log('book deleted from db')

})

app.listen(3001,() =>{ console.log('server is running at port 3001')});