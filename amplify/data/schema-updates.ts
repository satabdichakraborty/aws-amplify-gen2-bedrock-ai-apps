import { a } from '@aws-amplify/backend';

// Define the Question type schema
export const questionSchema = {
  Question: a.model({
    QuestionId: a.string().required().primaryPartitionKey(),
    Status: a.string().required(),
    Type: a.string().required(),
    Key: a.string().required(),
    Topic: a.string().required(),
    Question: a.string().required(),
    ResponseA: a.string(),
    ResponseB: a.string(),
    ResponseC: a.string(),
    ResponseD: a.string(),
    ResponseE: a.string(),
    ResponseF: a.string(),
    LastEditDate: a.datetime(),
    Owner: a.string(),
    WordCount: a.integer(),
  }).authorization((allow) => [
    // Allow authenticated users to perform all operations
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
  ]),
};
