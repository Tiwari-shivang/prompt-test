import React from 'react';
import Page500 from "./page500/Page500";

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: {},
    info: {},
  };
  processError = () => {
    this.setState({
      hasError: false,
      error: {},
      info: {},
    })
  };
  componentDidCatch(error = {}, info = {}) {
    this.setState({
      hasError: true,
      error,
      info,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="nprogress-bar">        
          <Page500
            error={this.state.error}
            info={this.state.info}
            processError={this.processError}
          />
        </div>
      );
    }

    return this.props.children;
  }
}