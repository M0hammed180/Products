import { createSlice } from "@reduxjs/toolkit";
import clothes from "../../public/photos/clothes.jpg";
import electronics from "../../public/photos/electronics.jpg";
import shoes from "../../public/photos/shoes.jpg";

const StoredPage = {
  search: "",
  searchOrder: true,
  categorys: [
    {
      id: "clothes",
      title: "ملابس",
      image: clothes,
    },
    {
      id: "electronics",
      title: "اجهزة",
      image: electronics,
    },
    {
      id: "shoes",
      title: "أحذية",
      image: shoes,
    },
  ],
  category: "",
  cartProductIds: [],
  favouritesProductIds: [],
  cartCount: 0,
};

const PageSlice = createSlice({
  name: "Search",
  initialState: StoredPage,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCategoty: (state, action) => {
      state.category = action.payload;
    },
    setSearchOrder: (state, action) => {
      state.searchOrder = action.payload;
    },
    setCartProductIds: (state, action) => {
      state.cartProductIds = action.payload;
    },
    setFavouritesProductIds: (state, action) => {
      state.favouritesProductIds = action.payload;
    },
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
  },
});

export const {
  setSearch,
  setCategoty,
  setSearchOrder,
  setCartProductIds,
  setCartCount,
  setFavouritesProductIds,
} = PageSlice.actions;
export default PageSlice.reducer;
