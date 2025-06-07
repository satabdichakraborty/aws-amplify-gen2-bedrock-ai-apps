"use client";

import { useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { v4 as uuidv4 } from "uuid";
import type { Schema } from "@/amplify/data/resource";

interface CreateQuestionProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateQuestion({ onClose, onSuccess }: CreateQuestionProps) {
  const { user } = useAuthenticator();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    QuestionId: uuidv4(),
    Status: "Pending",
    Type: "",
    Key: "",
    Topic: "",
    Question: "",
    ResponseA: "",
    ResponseB: "",
    ResponseC: "",
    ResponseD: "",
    ResponseE: "",
    ResponseF: "",
    LastEditDate: new Date().toISOString(),
    Owner: user?.username || "",
    WordCount: 0
  });
  
  const client = generateClient<Schema>();

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.Type || !formData.Key || !formData.Topic || !formData.Question) {
        setError("Please fill in all required fields");
        return;
      }
      
      setLoading(true);
      
      // Calculate word count
      const wordCount = formData.Question.trim().split(/\s+/).length;
      
      const newQuestion = {
        ...formData,
        WordCount: wordCount,
        LastEditDate: new Date().toISOString()
      };
      
      await client.models.Question.create(newQuestion);
      setLoading(false);
      onSuccess();
    } catch (err) {
      console.error("Error creating question:", err);
      setError("Failed to create question. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Question</CardTitle>
        <CardDescription>
          Add a new question to the database
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="type">Type *</Label>
            <Input 
              id="type" 
              value={formData.Type} 
              onChange={(e) => handleInputChange("Type", e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="key">Key *</Label>
            <Input 
              id="key" 
              value={formData.Key} 
              onChange={(e) => handleInputChange("Key", e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="topic">Topic *</Label>
            <Input 
              id="topic" 
              value={formData.Topic} 
              onChange={(e) => handleInputChange("Topic", e.target.value)} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="question">Question *</Label>
            <Textarea 
              id="question" 
              value={formData.Question} 
              onChange={(e) => handleInputChange("Question", e.target.value)}
              rows={4} 
              required
            />
          </div>
          
          <div>
            <Label htmlFor="responseA">Response A</Label>
            <Textarea 
              id="responseA" 
              value={formData.ResponseA} 
              onChange={(e) => handleInputChange("ResponseA", e.target.value)}
              rows={2} 
            />
          </div>
          
          <div>
            <Label htmlFor="responseB">Response B</Label>
            <Textarea 
              id="responseB" 
              value={formData.ResponseB} 
              onChange={(e) => handleInputChange("ResponseB", e.target.value)}
              rows={2} 
            />
          </div>
          
          <div>
            <Label htmlFor="responseC">Response C</Label>
            <Textarea 
              id="responseC" 
              value={formData.ResponseC} 
              onChange={(e) => handleInputChange("ResponseC", e.target.value)}
              rows={2} 
            />
          </div>
          
          <div>
            <Label htmlFor="responseD">Response D</Label>
            <Textarea 
              id="responseD" 
              value={formData.ResponseD} 
              onChange={(e) => handleInputChange("ResponseD", e.target.value)}
              rows={2} 
            />
          </div>
          
          <div>
            <Label htmlFor="responseE">Response E</Label>
            <Textarea 
              id="responseE" 
              value={formData.ResponseE} 
              onChange={(e) => handleInputChange("ResponseE", e.target.value)}
              rows={2} 
            />
          </div>
          
          <div>
            <Label htmlFor="responseF">Response F</Label>
            <Textarea 
              id="responseF" 
              value={formData.ResponseF} 
              onChange={(e) => handleInputChange("ResponseF", e.target.value)}
              rows={2} 
            />
          </div>
          
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create Question"}
        </Button>
      </CardFooter>
    </Card>
  );
}
