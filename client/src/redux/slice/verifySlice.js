import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  userList: [
    {
      email: "rahulkarande1695@gmail.com",
      password: "12345678",
    },
    {
      email: "swapnilkarande@gmail.com",
      password: "12345678",
    },
    {
      email: "rupalikarande@gmail.com",
      password: "12345678",
    },
  ],
  verified: {
    email: "",
    password: "",
  },
};
const verifyEmail = createSlice({
  name: "email",
  initialState,
  reducers: {
    setVerify(data, action) {
      for (const user of data.userList) {
        if (
          user.email === action.payload.email &&
          user.password === action.payload.password
        ) {
          data.verified = {
            ...data.verified,
            email: action.payload.email,
            password: action.payload.password,
          };
        }
      }
      data.verified = {
        ...data.verified,
        email: action.payload.email,
        password: action.payload.password,
      };
    },
  },
});
export const { setVerify } = verifyEmail.actions;
export default verifyEmail.reducer;
