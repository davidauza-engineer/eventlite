# frozen_string_literal: true

class EventsController < ApplicationController
  def index
    @events = [
      {
        title: 'London Retail Expo',
        start_datetime: 'Mon, 21 Oct 2019',
        location: 'London Excel Centre'
      },
      {
        title: 'Enterprise Sales Training Workshop',
        start_datetime: 'Tue, 22 Oct 2019',
        location: 'Expert Sales Company Headquarters'
      },
      {
        title: 'Ruby Hack Night',
        start_datetime: 'Fri, 25 Oct 2019',
        location: 'Learnetto Headquarters'
      },
      {
        title: 'Beginners Salsa dance meetup',
        start_datetime: 'Sat, 26 Oct 2019',
        location: 'Bar Salsa'
      }
    ]
  end
end
