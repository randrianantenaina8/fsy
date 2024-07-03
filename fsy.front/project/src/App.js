import FrontRoutes from "./services/FrontRoutes"

/* ----- FontAwesome icons import ----- */
import {library} from "@fortawesome/fontawesome-svg-core"
import {fas} from "@fortawesome/free-solid-svg-icons"
import {far} from "@fortawesome/free-regular-svg-icons"
import {fab} from "@fortawesome/free-brands-svg-icons"
import LoginOrUser from "./components/login/LoginOrUser"
import {Session} from "fsy.common-library"
import {useAjax} from "./hooks/customHooks"

library.add(fas, far, fab)

function App() {
    const userSession = Session.getUser()
    const url = Session.isLoggedIn() ? `/user/${userSession.id}` : ""
    // eslint-disable-next-line no-unused-vars
    const [loading, user] = useAjax(url)
    return (
        <>
            <header className="header">
                <LoginOrUser isLogged={Session.isLoggedIn()} user={user}/>
            </header>
            <section className="content">
                <FrontRoutes/>
            </section>
            <footer className="footer">
                <div className="enterprise-logo">
                    <img src="/img/FSY-logo.jpg" alt="Fransylva logo"/>
                </div>
                <div className="footer-version">Version {process.env.REACT_APP_VERSION}</div>
            </footer>
        </>
    )
}

(function () {
    // Add event listener
    document.addEventListener("mousemove", parallax)
    const elem = document.querySelector("#parallax")

    // Magic happens here
    function parallax(e) {
        let _w = window.innerWidth / 2
        let _h = window.innerHeight / 2
        let _mouseX = e.clientX
        let _mouseY = e.clientY
        let _depth1 = `${50 - (_mouseX - _w) * 0.0}% ${50 - (_mouseY - _h) * 0.0}%`
        let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`
        let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`
        let x = `${_depth3}, ${_depth2}, ${_depth1}`
        console.log(x)
        elem.style.backgroundPosition = x
    }
})()

export default App
