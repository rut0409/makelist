const express = require("express");
const bodyParser = require("body-parser");
//const date= require(__dirname+"/date.js");
const mongoose=require("mongoose");

const hostnamr="0.0.0.0";

const app=express();

const howtouse="Welcome to your todolist! /n Welcome to your todolist!/n Welcome to your todolist!";

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const items=["Buy Food","Cook Food","Eat Food"];
//const workItems=[];
mongoose.connect("mongodb+srv://mallilanka:malli@01@cluster0.nsjwh.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});

const itemsSchema={
  name:String
};
const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name: "Welcome to your todolist!"
});

const defaultItems=[item1];




app.get("/",function(req,res){

  Item.find({},function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully saved to DB!");
        }
        });
        res.redirect("/");

    }
    else{
      res.render("list",{listTitle: "Today", newListItems: foundItems});
    }

  });

});

app.post("/" ,function(req,res){
  const itemName=req.body.newItem;

  const item= new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");


});

app.post("/delete",function(req,res){
  const checkedItem=req.body.checkbox;
  Item.findByIdAndRemove(checkedItem,function(err){
    if(!err){
      console.log("successfully deleted");
      res.redirect("/");
    }
  })
});

app.get("/how-to-use",function(req,res){
  res.render("how-to-use");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server started on port 3000")
});
