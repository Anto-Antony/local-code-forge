import { useWedding } from "@/contexts/WeddingContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import TemplateSidebar from "@/components/sidebar/TemplateSidebar";

const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
];

// Use import.meta.glob to import all possible template pages
const templatePages = import.meta.glob("./model_*/[user_id]/page.tsx");

export default function DynamicUserWeddingPage() {
  const { weddingData, editable, updateWeddingData } = useWedding();
  const { user_id } = useParams();
  const [TemplateComponent, setTemplateComponent] = useState<React.ComponentType | null>(null);
  const [selected, setSelected] = useState(weddingData.template || "model_1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const template = weddingData.template || "model_1";
    // Find the correct import path for the template
    const importPath = `./${template}/[user_id]/page.tsx`;
    const importFn = templatePages[importPath];
    if (importFn) {
      importFn().then((mod: any) => setTemplateComponent(() => mod.default));
    } else {
      setTemplateComponent(() => null);
    }
  }, [weddingData.template, user_id]);

  const handleSave = async () => {
    setSaving(true);
    await updateWeddingData({ template: selected });
    setSaving(false);
  };

  return (
    <SidebarProvider>
      {editable && (
       <TemplateSidebar />
      )}
      <main className="transition-all duration-300 ease-in-out">
        { !TemplateComponent ? <div>Loading...</div> : <TemplateComponent /> }
      </main>
    </SidebarProvider>
  );
}
