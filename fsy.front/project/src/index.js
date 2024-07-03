import React from "react"
import ReactDOM from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import App from "./App"
import Helper from "./services/Helper"
import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import "./web/style/index.css"
import "./web/style/colors.css"

const root = ReactDOM.createRoot(document.getElementById("root"))

function Root() {
    return <BrowserRouter>
            <App/>
    </BrowserRouter>
}

/* ============================== Main Code ============================== */
root.render(<Root></Root>)

initializeTranslation()
initLocalStorage()

/* ============================== Other Functions ============================== */

function initLocalStorage() {
    // code here
}

function initializeTranslation() {
    // TODO: récupérer la langue de l'utilisateur, FR sinon.
    //  + Créer un composant langSwitcher qui s'occupera de charger dynamiquement les fichiers de langue
    //  + Stocker la traduction pour éviter de la recharger à chaque rendu ?
    (async function () {
        const translations = await Helper.getLocalTranslations("FR")

        await i18n.use(LanguageDetector)
            .use(initReactI18next)
            .init({
                resources: {
                    fr: {
                        translation: translations.FR
                    },
                    en: {
                        translation: translations.EN
                    }
                },
                fallbackLng: "fr"
            })
    })()
}