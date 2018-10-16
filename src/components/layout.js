import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'

import './Container.css'

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <div className="Header">
          {this.headerlink('About', '/')}
          {this.headerlink('Programming', '/')}
          {this.headerlink('Books', '/')}
        </div>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: 0,
            marginBottom: rhythm(-1),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to={'/'}
          >
    	  Home
          </Link>
        </h3>
      )
    }
    return (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </div>
    )
  }

  headerlink(text, location) {
        return (<h3>
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
              marginRight: '15px',
            }}
            to={location}
          >
          {text}
          </Link>
        </h3>)
  }
}

export default Template
