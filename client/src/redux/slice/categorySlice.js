import { createSlice } from "@reduxjs/toolkit";

const api = [
  {
    id: 102,
    name: "Milk",
    description: " Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    status: "active",
  },
  {
    id: 103,
    name: "Fruits",
    description: " Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    status: "active",
  },
  {
    id: 104,
    name: "Vegetables",
    description: " Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    status: "inactive",
  },
];

const initialState = {
  truth: api,
  replica: JSON.parse(JSON.stringify(api)),
};

const categoryData = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.truth = state?.replica.filter((item) =>
        item.name.toLowerCase().includes(action.payload)
      );
    },
    setDelete(state, action) {
      let response = state.truth.filter((item) => item.id !== action.payload);
      state.truth = response;
      state.replica = JSON.parse(JSON.stringify(response));
    },
    setAdd(state, action) {
      const newId = state.truth[state.truth.length - 1].id + 1;
      const response = [
        ...state.truth,
        {
          id: newId,
          name: action.payload.categoryName,
          description: action.payload.description,
          status: action.payload.status,
        },
      ];
      state.truth = response;
      state.replica = JSON.parse(JSON.stringify(response));
    },
    setSort(state, action) {
      const response = action.payload;
      state.truth = response;
      state.replica = JSON.parse(JSON.stringify(response));
    },
  },
});

export const { setCategory, setDelete, setAdd, setSort } = categoryData.actions;
export default categoryData.reducer;
