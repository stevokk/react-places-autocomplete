import React from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from '../src'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      geocodeResults: null,
      loading: false
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderGeocodeFailure = this.renderGeocodeFailure.bind(this)
    this.renderGeocodeSuccess = this.renderGeocodeSuccess.bind(this)

    this.getPreferredResults = this.getPreferredResults.bind(this)

    this.preferredLocations = [
      {
        suggestion: 'Apple Campus1234, Cupertino, CA, United States',
        placeId: 'ChIJt00z67a1j4ARL8h-xOZ1XVo',
        formattedSuggestion: {
          mainText: 'Apple',
          secondaryText: 'Cupertino'
        }
      },
      {
        suggestion: 'Facebook HQ, Hacker Way, Menlo Park, CA, United States',
        placeId: 'ChIJZa6ezJa8j4AR1p1nTSaRtuQ',
        formattedSuggestion: {
          mainText: 'Facebook',
          secondaryText: 'Menlo Park'
        }
      },
    ]
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true
    })

    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        console.log('Success Yay', { lat, lng })
        this.setState({
          geocodeResults: this.renderGeocodeSuccess(lat, lng),
          loading: false
        })
      })
      .catch((error) => {
        console.log('Oh no!', error)
        this.setState({
          geocodeResults: this.renderGeocodeFailure(error),
          loading: false
        })
      })

    /* NOTE: Using callback (Deprecated version) */
    // geocodeByAddress(address,  (err, { lat, lng }) => {
    //   if (err) {
    //     console.log('Oh no!', err)
    //     this.setState({
    //       geocodeResults: this.renderGeocodeFailure(err),
    //       loading: false
    //     })
    //   }
    //   console.log(`Yay! got latitude and longitude for ${address}`, { lat, lng })
    //   this.setState({
    //     geocodeResults: this.renderGeocodeSuccess(lat, lng),
    //     loading: false
    //   })
    // })
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null
    })
  }

  getPreferredResults({ query, results }, callback) {
    query = query.toLowerCase()
    let preferredResults = this.preferredLocations
          .filter(location => {
            return location.suggestion.toLowerCase().indexOf(query) !== -1
          })
          .map(({ suggestion, placeId, formattedSuggestion }, idx) => {
            return {
              suggestion,
              placeId,
              formattedSuggestion,
              preferred: true
            }
          })
          
    callback(preferredResults.concat(results))
  }

  renderGeocodeFailure(err) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {err}
      </div>
    )
  }

  renderGeocodeSuccess(lat, lng) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> Geocoder found latitude and longitude: <strong>{lat}, {lng}</strong>
      </div>
    )
  }

  render() {
    const cssClasses = {
      root: 'form-group',
      input: 'Demo__search-input',
      autocompleteContainer: 'Demo__autocomplete-container',
    }

    const AutocompleteItem = ({ formattedSuggestion, preferred }) => (
      <div className="Demo__suggestion-item">
        <i className={(preferred ? 'fa-star' : 'fa-map-marker') + ' fa Demo__suggestion-icon'} />
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    const inputProps = {
      type: "text",
      value: this.state.address,
      onChange: this.handleChange,
      onBlur: () => { console.log('Blur event!'); },
      onFocus: () => { console.log('Focused!'); },
      autoFocus: true,
      placeholder: "Search Places",
      name: 'Demo__input',
      id: "my-input-id",
    }

    return (
      <div className='page-wrapper'>
        <div className='container'>
          <h1 className='display-3'>react-places-autocomplete <i className='fa fa-map-marker header'/></h1>
          <p className='lead'>A React component to build a customized UI for Google Maps Places Autocomplete</p>
          <hr />
          <a href='https://github.com/kenny-hibino/react-places-autocomplete' className='Demo__github-link' target="_blank" >
            <span className='fa fa-github Demo__github-icon'></span>
            &nbsp;View on GitHub
          </a>
        </div>
        <div className='container'>
          <PlacesAutocomplete
            onSelect={this.handleSelect}
            autocompleteItem={AutocompleteItem}
            onEnterKeyDown={this.handleSelect}
            classNames={cssClasses}
            inputProps={inputProps}
            onSearch={this.getPreferredResults}
            googleLogo={false}
          />
          {this.state.loading ? <div><i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" /></div> : null}
          {!this.state.loading && this.state.geocodeResults ?
            <div className='geocoding-results'>{this.state.geocodeResults}</div> :
          null}
        </div>
      </div>
    )
  }
}

export default Demo
