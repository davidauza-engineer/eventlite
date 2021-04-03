import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import EventsList from './EventsList';
import EventForm from './EventForm';
import FormErrors from './FormErrors';

class Eventlite extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      title: { value: '', valid: false },
      start_datetime: { value: '', valid: false },
      location: { value: '', valid: false },
      formErrors: {},
      formValid: false
    };
  }

  handleInput = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value
    const newState = {};
    newState[name] = { ...this.state[name], value: value };
    this.setState(newState, () => this.validateField(name, value));
  }

  validateField(fieldName, fieldValue) {
    let fieldValid = true;
    let errors = [];
    switch (fieldName) {
      case 'title':
        if (fieldValue.length <= 2) {
          errors = errors.concat(['is too short (minimum is three characters']);
          fieldValid = false;
        }
        break;
      case 'location':
        if (fieldValue.length === 0) {
          errors = errors.concat(["can't be blank"]);
          fieldValid = false;
        }
        break;
      case 'start_datetime':
        if (fieldValue.length === 0) {
          errors = errors.concat(["can't be blank"]);
          fieldValid = false;
        } else if (Date.parse(fieldValue) <= Date.now()) {
          errors = errors.concat(["can't be in the past"]);
        }
        break;
    }
    const newState = { formErrors: { ...this.state.formErrors, [fieldName]: errors } };
    newState[fieldName] = { ...this.state.[fieldName], valid: fieldValid };
    this.setState(newState, this.validateForm);
  } 

  validateForm() {
    this.setState({ formValid: this.state.title.valid && this.state.start_datetime.valid && this.state.location.valid });
  }

  handleSubmit = event => {
    event.preventDefault();
    let newEvent = {
      title: this.state.title.value,
      start_datetime: this.state.start_datetime.value,
      location: this.state.location.value
    }
    axios({
      method: 'POST',
      url: '/events',
      data: { event: newEvent },
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
      }
    })
    .then(response => {
      this.addNewEvent(response.data);
      this.resetFormErrors();
    })
    .catch(error => {
      console.log(error.response.data);
      this.setState({ formErrors: error.response.data })
    });
  }

  resetFormErrors() {
    this.setState({ formErrors: {} });
  }

  addNewEvent = event => {
    const events = [...this.state.events, event].sort(function(a, b) {
      return new Date(a.start_datetime) - new Date(b.start_datetime);
    });
    this.setState({ events: events });
  }

  render() {
    return (
      <div>
        <FormErrors formErrors={this.state.formErrors} />
        <EventForm handleInput={this.handleInput} 
          handleSubmit={this.handleSubmit}
          title={this.state.title.value}
          start_datetime={this.state.start_datetime.value}
          location={this.state.location.value}
          formValid={this.state.formValid} />
        <EventsList events={this.state.events} />
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('events_data');
  const data = JSON.parse(node.getAttribute('data'));
  ReactDOM.render(
    <Eventlite events={data} />,
    document.body.appendChild(document.createElement('div'))
    )
});
