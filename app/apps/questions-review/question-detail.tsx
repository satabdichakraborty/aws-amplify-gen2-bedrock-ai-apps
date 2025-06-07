"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Schema } from "@/amplify/data/resource";

interface QuestionDetailProps {
  questionId: string;
  onClose: () => void;
}

export default function QuestionDetail({ questionId, onClose }: QuestionDetailProps) {
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const client = generateClient<Schema>();

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await client.models.Question.get({ QuestionId: questionId });
      setQuestion(response);
      setFormData(response);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question details. Please try again later.");
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Calculate word count
      const wordCount = formData.Question.trim().split(/\s+/).length;
      
      const updatedQuestion = {
        ...formData,
        WordCount: wordCount,
        LastEditDate: new Date().toISOString()
      };
      
      await client.models.Question.update(updatedQuestion);
      setQuestion(updatedQuestion);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading question details...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8 text-red-500">{error}</div>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Question Details</CardTitle>
        <CardDescription>
          ID: {questionId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.Status} 
                onValueChange={(value) => handleInputChange("Status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Input 
                id="type" 
                value={formData.Type} 
                onChange={(e) => handleInputChange("Type", e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="key">Key</Label>
              <Input 
                id="key" 
                value={formData.Key} 
                onChange={(e) => handleInputChange("Key", e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input 
                id="topic" 
                value={formData.Topic} 
                onChange={(e) => handleInputChange("Topic", e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea 
                id="question" 
                value={formData.Question} 
                onChange={(e) => handleInputChange("Question", e.target.value)}
                rows={4} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseA">Response A</Label>
              <Textarea 
                id="responseA" 
                value={formData.ResponseA || ""} 
                onChange={(e) => handleInputChange("ResponseA", e.target.value)}
                rows={2} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseB">Response B</Label>
              <Textarea 
                id="responseB" 
                value={formData.ResponseB || ""} 
                onChange={(e) => handleInputChange("ResponseB", e.target.value)}
                rows={2} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseC">Response C</Label>
              <Textarea 
                id="responseC" 
                value={formData.ResponseC || ""} 
                onChange={(e) => handleInputChange("ResponseC", e.target.value)}
                rows={2} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseD">Response D</Label>
              <Textarea 
                id="responseD" 
                value={formData.ResponseD || ""} 
                onChange={(e) => handleInputChange("ResponseD", e.target.value)}
                rows={2} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseE">Response E</Label>
              <Textarea 
                id="responseE" 
                value={formData.ResponseE || ""} 
                onChange={(e) => handleInputChange("ResponseE", e.target.value)}
                rows={2} 
              />
            </div>
            
            <div>
              <Label htmlFor="responseF">Response F</Label>
              <Textarea 
                id="responseF" 
                value={formData.ResponseF || ""} 
                onChange={(e) => handleInputChange("ResponseF", e.target.value)}
                rows={2} 
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{question.Status}</p>
              </div>
              <div>
                <h3 className="font-semibold">Type</h3>
                <p>{question.Type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Key</h3>
                <p>{question.Key}</p>
              </div>
              <div>
                <h3 className="font-semibold">Topic</h3>
                <p>{question.Topic}</p>
              </div>
              <div>
                <h3 className="font-semibold">Word Count</h3>
                <p>{question.WordCount}</p>
              </div>
              <div>
                <h3 className="font-semibold">Last Edit Date</h3>
                <p>{new Date(question.LastEditDate).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="font-semibold">Owner</h3>
                <p>{question.Owner || "Not assigned"}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold">Question</h3>
              <p className="whitespace-pre-wrap">{question.Question}</p>
            </div>
            
            {question.ResponseA && (
              <div>
                <h3 className="font-semibold">Response A</h3>
                <p className="whitespace-pre-wrap">{question.ResponseA}</p>
              </div>
            )}
            
            {question.ResponseB && (
              <div>
                <h3 className="font-semibold">Response B</h3>
                <p className="whitespace-pre-wrap">{question.ResponseB}</p>
              </div>
            )}
            
            {question.ResponseC && (
              <div>
                <h3 className="font-semibold">Response C</h3>
                <p className="whitespace-pre-wrap">{question.ResponseC}</p>
              </div>
            )}
            
            {question.ResponseD && (
              <div>
                <h3 className="font-semibold">Response D</h3>
                <p className="whitespace-pre-wrap">{question.ResponseD}</p>
              </div>
            )}
            
            {question.ResponseE && (
              <div>
                <h3 className="font-semibold">Response E</h3>
                <p className="whitespace-pre-wrap">{question.ResponseE}</p>
              </div>
            )}
            
            {question.ResponseF && (
              <div>
                <h3 className="font-semibold">Response F</h3>
                <p className="whitespace-pre-wrap">{question.ResponseF}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <div>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Question
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
