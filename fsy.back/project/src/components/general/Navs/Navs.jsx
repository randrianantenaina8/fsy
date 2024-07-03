import React, {useState} from "react"
import "./navs.css"

export function Navs({children, ...props}) {
    const childrenArray = React.Children.toArray(children)
    const [current, setCurrent] = useState(childrenArray[0].key)
    const newChildren = childrenArray.map(child => {
        return React.cloneElement(child, {selected: child.key === current})
    })

    return <div className={props.className}>
        <div className="bo-navs">
            {childrenArray.map(child => (
                <button type="button"
                        title={child.props.title}
                        className={`bo-navs-item ${child.key === current ? `active` : ``}`}
                        onClick={() => setCurrent(child.key)} key={child.key} disabled={props.disabled}>
                    {child.props.label}
                </button>
            ))}
        </div>
        <div className="bo-navs-content">
            {newChildren}
        </div>
    </div>
}

export function Nav({children, selected}) {
    return <div hidden={!selected}>
        {children}
    </div>
}