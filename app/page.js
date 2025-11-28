"use client";

import Link from "next/link";

export default function ModeSelector() {
  return (
    <>
      <main className="page">
        <div className="card">
          <h1>Party Game Picker 🎉</h1>
          <p className="subtitle">
            Pili ng game tapos sabog tawa na. Perfect pang-couple, barkada,
            at DGroup icebreaker.
          </p>

          <div className="buttons">
            <Link href="/hanu" className="mode-btn hanu">
              <span className="mode-title">Hanu Daw?! 🤯</span>
              <span className="mode-desc">
                Taglish mashup – verb + subject = kalat na sentence.
              </span>
            </Link>

            <Link href="/sorry" className="mode-btn sorry">
              <span className="mode-title">Sorry What?! 🎧</span>
              <span className="mode-desc">
                Pa-music, pa-headset, hulaan ang salitang kinakanta.
              </span>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background:
            radial-gradient(circle at top left, #fee2e2, transparent 55%),
            radial-gradient(circle at bottom right, #bfdbfe, transparent 55%),
            #fefce8;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: 26px;
          padding: 1.8rem 1.5rem 1.6rem;
          box-shadow: 0 20px 55px rgba(148, 163, 184, 0.6);
          border: 1px solid #e5e7eb;
        }

        h1 {
          margin: 0 0 0.4rem;
          font-size: 1.9rem;
          font-weight: 900;
        }

        .subtitle {
          margin: 0 0 1.3rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .mode-btn {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-decoration: none;
          padding: 0.9rem 1rem;
          border-radius: 1rem;
          color: #111827;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            background 0.12s ease;
        }

        .mode-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 35px rgba(148, 163, 184, 0.45);
          background: #ffffff;
        }

        .mode-title {
          font-weight: 800;
          font-size: 1.05rem;
        }

        .mode-desc {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .mode-btn.hanu {
          border-color: #fb923c;
          background: linear-gradient(
            135deg,
            rgba(248, 113, 113, 0.15),
            rgba(251, 146, 60, 0.15)
          );
        }

        .mode-btn.sorry {
          border-color: #a855f7;
          background: linear-gradient(
            135deg,
            rgba(129, 140, 248, 0.15),
            rgba(244, 114, 182, 0.15)
          );
        }

        @media (max-width: 640px) {
          .card {
            padding: 1.6rem 1.3rem 1.4rem;
          }
        }
      `}</style>
    </>
  );
}
