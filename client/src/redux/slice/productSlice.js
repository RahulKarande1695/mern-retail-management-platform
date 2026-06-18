import { createSlice } from "@reduxjs/toolkit";
import amulTaza from "../../amulTaza.png";
import gokulMilk from "../../gokulMilk.png";
import shimlaApple from "../../shimlaApple.png";
const initialState = [
    {
      id: "102",
      name: "Amul Taaza",
      packSize: "500 ML",
      category: "Milk",
      mrp: "RS 27",
      image: amulTaza,
      status: "active",
    },
    {
      id: "103",
      name: "Gokul Milk",
      packSize: "500 ML",
      category: "Milk",
      mrp: "RS 27",
      image: gokulMilk,
      status: "inactive",
    },
    {
      id: "104",
      name: "Shimla Apple",
      packSize: "1 kg",
      category: "Fruits",
      mrp: "RS 150",
      image: shimlaApple,
      status: "active",
    },
  ];
const productData = createSlice({
name:"product",
initialState,
reducers:{
    setProduct(state,action){
      const filtered = initialState.filter(item =>
        item.name.toLowerCase().includes(action?.payload)
      );
      return state = [...filtered];
    },
    setDelete(state,action){
      const data = [...state]
      const filtered = data.filter(item => item.id !== action?.payload);
      return state = [...filtered];
    },
    setAdd(state,action){
      
    }
}
})
export const {setProduct,setDelete,setAdd} = productData.actions;
export default productData.reducer