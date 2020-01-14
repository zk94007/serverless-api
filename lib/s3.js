const AWS = require('aws-sdk');
const axios = require('axios');
const stream = require('stream');

const s3 = new AWS.S3();
const DESTINATION_BUCKET = 'weadmit-videos';

class S3RemoteUploader {
  constructor(remoteAddr, key){
    this.url = remoteAddr;
    this.key = key;
    this.content_type = 'application/octet-stream';
    this.uploadStream();
  }
  uploadStream(){
    const pass = new stream.PassThrough();
    this.promise = s3.upload({
      Bucket: DESTINATION_BUCKET,
      Key: this.key,
      Body: pass,
      ContentType: this.content_type
    }).promise();
    return pass;
  }
  initiateAxiosCall() {
    return axios({
      method: 'get',
      url: this.url,
      responseType: 'stream'
    });
  }
  async dispatch() {
    await this.initiateAxiosCall().then( (response) => {
      if(response.status===200){
        this.content_type = response.headers['content-type'];
        response.data.pipe(this.uploadStream());
      }
    });
    return this.promise;
  }
}

exports.S3RemoteUploader = S3RemoteUploader;
