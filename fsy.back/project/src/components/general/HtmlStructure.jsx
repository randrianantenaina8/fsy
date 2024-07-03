import React, { useState } from "react"
import Menu from "./Menu/Menu"
import "react-toastify/dist/ReactToastify.css"
import {ToastContainer} from "react-toastify"
import {Api, Session} from "fsy.common-library"
import Helper from "../../services/Helper"

export default function HtmlStructure({children, menuName, sectionClassName, auth = null}) {
    let authorized = auth===null ? false : (auth==='all' ? true : null);
    if(!Session.getAuth()){
        const userSession = Session.getSessionUser();
        Api.user.getUserAccess(userSession.id)
            .then(response => {
                const resultObject = Helper.isValidResponse(response)
                Session.setAuth(resultObject)
                authorized = authorized===null ? Session.getAuth(auth) : authorized
                setLoaded(true)
            })
    }else{
        authorized = authorized===null ? Session.getAuth(auth) : authorized
    }
    const [loaded, setLoaded] = useState(authorized!==null);

    return <>
        {loaded &&
            <>
                <Menu nameMenu={menuName}/>
                <section className={`content ${sectionClassName}`}>
                    {authorized && <>{children}</>}
                    {authorized === false &&
                        <article className="error-access">
                            <section className="card">
                                <h1>Vous n'avez pas le droit d'accéder à cette page</h1>
                            </section>
                        </article>
                    }
                    {authorized === null &&
                        <article className="error-access">
                            <section className="card">
                                <h1>Chargement...</h1>
                            </section>
                        </article>
                    }
                </section>
                <ToastContainer/>
            </>
        }
    </>
}
