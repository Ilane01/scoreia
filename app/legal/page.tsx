import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales — ScoreIA" };

export default function MentionsLegales() {
  return (
    <>
      <h1>Mentions légales</h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Mise à jour : juin 2025</p>

      <h2>Éditeur du site</h2>
      <p>
        ScoreIA est édité par une entreprise individuelle en cours d&apos;immatriculation.<br />
        Email de contact : <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a>
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par <strong>Vercel Inc.</strong><br />
        440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
        <a href="https://vercel.com" style={{ color: "#a78bfa" }}>vercel.com</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Ilane Boucobza</p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu du site ScoreIA (textes, images, logos, code) est protégé par le droit d&apos;auteur.
        Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.
      </p>

      <h2>Responsabilité</h2>
      <p>
        ScoreIA s&apos;efforce de maintenir des informations exactes et à jour, mais ne peut garantir l&apos;exactitude,
        l&apos;exhaustivité ou l&apos;actualité des informations diffusées. Les résultats des analyses IA sont fournis
        à titre indicatif et dépendent des modèles tiers (OpenAI, Anthropic, Google, Perplexity).
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        ScoreIA peut contenir des liens vers des sites tiers. Nous déclinons toute responsabilité quant
        au contenu de ces sites.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative aux présentes mentions légales :{" "}
        <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a>
      </p>
    </>
  );
}
