import { useWedding } from "@/contexts/WeddingContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import TemplateSidebar from "@/components/sidebar/TemplateSidebar";

const templates = [
  { key: "model_1", label: "Template 1", preview: "/placeholder.svg" },
  { key: "model_2", label: "Template 2", preview: "/placeholder.svg" },
];

export default function DynamicUserWeddingPage() {
  const { weddingData, editable, updateWeddingData } = useWedding();
  const { user_id } = useParams();
  const [TemplateComponent, setTemplateComponent] = useState<React.ComponentType | null>(null);
  const [selected, setSelected] = useState(weddingData.template || "model_1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const template = weddingData.template || "model_1";
    import(`./${template}/[user_id]/page`).then(mod => setTemplateComponent(() => mod.default));
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
