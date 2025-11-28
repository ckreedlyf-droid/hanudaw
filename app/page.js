"use client";

import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="home">
        <div className="card">
          <h1 className="title">Hanu Daw? 🎲</h1>
          <p className="subtitle">
            Pili ka ng party game. Perfect pang-couple, DGroup, barkada at family nights.
          </p>

          <div className="game-grid">
            <Link href="/hanu" className="game game-hanu">
              <div className="game-emoji">🤯</div>
              <h2>Hanu Daw?!</h2>
              <p>Taglish mashup generator. Verb + subject na sobrang sabaw.</p>
              <span className="pill">Word mashup</span>
            </Link>

            <Link href="/sorry" className="game game-sorry">
              <div className="game-emoji">🎤</div>
              <h2>Sorry What?!</h2>
              <p>Kakanta ka ng random word. Hulaan ng iba kung ano yun.</p>
              <span className="pill">Singing game</span>
            </Link>
          </div>

          <p className="footer-note">
            Tip: I-on ang sounds sa settings ng bawat game para full experience. ✨
          </p>
        </div>
      </main>

      <style jsx>{`
        .home {
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
          max-width: 640px;
          background: #fefeff;
          border-radius: 24px;
          padding: 1.8rem 1.6rem 1.4rem;
          box-shadow: 0 22px 60px rgba(148, 163, 184, 0.45);
          border: 1px solid #e4e4e7;
          text-align: center;
        }

        .title {
          margin: 0;
          font-size: 2rem;
          font-weight: 900;
        }

        .subtitle {
          margin: 0.5rem 0 1.4rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .game-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          margin-bottom: 1.2rem;
        }

        .game {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-align: left;
          padding: 1rem;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          text-decoration: none;
          color: #111827;
          transition: transform 0.12s ease, box-shadow 0.12s ease,
            border-color 0.12s ease, background 0.12s ease;
        }

        .game:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 35px rgba(148, 163, 184, 0.5);
          border-color: #fb7185;
          background: #fff7f7;
        }

        .game-emoji {
          font-size: 1.8rem;
        }

        .game h2 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
        }

        .game p {
          margin: 0;
          font-size: 0.82rem;
          color: #6b7280;
        }

        .pill {
          margin-top: 0.4rem;
          display: inline-block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: #fee2e2;
          color: #b91c1c;
        }

        .game-sorry .pill {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .footer-note {
          margin: 0;
          font-size: 0.78rem;
          color: #9ca3af;
        }

        @media (max-width: 640px) {
          .game-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
