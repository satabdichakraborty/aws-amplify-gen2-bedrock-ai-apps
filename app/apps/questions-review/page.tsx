"use client"

import { Schema } from "@/amplify/data/resource";
import { Authenticator } from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';
import { generateClient } from "aws-amplify/data";
import { Button } from "@/components/ui/button"
import { AppConstants, AppNames } from "@/utils/AppConstants";
import Link from "next/link";
import { ArrowLeftCircle, Loader2, RefreshCw, Plus } from "lucide-react";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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

    // Get status badge color
    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'text-green-600 bg-green-100';
            case 'inactive': return 'text-gray-600 bg-gray-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'archived': return 'text-red-600 bg-red-100';
            default: return 'text-blue-600 bg-blue-100';
        }
    };

    return (
        <>
            <Card className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>{AppNames.QUESTIONS_REVIEW}</CardTitle>
                            <CardDescription>
                                {AppConstants.Apps.find(item => item.title == AppNames.QUESTIONS_REVIEW)?.description}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={fetchQuestions}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                Refresh
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin" />
                            <span className="ml-2">Loading questions...</span>
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">No questions found in the database.</p>
                            <p className="text-sm text-gray-400">
                                Add some questions to the Question table in DynamoDB to see them here.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Question ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Topic</TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead>Responses</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Word Count</TableHead>
                                        <TableHead>Last Edited</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {questions.map((question) => (
                                        <TableRow key={question.QuestionId}>
                                            <TableCell className="font-mono text-sm">
                                                {question.QuestionId}
                                            </TableCell>
                                            <TableCell>
                                                {question.Status ? (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.Status)}`}>
                                                        {question.Status}
                                                    </span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {question.Topic || 'No topic'}
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <div className="truncate" title={question.Question}>
                                                    {question.Question}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-sm">
                                                <div className="truncate" title={formatResponses(question)}>
                                                    {formatResponses(question)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {question.Owner || 'Unassigned'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {question.WordCount || 0}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(question.LastEditedDate)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    
                    <div className="flex justify-between mt-6">
                        <Button variant="outline" asChild>
                            <Link href="/">
                                <ArrowLeftCircle className="h-4 w-4 me-2" />
                                Back to Apps
                            </Link>
                        </Button>
                        <div className="text-sm text-gray-500">
                            Total Questions: {questions.length}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default function QuestionsReview() {
    return (
        <div className="flex-grow bg-gray-100 px-6 sm:px-16 py-8">
            <Authenticator>
                <QuestionsReviewComponent />
            </Authenticator>
        </div>
    );
} 