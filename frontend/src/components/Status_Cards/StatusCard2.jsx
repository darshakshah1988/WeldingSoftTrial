import React from 'react'

import './statuscard.css'

const StatusCard2 = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
             
                <p>Actual Current: <h1> <b>{props.alternateCurrent}</b></h1></p>
               
                
                
            </div>

        </div>
    )
}

export default StatusCard2
