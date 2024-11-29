const express = require('express');
const { resolve } = require('path');
let sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite")

const app = express();
const port = 3000;

app.use(express.static('static'));

let cors = require('cors');

app.use(cors());

let db;
(async ()=>{
  db=await open({
    filename:'./BD4/database.sqlite',
    driver:sqlite3.Database,
  });
})();

//Endpoint1

async function fetchRestaurants(){
  let query = "SELECT * FROM restaurants";
  let response = await db.all(query , [])
  return {restaurants: response}
}

app.get("/restaurants" , async(req, res) =>{
  try{
  let results = await fetchRestaurants();
  res.status(200).json(results);
  }
  catch(error){
    res.status(500).json({error: error.message})
  }

})

// //ENDPOINT 2

async function fetchRestaurantsID(id){
  let query = "SELECT * FROM restaurants WHERE id = ?"
  let response = await db.get(query,[id]);
  return {restaurants: response}
}

app.get("/restaurants/details/:id" , async(req,res) =>{
  let id = req.params.id;
  try{
    let results = await fetchRestaurantsID(id)
     if(results.restaurants.length===0){
       res.status(404).json({message: "No Restaurants found with given ID "})
     }
     return res.status(200).json(results)
  }catch(error){
    res.status(500).json({error: error.message})
  }

})

//ENDPOINT3

async function fetchByCuisine(cuisine){
  let query = "SELECT * FROM restaurants WHERE cuisine = ?"
  let response = await db.all(query , [cuisine])
  return {restaurants: response}
}
app.get("/restaurants/cuisine/:cuisine" , async(req,res) =>{
  let cuisine = req.params.cuisine;
  try{
    let results = await fetchByCuisine(cuisine)
    if(results.restaurants.length===0){
      res.status(404).json({message: "No Restaurants found with given cuisine "})
    }
    return res.status(200).json(results)
  }catch(error){
    res.status(500).json({error: error.message})
  }
})

// //ENDPOINT4

async function fetchForGivenValue(isVeg, hasOutdoorSeating,isLuxury){
let query = "SELECT* FROM restaurants WHERE isVeg=? AND hasOutdoorSeating = ? AND isLuxury = ?"
let response = await db.all(query , [isVeg,hasOutdoorSeating, isLuxury])
return {restaurants: response}
}
app.get("/restaurants/filter", async(req,res) =>{
  let isVeg = req.query.isVeg ;
  let hasOutdoorSeating = req.query.hasOutdoorSeating ;
  let isLuxury = req.query.isLuxury ;

  try{
    let results = await fetchForGivenValue(isVeg, hasOutdoorSeating,isLuxury);
    if(results.restaurants.length === 0){
      res.status(404).json({message: "No Restaurants found with given values "})
    }
    return res.status(200).json(results)

  }catch(error){
    res.status(500).json({error: error.message})
  }

})

//ENDPOINT5
async function sortByRating(){
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query,[])
  return {restaurants: response}
}
app.get("/restaurants/sort-by-rating", async(req,res) =>{
 try{
   let results = await sortByRating();
   if(results.restaurants.length===0){
    res.status(404).json({message: "No Restaurants found with given values "})
  }
  return res.status(200).json(results)
 }catch(error){
  res.status(500).json({error: error.message})
 }
})

// //ENDPOINT6
async function fetchDishes(){
  let query = "SELECT * FROM dishes"
  let response = await db.all(query,[])
  return {dishes: response}
}

app.get("/dishes", async(req,res)=>{
  try{
    let results = await fetchDishes();
    if(results.dishes.length===0){
      res.status(404).json({message: "No Dishes Found "})
    }
    return res.status(200).json(results)
  }catch(error){
    res.status(500).json({error: error.message})
  }
})

//ENDPOINT7 
async function fetchDishesID(id)
{
  let query = "SELECT*FROM dishes WHERE id=?"
  let response = await db.all(query , [id])
  return  { dishes: response }
}
app.get("/dishes/:id",async(req,res)=>{
  let id = parseFloat(req.params.id)
  try{

    let results = await fetchDishesID(id);
    if(results.dishes.length===0){
      res.status(404).json({message: "No Dishes Found with given ID "})
    }
    return res.status(200).json(results)

  }catch(error){
    res.status(500).json({error: error.message})
  }
})

// //ENDPOINT8

async function fetchIsVeg(isVeg){
  let query = "SELECT * FROM dishes WHERE isVeg=?"
  let response = await db.all(query,[isVeg])
  return {dishes: response}
}
app.get("/dishes/filter", async(req,res) =>{
  let isVeg= req.params.isVeg ;
  try{
    let results = await fetchIsVeg(isVeg)
    if(results.dishes.length===0){
      res.status(404).json({message: "No Dishes Found  "})
    }
    return res.status(200).json(results)
  }catch(error){
    res.status(500).json({error: error.message})
  }
})

// //ENDPOINT9

async function sortDishes(){
  let query = "SELECT*FROM dishes ORDER BY price"
  let response = await db.get(query,[])
  return {dishes: response}
}
app.get("/dishes/sort-by-price", async(req,res) =>{
try{
  let results = await sortDishes()
  return res.status(200).json(results)

}catch(error)
{
  res.status(500).json({error: error.message})
}
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


