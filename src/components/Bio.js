import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import profilePic from './profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={`Billy Kaplan`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        <p>
          Coopted by <strong>Billy</strong> who lives and works from
          a rented Hyundai Sonata building less than useful things.{' '}
          <a href="https://github.com/billy1kaplan">
    	  	Checkout my github!
          </a>
        </p>
      </div>
    )
  }
}

export default Bio
