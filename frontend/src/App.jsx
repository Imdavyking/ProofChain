import { useState } from "react";
import "./App.css";
import Router from "./router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
