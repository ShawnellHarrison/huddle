'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { snapToAddLead } from '@/ai/flows/snap-to-add-lead';
import { Camera, Zap, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SnapToAddPage() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<{ clientName: string; clientEmail: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if(context) {
          context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
          const dataUri = canvas.toDataURL('image/jpeg');
          setCapturedImage(dataUri);
          setProcessingResult(null);
      }
    }
  };

  const handleProcessImage = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    try {
      const result = await snapToAddLead({ photoDataUri: capturedImage });
      if (result && result.clientName) {
        setProcessingResult(result);
        toast({
          title: 'Lead Identified!',
          description: `Added "${result.clientName}" as a new lead.`,
        });
      } else {
         throw new Error('Could not identify a business in the image.');
      }
    } catch (error: any) {
      console.error('Failed to process image:', error);
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: error.message || 'Could not extract lead details from the image.',
      });
      setProcessingResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setProcessingResult(null);
  };
  
  const handleGoToCrm = () => {
    router.push('/crm');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Snap-to-Add Lead</h1>
      </div>
      <Card className="cozy-panel max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Lead Capture</CardTitle>
          <CardDescription>Point your camera at a storefront to instantly create a new lead.</CardDescription>
        </CardHeader>
        <CardContent>
          {hasCameraPermission === false && (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser settings to use this feature. You may need to refresh the page after granting permission.
                </AlertDescription>
            </Alert>
          )}

          <div className="relative w-full aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className={`w-full h-full object-cover ${capturedImage ? 'hidden' : 'block'}`} autoPlay playsInline muted />
            {capturedImage && (
                <img src={capturedImage} alt="Captured storefront" className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden"></canvas>
            {hasCameraPermission === null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <Camera className="h-12 w-12 text-white/50 animate-pulse" />
                    <p className="text-white/80 mt-2">Requesting camera access...</p>
                </div>
            )}
          </div>

          {processingResult && (
            <Alert className="mt-4 bg-green-500/10 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-600 dark:text-green-400">Lead Created Successfully!</AlertTitle>
                <AlertDescription>
                    <p><b>Name:</b> {processingResult.clientName}</p>
                    <p><b>Email:</b> {processingResult.clientEmail || 'Not found'}</p>
                </AlertDescription>
            </Alert>
          )}

        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
            {!capturedImage ? (
                 <Button className="w-full" onClick={handleCapture} disabled={!hasCameraPermission}>
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                </Button>
            ) : processingResult ? (
                <>
                    <Button variant="outline" className="w-full" onClick={handleRetake}>Snap Another</Button>
                    <Button className="w-full" onClick={handleGoToCrm}>View in CRM</Button>
                </>
            ) : (
                <>
                    <Button variant="outline" className="w-full" onClick={handleRetake} disabled={isProcessing}>
                        Retake
                    </Button>
                    <Button className="w-full" onClick={handleProcessImage} disabled={isProcessing}>
                        <Zap className={`mr-2 h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                        {isProcessing ? 'Analyzing...' : 'Create Lead'}
                    </Button>
                </>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
