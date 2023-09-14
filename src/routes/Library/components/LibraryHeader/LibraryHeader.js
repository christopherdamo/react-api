import PropTypes from 'prop-types'
import React from 'react'
import Button from 'components/Button'
import styles from './LibraryHeader.css'

class LibraryHeader extends React.Component {
  static propTypes = {
    filterStr: PropTypes.string.isRequired,
    filterStarred: PropTypes.bool.isRequired,
    // actions
    setFilterStr: PropTypes.func.isRequired,
    resetFilterStr: PropTypes.func.isRequired,
    toggleFilterStarred: PropTypes.func.isRequired,
  }

  searchInput = React.createRef()
  state = {
    value: this.props.filterStr,
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
    this.props.setFilterStr(event.target.value)
  }

  // a bit of a kludge to search youtube after pressing enter or the mobile search button.
  // if youtube search is disabled or the local media library is not empty, the button will not exist
  // and nothing will happen.
  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      const youtubeSearchButton = document.getElementById('youtubeSearchButton')
      if (youtubeSearchButton) youtubeSearchButton.click()
    }
  }

  handleMagnifierClick = () => {
    this.state.value.trim() ? this.clearSearch() : this.searchInput.current.focus()
  }

  clearSearch = () => {
    this.setState({ value: '' })
    this.props.resetFilterStr()
  }

  render () {
    const { filterStr, filterStarred } = this.props

    return (
      <div className={styles.container}>
        <Button
          className={filterStr ? styles.btnActive : styles.btn}
          icon='MAGNIFIER'
          onClick={this.handleMagnifierClick}
          size={40}
        />
        <input type='search'
          className={styles.searchInput}
          placeholder='search'
          value={this.state.value}
          onChange={this.handleChange}
          onKeyDown={this.onKeyDown}
          ref={this.searchInput}
        />
        {filterStr &&
          <Button
            icon='CLEAR'
            onClick={this.clearSearch}
            className={styles.btnActive}
            size={40}
          />
        }
        <Button
          animateClassName={styles.btnAnimate}
          className={filterStarred ? styles.btnActive : styles.btn}
          icon='STAR_FULL'
          onClick={this.props.toggleFilterStarred}
          size={44}
        />
      </div>
    )
  }
}

export default LibraryHeader
