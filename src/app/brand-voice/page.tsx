
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateBrandVoiceContent } from '@/ai/flows/brand-voice-generator';
import { Bot, Clipboard } from 'lucide-react';

export default function BrandVoicePage() {
  const [brandDescription, setBrandDescription] = useState('Friendly, approachable, and slightly witty. We use simple language and avoid jargon.');
  const [topic, setTopic] = useState('The benefits of our new analytics dashboard');
  const [platform, setPlatform] = useState('blog-post');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!brandDescription || !topic || !platform) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to generate content.',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    try {
      const result = await generateBrandVoiceContent({
        brandDescription,
        topic,
        platform,
      });
      setGeneratedContent(result.content);
    } catch (error: any) {
      console.error('Failed to generate content:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
        title: 'Copied to Clipboard',
        description: 'The generated content has been copied.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Brand Voice Generator</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="cozy-panel">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>
              Define your brand and topic, and let AI do the writing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-description">Brand Voice</Label>
              <Textarea
                id="brand-description"
                placeholder="e.g., Confident and professional, but with a friendly tone."
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Announcing our new feature"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="marketing-email">Marketing Email</SelectItem>
                  <SelectItem value="social-media-ad">Social Media Ad</SelectItem>
                  <SelectItem value="tweet">Tweet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
                <Bot className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate Content'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="cozy-panel">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>Your AI-crafted content will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="relative min-h-[300px] bg-secondary/50 rounded-md p-4">
            {generatedContent && (
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-7 w-7" onClick={handleCopyToClipboard}>
                    <Clipboard className="h-4 w-4" />
                </Button>
            )}
            <pre className="whitespace-pre-wrap text-sm font-sans">
              {isGenerating ? <span className="text-muted-foreground animate-pulse">Generating your content...</span> : generatedContent || <span className="text-muted-foreground">Your content will appear here...</span>}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
