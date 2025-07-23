import { useWedding } from "@/contexts/WeddingContext";

const templates = [
  { value: "model_1", label: "Classic" },
  { value: "model_2", label: "Modern" },
];

export default function TemplateSelector() {
  const { weddingData, updateWeddingData } = useWedding();

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>Choose Template:</label>
      <select
        value={weddingData.template || "model_1"}
        onChange={e => updateWeddingData({ template: e.target.value })}
      >
        {templates.map(t => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </div>
  );
}
