import React from 'react'

import './statuscard.css'

const dashBoardCard = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info">
               
                <p>Welding Count:<h1>{props.weldingCount}</h1></p>
               
                <p>Error Count:<h1> {props.errorCount}</h1></p>
              
               
               
                
            </div>

            
            

        </div>
    )
}

export default dashBoardCard
