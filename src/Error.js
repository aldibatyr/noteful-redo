import React from 'react';

export default class Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="error-page">
          <h2>We are sorry. Something is not right.</h2>
          <p>Try reloading the page</p>
        </main>
      )
    }
    return this.props.children
  }
}