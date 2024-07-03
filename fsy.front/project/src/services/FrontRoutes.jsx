import {Routes, Route} from "react-router-dom"
import HomePage from "../components/home/HomePage"
import GameHomePage from "../components/game/GameHomePage"
import LoginPage from "../components/login/LoginPage"
import ParametersPage from "../components/parameters/ParametersPage"
import ActivationPage from "../components/login/ActivationPage"

function FrontRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/activate" element={<ActivationPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/game" element={<GameHomePage/>}/>
                <Route path="/parameters" element={<ParametersPage/>}/>
            </Routes>
        </>
    )
}

export default FrontRoutes
