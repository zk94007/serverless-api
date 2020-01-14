const Twilio = require('twilio');
const { S3RemoteUploader } = require('./s3');
const AccessToken = Twilio.jwt.AccessToken;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const secret = process.env.TWILIO_API_SECRET;
const STATUS_CALLBACK_URL = 'https://g55mnkamad.execute-api.us-east-2.amazonaws.com/prod/twilio/webhooks/composition'; // TODO env variable
const client = Twilio(accountSid, token);

const generateToken = () => {
  return new AccessToken(accountSid, apiKey, apiSecret);
};

const videoToken = (identity, room, config) => {
  const videoGrant = new VideoGrant({ room });
  const token = generateToken(config);
  token.addGrant(videoGrant);
  token.identity = identity;

  return token.toJwt();
};

exports.getVideoToken = videoToken;

exports.getRoom = (roomId) => {
  return client.video.rooms(roomId).fetch();
};

exports.getRoomParticipants = (roomId) =>
  client.video.rooms(roomId).participants.list();

exports.getRecordings = (roomId) => {
  return client.video.rooms(roomId).recordings.list({ limit: 50 });
};

exports.getComposition = (id) =>
  client.video.compositions(id);

exports.createRoomComposition = async (roomId) => {
  return client.video.compositions.create({
    roomSid: roomId,
    audioSources: '*',
    videoLayout: {
      grid: {
        video_sources: ['*'],
      },
    },
    statusCallback: STATUS_CALLBACK_URL,
    format: 'mp4',
  });
};

exports.createAudioComposition = async (event) => {
  return client.video.compositions.create({
    roomSid: event.RoomSid,
    audioSources: event.ParticipantSid,
    statusCallback: event.statusCallback || STATUS_CALLBACK_URL,
    format: 'mp4',
  });
};

exports.createVideoComposition = async (event) => {
  return client.video.compositions.
  create({
    roomSid: event.RoomSid,
    audioSources: event.ParticipantSid,
    videoLayout: {
      single : {
        video_sources: [event.ParticipantSid]
      }
    },
    statusCallback: event.statusCallback || STATUS_CALLBACK_URL,
    format: 'mp4'
  })
};

exports.uploadCompositionToS3 = (uri, filename) => {
  const url = 'https://video.twilio.com' + uri + '/Media?Ttl=3600';
  return client
    .request({
      method: 'GET',
      uri: url,
    })
    .then((response) => {
      const mediaLocation = JSON.parse(response.body).redirect_to;
      const fileUpload = new S3RemoteUploader(mediaLocation, filename);
      return fileUpload.dispatch();
    });
};
