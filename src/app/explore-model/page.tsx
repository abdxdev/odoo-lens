"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ModelFieldsReview } from "@/components/explore-model/table";
import { ModelSearch } from "@/components/explore-model/search";
import { ModelDetails } from "@/components/explore-model/details";
import { ModelFields } from "@/types/fields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getTableFields } from "@/lib/fields";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function ReviewFieldsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Check for both URL parameter formats
  const modelId = searchParams.get("modelId") ? parseInt(searchParams.get("modelId")!) : undefined;
  const modelName = searchParams.get("modelName") || searchParams.get("model") || undefined;

  const [selectedModel, setSelectedModel] = useState<{ id: number; name: string } | null>(
    modelId && modelName ? { id: modelId, name: modelName } : null
  );
  const [fields, setFields] = useState<Record<string, ModelFields>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If URL params change, update the selected model
    if (modelId && modelName && (!selectedModel || selectedModel.id !== modelId)) {
      setSelectedModel({ id: modelId, name: modelName });
    }
  }, [modelId, modelName, selectedModel]);

  useEffect(() => {
    if (!selectedModel?.name) return;

    const fetchFields = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use our utility function that's similar to the Python example
        const data = await getTableFields(selectedModel.name);
        setFields(data);
      } catch (err) {
        console.error("Error fetching fields:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchFields();
  }, [selectedModel?.name]);

  const handleModelSelect = (model: { id: number; name: string }) => {
    setSelectedModel(model);

    // Update URL with the selected model information
    const params = new URLSearchParams({
      modelId: model.id.toString(),
      modelName: model.name
    });

    router.push(`/explore-model?${params.toString()}`);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex-col space-y-6"
    >
      {/* Search and Model Details in a row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={item} className="lg:col-span-1">
          <div className="h-full">
            <ModelSearch onSelectModel={handleModelSelect} />
          </div>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <div className="h-full">
            {selectedModel ? (
              <ModelDetails model={selectedModel} />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Model Details</CardTitle>
                  <CardDescription>
                    Select a model to view its details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>No model selected. Please use the search on the left to select a model.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Fields table below */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full"
      >
        {selectedModel && (
          <motion.div variants={item}>
            <ModelFieldsReview
              modelId={selectedModel.id}
              modelName={selectedModel.name}
              fields={fields}
              isLoading={isLoading}
              error={error}
            />
          </motion.div>
        )}
      </motion.div>
    </motion.main>
  );
}