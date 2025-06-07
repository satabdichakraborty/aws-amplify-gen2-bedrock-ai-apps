# Full-Stack AI Apps with AWS Amplify Gen2 and Amazon Bedrock

This is a comprehensive application that demonstrates how to build Generative AI apps with AWS Amplify Gen2 and Amazon Bedrock, as well as a Questions Review Tool for AWS certification exam preparation.

## Applications

### AI-Powered Tools
1. **Instagram Captions Generator** - Use AI to generate captions for Instagram posts
2. **Text Rephraser** - Use AI to rephrase text

### Questions Review Tool
3. **AWS Certification Exam Questions Review Tool** - Manage and review AWS certification exam questions using AWS Cloudscape components

## Demo
- Live Deployment: [Amplify AI Apps](https://main.dv2wiefoyjqb9.amplifyapp.com)

### Instagram Captions Generator
![System Architecture](./docs/instagram-caption-generator.png)

### Text Rephraser
![System Architecture](./docs/text-rephraser.png)

## Tech Stack
- **Backend**: AWS Amplify Gen2, TypeScript
- **Frontend**: Next.js, React, Tailwind CSS, Shadcn UI, AWS Cloudscape Design System
- **AWS Amplify Technologies**: Data (Amazon DynamoDB), Authentication (Amazon Cognito), Serverless Functions (AWS Lambda), File Storage (S3)
- **AWS Others**: AWS CDK, Amazon Bedrock, AWS AppSync, GraphQL
- **Hosting**: AWS Amplify

## Architecture
![System Architecture](./docs/architecture.png)

## Questions Review Tool Architecture

The Questions Review Tool is built using AWS Amplify Gen2 with the following components:

### Backend
- **GraphQL API**: AppSync API with the following schema:
  ```graphql
  type Question @model {
    QuestionId: ID! @primaryKey
    Status: String
    Type: String
    Key: String
    Topic: String
    Question: String
    ResponseA: String
    ResponseB: String
    ResponseC: String
    ResponseD: String
    ResponseE: String
    ResponseF: String
    LastEditDate: AWSDateTime
    Owner: String
    WordCount: Int
  }
  ```
- **DynamoDB**: Questions table with GSIs for efficient queries by Status, Topic, and Type
- **IAM**: Appropriate permissions for data access and management

### Frontend
- **AWS Cloudscape Components**: Professional UI components designed for AWS applications
- **Key Views**:
  - Question list/table with filtering, sorting, and pagination
  - Question detail view with all response options
  - Question edit/create form

### Key Features
- Questions browsing with filter capabilities
- Question status management
- Search functionality by topic and content
- Responsive design for various screen sizes

## Pre-requisite for running App
1. AWS Account
2. On the Model access page in **Amazon Bedrock**, Enable access for `anthropic.claude-3-haiku-20240307-v1:0` model.

## Running App Locally
1. Clone the repository from AWS CodeCommit.
2. Run `npm install` to install dependencies.
3. Configure AWS Profile
4. Run `npx ampx sandbox` to provision backend infra in AWS.
5. Run `npm run dev` to run the app.
6. Open `http://localhost:3000` with your browser to see the result.

## Setting up the Questions Review Tool
1. Create a new Amplify Gen2 project in your desired location
2. Initialize with `amplify init` using the Gen2 configuration
3. Configure the GraphQL schema as defined above
4. Set up the DynamoDB table with appropriate GSIs
5. Install AWS Cloudscape Design System components
6. Implement the frontend views and functionality

## Deploying to AWS
1. Push your code to AWS CodeCommit.
2. Follow the detailed instructions on deploying your application, refer to the [deployment section](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/#deploy-a-fullstack-app-to-aws) of our documentation.
