import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import './loading.css'


export function LoadingOverlay(){
    return <div className="loading-overlay">
        <div className="overlay-content">
            <FontAwesomeIcon icon="fas fa-gear loading-icon" spin/>
            <div>Chargement</div>
        </div>

        <div className="overlay-brand">
            <img src="/img/Nextaura2.png" alt="Nextaura brand logo"/>
        </div>
    </div>
}


export function Loading(){
    return <div className="loading">
        <div className="loading-content">
            <FontAwesomeIcon icon="fas fa-gear loading-icon" spin/>
        </div>
    </div>
}