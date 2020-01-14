const { DataSource } = require('apollo-datasource');

class AdminDataSource extends DataSource {
  constructor(services) {
    super();
    this.services = services;
  }
  initialize(config) {
    this.context = config.context;
  }
  getEvents(sub) {
    return this.services.calendarService.getEvents(sub);
  }
  addUpdateEvent(sub, event) {
    return this.services.calendarService.addUpdateEvent(this.context.user.sub, sub, event);
  }
  deleteEvent(sub, eventId) {
    return this.services.calendarService.deleteEvent(sub, eventId);
  }
}

module.exports = AdminDataSource;
