import React, { PureComponent } from 'react';
import Snackbar from 'react-md/lib/Snackbars';

export default class SimpleExamples extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      toasts: this.props.toasts,
    };

    this.handleDropDeleteZone = this.props.handleDropDeleteZone.bind(this, this.props.parent);
  }

  handleDragOver = (e) => {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
  }

  handleDragEnterDeleteZone = (e) => {
    if(e.target.id === "snackbarAlert") {
      e.target.innerHTML = '<i class="material-icons">delete_forever</i> Delete forever';
    }
  }

  handleDragLeaveDeleteZone = (e) => {
    if(e.target.id === "snackbarAlert") {
      e.target.innerHTML = 'Drag here to delete';
    }
  }


  componentWillReceiveProps(nextProps) {
    this.setState({toasts: nextProps.toasts});
  }

  _removeToast = () => {
    this.setState({ toasts: [] });
  }

  render() {
    return (
        <Snackbar
        toasts={this.state.toasts}
        autohide={false}
        onDismiss={this._removeToast}
        onDragEnter={this.handleDragEnterDeleteZone}
        onDragLeave={this.handleDragLeaveDeleteZone}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDropDeleteZone}/>
    );
  }
}
