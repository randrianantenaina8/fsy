import {CircularProgress} from "@mui/material"

import "./loading.css"

export function LoadingOverlay() {
    return <div className="loading-overlay">
        <div className="overlay-content">
            <CircularProgress color="success"/>
            <div>Chargement</div>
        </div>

        <div className="overlay-brand">
            <img src="/img/Nextaura2.png" alt="Nextaura brand logo"/>
        </div>
    </div>
}


export function Loading(props) {
    return <div className={"loading " + props.className ?? ""}>
        <div className="loading-content">
            <CircularProgress color="success"/>
        </div>
    </div>
}