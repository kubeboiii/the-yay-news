import type { Metadata } from "next";
import { AdminPanel } from "@/features/admin/admin-panel";
import { gothic, serif } from "@/features/habits/fonts";
import "@/features/admin/admin.css";

export const metadata: Metadata = {
  title: "Admin · The Yay News",
  robots: { index: false, follow: false },
};

/** The emergency control (PLAN §9). Not linked from anywhere; the backend does the gatekeeping. */
export default function AdminPage() {
  return (
    <main className={`adm ${gothic.variable} ${serif.variable}`}>
      <header className="adm__head">
        <p className="adm__kicker">The Yay News</p>
        <h1 className="adm__title">Emergency desk</h1>
        <p className="adm__note">Pull a story, pull or republish an edition, or roll back.</p>
      </header>
      <AdminPanel />
    </main>
  );
}
