import React from 'react'
import classes from './Spinner.module.css'

const Spinner = () => {
  return (
    <div className={classes.spinnerContainer}>
        <div className={classes.spinnerGradient}>
            <div className={classes.spinnerBlocker}></div>
            <div className={classes.spinnerRoundHead}></div>
        </div>
    </div>
  )
}

export default Spinner