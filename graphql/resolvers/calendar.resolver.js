module.exports = {
  Query: {
    googleAuth: (parent, args, { dataSources }) => {
      return calendar.exchangeCode(args.code);
    },
    events: (parent, args, { dataSources }) => {
      return dataSources.calendar.getEvents(args.sub);
    }
  },
  Mutation: {
    addEditEvent: (parent, args, { dataSources }) => {
      return dataSources.calendar.addUpdateEvent(args.sub, args.event);
    },
    deleteEvent: (parent, args, { dataSources }) => {
      return dataSources.calendar.deleteEvent(args.sub, args.eventId)
    }
  }
};
