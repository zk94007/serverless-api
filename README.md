# Serveerless API

## Technologies
* NodeJs
* Apollo Graphql
* Serverless Framework with AWS

## Getting started.

* Install serverless CLI
* Setup aws credentials with `aws` profile name
* `npm install` in this directory
* `npm run local` to run local serverless. Remove `noAuth` flag from the run script
if needed.

## Local development
First, create a `.env.local` file with following keys and correct values for local development
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-2
ADMIN_SECRET=
HGE_ENDPOINT=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_API_KEY=
TWILIO_API_SECRET=
TWILIO_QUEUE_URL=
```
Run `npm run local` to run locally

# Deploy to AWS
First, create a `.env.prod` file with all the keys from `env.local` except `AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`, `AWS_REGION` and `TWILIO_QUEUE_URL`. Make necessary changes if values are different. To Deploy, run:
```
npm run deploy:prod 
```
