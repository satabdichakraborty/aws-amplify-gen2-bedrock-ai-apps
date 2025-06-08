"use client"

import { AppConstants } from "@/utils/AppConstants";
import Link from "next/link";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import ColumnLayout from "@cloudscape-design/components/column-layout";
import Icon from "@cloudscape-design/components/icon";

export default function Home() {
  return (
    <Box padding="l" className="flex-grow">
      <Container
        header={
          <Header variant="h1">
            AI Tools!
          </Header>
        }
      >
        <SpaceBetween size="l">
          <Box variant="p">
            Explore our collection of AI-powered tools and services built with AWS Amplify Gen2 and Amazon Bedrock.
          </Box>
          
          <ColumnLayout columns={3} variant="text-grid">
            {AppConstants.Apps.map((app, index) => (
              <Link href={app.path} key={index} style={{ textDecoration: 'none' }}>
                <Container>
                  <SpaceBetween size="s">
                    <Box>
                      <Icon name="folder" size="large" />
                    </Box>
                    <Box>
                      <Box variant="h3">
                        {app.title}
                      </Box>
                      <Box variant="p">
                        {app.description}
                      </Box>
                    </Box>
                  </SpaceBetween>
                </Container>
              </Link>
            ))}
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </Box>
  );
}
