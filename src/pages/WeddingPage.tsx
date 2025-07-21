import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWedding } from "@/contexts/WeddingContext";
import { supabase } from "@/integrations/supabase/client";
import { deepMerge } from "@/lib/utils";
import { defaultWeddingData, defaultWeddingWish } from "@/contexts/WeddingProvider";
import type { WebEntry, WeddingData, WeddingWishType } from "@/types/wedding";

// Placeholder components
const EditableWeddingPage = () => <div>Editable Wedding Page (Owner)</div>;
const ViewingWeddingPage = () => <div>Viewing Wedding Page (Guest)</div>;

const WeddingPage = () => {
  const { user_id, slug } = useParams();
  const {
    user,
    setWeddingData,
    setWeddingWishes,
    setEditable,
    globalIsLoading,
  } = useWedding() as any;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWedding = async () => {
      setLoading(true);
      let query = supabase.from("web_entries").select("user_id, web_data, wishes");
      if (user_id) query = query.eq("user_id", user_id);
      if (slug) query = query.eq("slug", slug);
      const { data, error } = await query.maybeSingle();
      if (error || !data) {
        setLoading(false);
        return;
      }
      setWeddingData(deepMerge(defaultWeddingData, data.web_data || {}));
      setWeddingWishes((data.wishes || []).map((wish: any) => deepMerge(defaultWeddingWish, wish)));
      setEditable(user && user.id === data.user_id);
      setLoading(false);
    };
    fetchWedding();
  }, [user_id, slug, user, setWeddingData, setWeddingWishes, setEditable]);

  if (loading || globalIsLoading) return <div>Loading...</div>;
  // Render editable or read-only UI based on context.editable
  // ...
};

export default WeddingPage; 