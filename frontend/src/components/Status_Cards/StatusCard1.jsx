import React from 'react'

import './statuscard.css'

const StatusCard1 = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
                
                <p>Weld Count:<h1>{props.weldingCount} </h1></p>
               
               
              
               
               
                
            </div>

        </div>
    )
}

export default StatusCard1
