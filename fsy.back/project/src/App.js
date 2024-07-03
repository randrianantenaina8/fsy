import AppRoutes from "./services/AppRoutes"

/* ----- FontAwesome icons import ----- */
import {library} from "@fortawesome/fontawesome-svg-core"
import {fas} from "@fortawesome/free-solid-svg-icons"
import {far} from "@fortawesome/free-regular-svg-icons"
import {fab} from "@fortawesome/free-brands-svg-icons"

library.add(fas, far, fab)

function App() {
    // const [loading, user] = useAjax("/user")
    return <section className="container">
            <AppRoutes/>
        </section>
}

export default App
