"use client";

import { useAppStore } from "@/store/useAppStore";
import { FileUpload } from "@/components/features/FileUpload";
import { JobInput } from "@/components/features/JobInput";
import { AnalysisDashboard } from "@/components/features/AnalysisDashboard";
import { AuthenticityWizard } from "@/components/features/AuthenticityWizard";
import { RecommendationEngine } from "@/components/features/RecommendationEngine";
import { ExportPreview } from "@/components/features/ExportPreview";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const wizardStep = useAppStore((state) => state.wizardStep);
  const setWizardStep = useAppStore((state) => state.setWizardStep);
  const resumeText = useAppStore((state) => state.resumeText);
  const jobDescription = useAppStore((state) => state.jobDescription);
  const setAnalysisResult = useAppStore((state) => state.setAnalysisResult);
  const isAnalyzing = useAppStore((state) => state.isAnalyzing);
  const setIsAnalyzing = useAppStore((state) => state.setIsAnalyzing);

  const canAnalyze = resumeText.length > 50 && jobDescription.length > 50;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json();
      setAnalysisResult(data);
      setWizardStep("analysis"); // Move to dashboard
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-center pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Resume Optimizer V2</h1>
          <p className="text-muted-foreground">AI-Driven Resume Customization</p>
        </div>
        <div className="flex gap-2">
          {['upload', 'analysis', 'wizard', 'recommendations', 'export'].map((step, idx) => (
            <div key={step} className={cn(
              "h-2 w-8 rounded-full transition-colors",
              wizardStep === step || ['upload', 'analysis', 'wizard', 'recommendations', 'export'].indexOf(wizardStep) > idx ? "bg-primary" : "bg-muted"
            )} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {wizardStep === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">1. Upload Resume</h2>
                <FileUpload />
              </section>
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">2. Job Description</h2>
                <JobInput />
              </section>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="w-full md:w-auto min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner className="mr-2 h-5 w-5" /> Analyzing...
                  </>
                ) : (
                  "Analyze Gaps & Optimize"
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {wizardStep === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <AnalysisDashboard />

            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setWizardStep('upload')}>Back</Button>
              <Button onClick={() => setWizardStep('wizard')}>Start Authenticity Check</Button>
            </div>
          </motion.div>
        )}

        {wizardStep === "wizard" && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <AuthenticityWizard />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setWizardStep('analysis')}>Back</Button>
              <Button onClick={() => setWizardStep('recommendations')}>Continue to Recommendations</Button>
            </div>
          </motion.div>
        )}

        {wizardStep === "recommendations" && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <RecommendationEngine />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setWizardStep('wizard')}>Back</Button>
            </div>
          </motion.div>
        )}

        {wizardStep === "export" && (
          <motion.div
            key="export"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <ExportPreview />

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setWizardStep('recommendations')}>Back to Recommendations</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
