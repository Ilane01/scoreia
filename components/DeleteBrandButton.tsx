"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteBrandButton({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const cancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(false);
  };

  const confirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("brands").delete().eq("id", brandId);
    router.refresh();
    setShowModal(false);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={open}
        title="Supprimer la marque"
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50"
        style={{ color: "var(--text-3)" }}
      >
        <Trash2 size={13} />
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}
          onClick={cancel}
        >
          <div
            className="rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.15)" }}>
              <Trash2 size={18} style={{ color: "#dc2626" }} />
            </div>
            <h2 className="text-base font-bold mb-1" style={{ color: "var(--text)" }}>
              Supprimer « {brandName} » ?
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
              Toutes les analyses et données associées seront définitivement supprimées. Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancel}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
                style={{ background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }}
              >
                Annuler
              </button>
              <button
                onClick={confirm}
                disabled={loading}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ background: "#dc2626" }}
              >
                {loading ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
