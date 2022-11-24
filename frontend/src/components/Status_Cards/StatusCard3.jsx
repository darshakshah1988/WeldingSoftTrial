import React from 'react'

import './statuscard.css'

const StatusCard3 = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
            <p>Weld Pressure 1:<h1><b>{props.weldingPressure1}</b> </h1></p>
                
               
                
            </div>

        </div>
    )
}

export default StatusCard3
