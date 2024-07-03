import React from "react"
import ReactDOM from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import App from "./App"
import "./web/style/index.css"
import "./web/style/colors.css"
import "react-toastify/dist/ReactToastify.css"


/* ============================== Main Code ============================== */

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
)

/* ============================== Other Functions ============================== */
