import PropTypes from 'prop-types'
import React from 'react'
import styles from './Logo.css'

const Logo = (props) => {
  return (
    <div className={`${styles.container} ${props.className}`}>
       <p style={{ margin: "0px",  fontSize: "15px"}}>Powered by</p>
       <img style={{margin: "auto", display: "block", maxWidth: "100%"}} src="/assets/mcbot-karaoke-logo.png"></img>
    </div>
  )
}

Logo.propTypes = {
  className: PropTypes.string,
}

export default Logo
