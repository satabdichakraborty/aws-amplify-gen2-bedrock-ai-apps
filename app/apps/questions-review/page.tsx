"use client"

import { Schema } from "@/amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { AppConstants, AppNames } from "@/utils/AppConstants";
import Link from "next/link";
import React from "react";
import Container from "@cloudscape-design/components/container";
import Header from "@cloudscape-design/components/header";
import Table from "@cloudscape-design/components/table";
import Button from "@cloudscape-design/components/button";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Badge from "@cloudscape-design/components/badge";
import Spinner from "@cloudscape-design/components/spinner";

interface Question {
    QuestionId: string;
    Status?: string;
    Key?: string;
    Topic?: string;
    Question: string;
    ResponseA?: string;
    ResponseB?: string;
    ResponseC?: string;
    ResponseD?: string;
    ResponseE?: string;
    ResponseF?: string;
    LastEditedDate?: string;
    Owner?: string;
    WordCount?: number;
}

function QuestionsReviewComponent() {
    const client = generateClient<Schema>()
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    // Fetch questions from DynamoDB
    const fetchQuestions = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: questionsData } = await client.models.Question.list();
            setQuestions(questionsData as Question[]);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [client.models.Question]);

    // Load questions on component mount
    React.useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // Format date string for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString; // Return as-is if not a valid date
        }
    };

    // Format responses for display
    const formatResponses = (question: Question) => {
        const responses = [
            question.ResponseA && `A: ${question.ResponseA}`,
            question.ResponseB && `B: ${question.ResponseB}`,
            question.ResponseC && `C: ${question.ResponseC}`,
            question.ResponseD && `D: ${question.ResponseD}`,
            question.ResponseE && `E: ${question.ResponseE}`,
            question.ResponseF && `F: ${question.ResponseF}`,
        ].filter(Boolean);
        
        return responses.length > 0 ? responses.join(' | ') : 'No responses';
    };

    // Get status badge color for Cloudscape Badge
    const getStatusBadgeColor = (status?: string): "blue" | "grey" | "green" | "red" => {
        switch (status?.toLowerCase()) {
            case 'active': return 'green';
            case 'inactive': return 'grey';
            case 'pending': return 'blue';
            case 'archived': return 'red';
            default: return 'blue';
        }
    };

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    description={AppConstants.Apps.find(item => item.title == AppNames.QUESTIONS_REVIEW)?.description}
                    actions={
                        <Button 
                            onClick={fetchQuestions}
                            disabled={isLoading}
                            iconName="refresh"
                        >
                            {isLoading ? "Refreshing..." : "Refresh"}
                        </Button>
                    }
                >
                    {AppNames.QUESTIONS_REVIEW}
                </Header>
            }
        >
                    {isLoading ? (
                        <Box textAlign="center" padding="xl">
                            <SpaceBetween size="m" direction="vertical" alignItems="center">
                                <Spinner size="large" />
                                <Box>Loading questions...</Box>
                            </SpaceBetween>
                        </Box>
                    ) : questions.length === 0 ? (
                        <Box textAlign="center" padding="xl">
                            <SpaceBetween size="s" direction="vertical">
                                <Box variant="strong">No questions found in the database.</Box>
                                <Box variant="small">
                                    Add some questions to the Question table in DynamoDB to see them here.
                                </Box>
                            </SpaceBetween>
                        </Box>
                    ) : (
                        <Table
                            columnDefinitions={[
                                {
                                    id: "questionId",
                                    header: "Question ID",
                                    cell: (item: Question) => (
                                        <Box>
                                            <code style={{ fontSize: '0.875rem' }}>
                                                {item.QuestionId}
                                            </code>
                                        </Box>
                                    ),
                                    sortingField: "QuestionId",
                                    isRowHeader: true
                                },
                                {
                                    id: "status",
                                    header: "Status",
                                    cell: (item: Question) => (
                                        item.Status ? (
                                            <Badge color={getStatusBadgeColor(item.Status)}>
                                                {item.Status}
                                            </Badge>
                                        ) : (
                                            <Box color="text-status-inactive">N/A</Box>
                                        )
                                    ),
                                    sortingField: "Status"
                                },
                                {
                                    id: "topic",
                                    header: "Topic",
                                    cell: (item: Question) => item.Topic || "No topic",
                                    sortingField: "Topic"
                                },
                                {
                                    id: "question",
                                    header: "Question",
                                    cell: (item: Question) => (
                                        <div title={item.Question}>
                                            {item.Question.length > 100 
                                                ? `${item.Question.substring(0, 100)}...` 
                                                : item.Question}
                                        </div>
                                    ),
                                    sortingField: "Question"
                                },
                                {
                                    id: "responses",
                                    header: "Responses",
                                    cell: (item: Question) => (
                                        <div title={formatResponses(item)}>
                                            {formatResponses(item).length > 50 
                                                ? `${formatResponses(item).substring(0, 50)}...` 
                                                : formatResponses(item)}
                                        </div>
                                    )
                                },
                                {
                                    id: "owner",
                                    header: "Owner",
                                    cell: (item: Question) => item.Owner || "Unassigned",
                                    sortingField: "Owner"
                                },
                                {
                                    id: "wordCount",
                                    header: "Word Count",
                                    cell: (item: Question) => (
                                        <Box textAlign="center">
                                            {item.WordCount || 0}
                                        </Box>
                                    ),
                                    sortingField: "WordCount"
                                },
                                {
                                    id: "lastEdited",
                                    header: "Last Edited",
                                    cell: (item: Question) => formatDate(item.LastEditedDate),
                                    sortingField: "LastEditedDate"
                                }
                            ]}
                            items={questions}
                            loading={isLoading}
                            loadingText="Loading questions..."
                            empty={
                                <Box textAlign="center" color="inherit">
                                    <SpaceBetween size="m">
                                        <Box variant="strong" textAlign="center" color="inherit">
                                            No questions
                                        </Box>
                                        <Box variant="p" textAlign="center" color="inherit">
                                            No questions to display.
                                        </Box>
                                    </SpaceBetween>
                                </Box>
                            }
                        />
                    )}
                    
            <Box padding={{ top: "l" }}>
                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <Button variant="link" iconName="arrow-left">
                            Back to Apps
                        </Button>
                    </Link>
                    <Box variant="small" color="text-status-inactive">
                        Total Questions: {questions.length}
                    </Box>
                </SpaceBetween>
            </Box>
        </Container>
    );
}

export default function QuestionsReview() {
    return (
        <Box padding="l" className="flex-grow">
            <Authenticator>
                <QuestionsReviewComponent />
            </Authenticator>
        </Box>
    );
} 