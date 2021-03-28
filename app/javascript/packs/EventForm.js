import React from 'react';
import axios from 'axios';

class EventForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      start_datetime: '',
      location: ''
    };
  }

  handleInput = (event) => {
    const name = event.target.name;
    const newState = {};
    newState[name] = event.target.value;
    this.setState(newState);
    event.preventDefault();
  }

  handleSubmit = event => {
    axios({
      method: 'POST',
      url: '/events',
      data: { event: this.state },
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content
      }
    })
    .then(response => {
      this.props.handleNewEvent(response.data);
    })
    .catch(error => {
      console.log(error)
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h4>Create an Event:</h4>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="title" placeholder="Title" value={this.state.title} onChange={this.handleInput} />
          <input type="text" name="start_datetime" placeholder="Date" value={this.state.start_datetime} onChange={this.handleInput} />
          <input type="text" name="location" placeholder="Location" value={this.state.location} onChange={this.handleInput} />
          <button type="submit">Create Event</button>
        </form>
      </div>
      )
  }
}

export default EventForm;
