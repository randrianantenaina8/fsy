import React, {useState, useEffect} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {createPortal} from "react-dom"

import "./modal.css"

const Modal = ({isShowing, hide, title, confirm, saveBeforeClose, closeButtonRef, ...props}) => {
    const confirmClose = confirm === true
    const attributes = {}
    let [displayConfirm, setDisplayConfirm] = useState(false)
    let [closing, setClosing] = useState(false)

    const confirmOnClose = () => {
        if (confirmClose) {
            setDisplayConfirm(true)
        } else {
            setClosing(true)
            setTimeout(() => {
                hide()
                setClosing(false)
            }, 150)
        }
    }

    const closeModal = () => {
        setClosing(true)
        setTimeout(() => {
            hide()
            setClosing(false)
            setDisplayConfirm(false)
        }, 150)
    }

    const saveOnClose = () => {
        saveBeforeClose()
        setDisplayConfirm(false)
    }

    const _handleKeyDown = e => {
        if (e.key === "Escape") {
            confirmOnClose()
        }
    }

    useEffect(() => {
        if (isShowing) {
            document.addEventListener("keydown", _handleKeyDown)
            return function () {
                document.removeEventListener("keydown", _handleKeyDown)
            }
        }
    })

    if (closing) {
        attributes.hidden = true
        attributes["aria-hidden"] = "true"
    }

    return isShowing ?
        createPortal(<>
                <section className="modal-wrapper" {...attributes}>
                    <div className="modal-overlay"/>
                    <div className="modal">
                        <div className="modal-header">
                            <h4>{title}</h4>
                            {!displayConfirm &&
                                <button type="button" className="btn alert modal-close-button" title="Fermer" ref={closeButtonRef}
                                        onClick={confirmOnClose}>
                                    <FontAwesomeIcon icon="fas fa-circle-xmark"/>
                                </button>
                            }
                        </div>
                        <div className="modal-body">
                            <div className={!displayConfirm ? "" : "hidden"}>
                                {props.children}
                            </div>
                            {displayConfirm &&
                                <div className="flex flex-column center modal-close-confirm">
                                    <b>Vous avez apporté des modifications.</b><br/>
                                    Souhaitez-vous les enregistrer avant de continuer ?
                                    <div className="modal-footer flex">
                                        <button className="btn success" onClick={saveOnClose}>Oui</button>
                                        <button className="btn alert" onClick={closeModal}>Non</button>
                                        <button className="btn" onClick={e => setDisplayConfirm(false)}>Annuler</button>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </section>
            </>,
            document.body
        ) : null
}

export default Modal