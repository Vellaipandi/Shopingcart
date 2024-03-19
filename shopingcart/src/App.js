import {useState,useEffect} from 'react';
import axios from 'axios'
import Apple from './apple.jpg'
import Banana from './banana1.jpg'
import Orange from './orange.jpg'
import Grapes from './grapes1.jpg'
import { Button,ListGroup,Badge,Form} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
export default function App(){
  let [photos,setPhotos]=useState([Apple,Banana,Grapes,Orange]);
  let products=[
  ]
  let [item,setItem]=useState(products);
  let [cart,setCart]=useState([]);
  let [cost,setCost]=useState(0);
  let [data,setData]=useState()
  let[fruit,setFruit]=useState();
  let[country,setCountry]=useState();
  let[instock,setInstock]=useState();
  let[price,setPrice]=useState();
  let[FruitId,setFruitId]=useState();


  

  let url="http://localhost:1337/api/carts"

  function addCart(value,key){
   setCart([...cart,value]);
   let itemarr=[...item];
   --itemarr[key].instock;
   setItem(item);
   let c=value.price;
   setCost(c+cost);

  }
  const handleDelete=async(id,index)=>{
    
    alert('Data Deleted SucessFully');
    await axios.delete(`http://localhost:1337/api/carts/${id}`);
    let img=[...photos]
    img.splice(index,1);
    setPhotos(img);
    let DeleteArray=[...item];
    DeleteArray.splice(index,1);
    setItem(DeleteArray);
    
  
     }
  function handleSubmit(e){
    e.preventDefault();
    axios.post('http://localhost:1337/api/carts',{"data":{"name":fruit,"instock":instock,"price":price,"country":country}});
    let addArr=[...item,{name:fruit,instock:instock,price:price,country:country}];
    setItem(addArr);
    alert("Data created Sucessfully");

  }
  const handleUpdate=async(e)=>{
    e.preventDefault();
   
   await axios.put(`http://localhost:1337/api/carts/${FruitId}`,{"data":{"instock":instock,"price":price,"country":country}});
   
    alert("Data updated Sucessfully");
  }

  let list=item.map((value,key)=>(
 
   
    <div id="products" className="grid" >
     <div>
      <img  src={photos[key%4]} height="150px" width="150px"/>
      </div>
     <br></br>
     
    <div>
    <p>Name:{value.name} </p>   <p>Instock:{value.instock}</p>  <p>Price:{value.price} </p>
     <Button onClick={()=>addCart(value,key)}>Add to Cart</Button> 
     <Button variant='danger' onClick={()=>handleDelete(value.id,key)}>Delete</Button>
    </div>
     
     </div>
   
 

   
  ));
  useEffect(()=>{
    async function fetchdata(){
      let res=await axios(url)
      let result=res.data;
      setData(result);
    }
    fetchdata();
  },[url])
   let id;
  const restockproducts=(data)=>{
    let newItems=data.data.map((item)=>{
      id=item.id;
      let {name,country,instock,price}=item.attributes;
      return{id,name,country,instock,price};
    });
    
    setItem([...item,...newItems])
  }
 
 
  
  return(<>
  <div>
  <h1 id="title">Shopping Cart App</h1>
  <a href="#add"><Button>ADD NEW ITEM</Button></a> <a href="#update"><Button>UPDATE</Button></a>
  </div>
  
   <h3>Products</h3><hr></hr>
     {list}
   <h3>Cart Items</h3><hr></hr>
   {cart.map((item,k)=>(
    <ListGroup >
    <ListGroup.Item
      as="li"
      className="d-flex justify-content-between align-items-start"
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">Name:{item.name}</div>
        
      </div>

      <Badge bg="primary" pill>
       Price: {item.price}
      </Badge>

    </ListGroup.Item>
    
  </ListGroup>

   ))}

   <h2>Total Cost Rs ₹{cost}</h2>
  
   <h3>Restock Items</h3><hr></hr>
   <form onSubmit={(e)=>{
    restockproducts(data);
    e.preventDefault();
   }}>
    <input type="text" value={url}></input>
    <Button type='submit'>Submit</Button>
   </form>
   <div id="add" >
   <h2 style={{textAlign:"center"}}>Create data</h2>  
   <Form  className="form" onSubmit={handleSubmit}  >
    <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label id="label" >Fruit Name:</Form.Label>
        <Form.Control type="text" id="input"  onChange={(e)=>{setFruit(e.target.value)}}  />
        <Form.Label id="label" >Country</Form.Label>
        <Form.Control type="text" id="input"  onChange={(e)=>{setCountry(e.target.value)}}  />
        <Form.Label id="label" >Instock:</Form.Label>
        <Form.Control type="number" id="input"  onChange={(e)=>{setInstock(e.target.value)}}/>
        <Form.Label id="label" >Price:</Form.Label>
        <Form.Control type="number" id="input"  onChange={(e)=>{setPrice(e.target.value)}}/>
      <Button type="submit" id="submitbtn" variant="danger" >Add</Button>
      
      </Form.Group>
   </Form>
   </div>
<hr></hr>
   <div id="update">
    <h2 style={{textAlign:"center"}}>Update data</h2>
    <Form  className="form" onSubmit={handleUpdate}  >
       <Form.Group className="mb-3" controlId="formBasicEmail">
       <Form.Label id="label" >Fruit Id:</Form.Label>
        <Form.Control type="number" id="input"  onChange={(e)=>{setFruitId(e.target.value)}}/>
        <Form.Label id="label" >Country</Form.Label>
        <Form.Control type="text" id="input"  onChange={(e)=>{setCountry(e.target.value)}}  />
        <Form.Label id="label" >Instock:</Form.Label>
        <Form.Control type="number" id="input"  onChange={(e)=>{setInstock(e.target.value)}}/>
        <Form.Label id="label" >Price:</Form.Label>
        <Form.Control type="number" id="input"  onChange={(e)=>{setPrice(e.target.value)}}/>
      <Button type="submit" id="submitbtn" variant="danger" >Update</Button>
     
      </Form.Group>
   </Form>
   </div>
  
  </>
  )
}