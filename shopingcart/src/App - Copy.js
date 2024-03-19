import {useState,useEffect} from 'react';
import axios from 'axios'
import Apple from './apple.jpg'
import Banana from './banana1.jpg'
import Orange from './orange.jpg'
import Grapes from './grapes1.jpg'
import { Button,ListGroup,Badge} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
export default function App(){
  let photos=[Apple,Banana,Grapes,Orange];
  let products=[
  ]
  let [item,setItem]=useState(products);
  let [cart,setCart]=useState([]);
  let [cost,setCost]=useState(0);
  let [data,setData]=useState()

  

  let url="http://localhost:1337/api/carts"

  function addCart(value,key){
   
   setCart([...cart,value]);
   let itemarr=[...item];
   --itemarr[key].instock;
   setItem(item);
   let c=value.price;
   setCost(c+cost);

  }

  let list=item.map((value,key)=>(
 
    <div id="products" onClick={()=>addCart(value,key)}>
    <img src={photos[key%4]} height="100px" width="100px"/> 
    Name:{value.name}   Instock:{value.instock}  Price:{value.price} 
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

   <h1>Products</h1>
     {list}
   <h1>Cart Items</h1>
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

   <p>Total Cost Rs ₹{cost}</p>
  
   <h1>Restock Items</h1>
   <form onSubmit={(e)=>{
    restockproducts(data);
    e.preventDefault();
   }}>
    <input type="text" value={url}></input>
    <Button type='submit'>Submit</Button>

   </form>
  
  </>
  )
}