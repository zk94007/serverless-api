const Calendar = require('../lib/calendar');
const hasuraClient = require('../lib/hasuraClient');

const updateUserTokenMutation = `
  mutation updateUser ($id:uuid, $data:String) {
      update_users(where:{user_cognito_sub:{_eq:$id}}, _set:{user_google_auth: $data}) {
        returning {
          user_google_auth
        }
    } 
  }
`;

const getUserQuery = (uid) => {
  return `
    query {
      users(where:{ user_cognito_sub:{_eq:"${uid}"}}) {
        user_google_auth
        user_email
      }
    }
  `;
};

exports.saveGoogleAuth = async (code, sub) => {
  const calendar = new Calendar();
  const tokens = await calendar.exchangeCode(code);
  return await hasuraClient.request(updateUserTokenMutation, {
    id: sub,
    data: JSON.stringify(tokens),
  });
};

exports.getEvents = async (sub) => {
  const { users } = await hasuraClient.request(getUserQuery(sub));
  const user = users[0];
  if (!user.user_google_auth) {
    throw new Error('Google calendar not connected');
  }
  const calendar = new Calendar(JSON.parse(user.user_google_auth));
  return await calendar.listEvents();
};

exports.addUpdateEvent = async (
  requestedUserSub,
  calendarUserSub,
  eventData,
) => {
  const { users } = await hasuraClient.request(getUserQuery(calendarUserSub));
  const requestedUsers = await hasuraClient.request(
    getUserQuery(requestedUserSub),
  );
  const requestedUser = requestedUsers.users[0];
  const user = users[0];
  if (!user.user_google_auth) {
    throw new Error('Google calendar not connected');
  }
  const calendar = new Calendar(JSON.parse(user.user_google_auth));

  return await calendar.createEvent({
    eventId: eventData.id,
    start: eventData.start,
    end: eventData.end,
    summary: eventData.summary,
    description: eventData.summary,
    attendees: [
      { email: user.user_email },
      { email: requestedUser.user_email },
    ],
  });
};

exports.deleteEvent = async (sub, eventId) => {
  const { users } = await hasuraClient.request(getUserQuery(sub));
  const user = users[0];
  if (!user.user_google_auth) {
    throw new Error('Google calendar not connected');
  }
  const calendar = new Calendar(JSON.parse(user.user_google_auth));
  await calendar.deleteEvent(eventId);
  return {
    success: true
  }
};
