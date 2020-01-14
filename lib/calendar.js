const {google} = require('googleapis');

class GoogleCalendar {
  constructor(credentials, onRefresh) {
    this.client = new google.auth.OAuth2(
      '621276408825-4ht2j9sjfi1tikeplbfstp4471m7oa19.apps.googleusercontent.com',
      '0W4_CmkhOX60KCyerxHEsV-w',
      'https://app.weadmit.io'
    );
    if (credentials) {
      this.client.setCredentials(credentials);
    }
    if (onRefresh) {
      this.client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          onRefresh(tokens);
        }
      });
    }
  }

  exchangeCode(code) {
    const self = this;
    return this.client.getToken(code).then(
      resp => {
        self.client.setCredentials(resp.tokens);
        return resp.tokens;
      }
    );
  }

  listEvents(query) {
    const calendar = google.calendar({version: 'v3', auth: this.client});
    return calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    }).then(res => res.data.items);
  }

  createEvent({
    eventId,
    summary,
    description,
    start,
    end,
    attendees
  }) {
    const calendar = google.calendar({version: 'v3', auth: this.client});
    var event = {
      'summary': summary,
      'description': description,
      'start': {
        'dateTime': start,
      },
      'end': {
        'dateTime': end,
      },
      'attendees': attendees,
      'reminders': {
        'useDefault': true,
      },
    };
    if (eventId) {
      return calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event
      }).then(resp => resp.data);
    }
    return calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    }).then(resp => resp.data);
  }

  deleteEvent(eventId) {
    const calendar = google.calendar({version: 'v3', auth: this.client});
    return calendar.events.delete({
      calendarId: 'primary',
      sendUpdates: 'all',
      eventId
    });
  }
}

module.exports = GoogleCalendar;

