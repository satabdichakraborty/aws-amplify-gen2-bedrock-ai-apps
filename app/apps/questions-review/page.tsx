"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from "@aws-amplify/ui-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui";
import { Dialog, DialogContent } from "@/components/ui";
import QuestionDetail from "./question-detail";
import CreateQuestion from "./create-question";
import type { Schema } from "@/amplify/data/resource";

export default function QuestionsReview() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const itemsPerPage = 10;
  const client = generateClient<Schema>();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await client.models.Question.list();
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again later.");
      setLoading(false);
    }
  };

  // Filter questions based on search input and active tab
  const filteredQuestions = questions.filter((question) => {
    const matchesFilter = 
      question.Question.toLowerCase().includes(filter.toLowerCase()) ||
      question.Topic.toLowerCase().includes(filter.toLowerCase()) ||
      question.Key.toLowerCase().includes(filter.toLowerCase());
    
    if (activeTab === "all") return matchesFilter;
    return matchesFilter && question.Status.toLowerCase() === activeTab.toLowerCase();
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
  };

  const handleCloseQuestionDetail = () => {
    setSelectedQuestionId(null);
  };

  const handleCreateQuestion = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchQuestions();
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Questions Review Dashboard</CardTitle>
              <CardDescription>
                Manage and review questions from the database
              </CardDescription>
              <div className="flex justify-between items-center mt-4">
                <div className="w-1/3">
                  <Label htmlFor="filter">Search</Label>
                  <Input
                    id="filter"
                    placeholder="Search by question, topic, or key..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateQuestion}>Create Question</Button>
                  <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                {loading ? (
                  <div className="text-center py-8">Loading questions...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <TabsContent value={activeTab} className="mt-4">
                    <Table>
                      <TableCaption>
                        Showing {paginatedQuestions.length} of {filteredQuestions.length} questions
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead>Word Count</TableHead>
                          <TableHead>Last Edit</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedQuestions.length > 0 ? (
                          paginatedQuestions.map((question) => (
                            <TableRow key={question.QuestionId}>
                              <TableCell className="font-medium">{question.QuestionId}</TableCell>
                              <TableCell>{getStatusBadge(question.Status)}</TableCell>
                              <TableCell>{question.Type}</TableCell>
                              <TableCell>{question.Topic}</TableCell>
                              <TableCell className="max-w-xs truncate">{question.Question}</TableCell>
                              <TableCell>{question.WordCount}</TableCell>
                              <TableCell>{question.LastEditDate ? new Date(question.LastEditDate).toLocaleDateString() : 'N/A'}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewQuestion(question.QuestionId)}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">
                              No questions found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
            <CardFooter>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardFooter>
          </Card>
          
          {/* Question Detail Dialog */}
          <Dialog open={selectedQuestionId !== null} onOpenChange={(open) => !open && setSelectedQuestionId(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedQuestionId && (
                <QuestionDetail 
                  questionId={selectedQuestionId} 
                  onClose={handleCloseQuestionDetail} 
                />
              )}
            </DialogContent>
          </Dialog>
          
          {/* Create Question Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CreateQuestion 
                onClose={() => setIsCreateDialogOpen(false)} 
                onSuccess={handleCreateSuccess} 
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Authenticator>
  );
}
