import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité — ScoreIA" };

export default function Privacy() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Mise à jour : juin 2025 · Conforme RGPD</p>

      <h2>1. Responsable du traitement</h2>
      <p>
        Ilane Boucobza — ScoreIA<br />
        Email : <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a>
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
      <ul>
        <li><strong>Données de compte</strong> : adresse email, mot de passe (hashé, jamais en clair)</li>
        <li><strong>Données de marque</strong> : nom, secteur, mots-clés, URL, concurrents, contexte que vous renseignez</li>
        <li><strong>Données d&apos;usage</strong> : analyses lancées, scores obtenus, articles générés</li>
        <li><strong>Données de paiement</strong> : traitées exclusivement par Stripe — nous ne stockons aucune coordonnée bancaire</li>
        <li><strong>Données de navigation</strong> : logs d&apos;accès anonymisés (IP, navigateur, pages visitées)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Fourniture du service ScoreIA (analyse, score, recommandations)</li>
        <li>Gestion de votre compte et de votre abonnement</li>
        <li>Support client et communication relative au service</li>
        <li>Amélioration du service (analytics agrégés et anonymisés)</li>
        <li>Respect de nos obligations légales et comptables</li>
      </ul>

      <h2>4. Base légale</h2>
      <ul>
        <li><strong>Exécution du contrat</strong> : données nécessaires à la fourniture du service</li>
        <li><strong>Intérêt légitime</strong> : amélioration du service, sécurité</li>
        <li><strong>Consentement</strong> : communications marketing (opt-in)</li>
        <li><strong>Obligation légale</strong> : facturation, comptabilité</li>
      </ul>

      <h2>5. Sous-traitants</h2>
      <p>Nous faisons appel aux sous-traitants suivants, tous conformes au RGPD :</p>
      <ul>
        <li><strong>Supabase</strong> (base de données et authentification) — USA, clauses contractuelles types</li>
        <li><strong>Vercel</strong> (hébergement) — USA, clauses contractuelles types</li>
        <li><strong>Stripe</strong> (paiement) — USA, clauses contractuelles types</li>
        <li><strong>OpenAI / Anthropic / Google / Perplexity</strong> (modèles IA) — données de marque uniquement, sans données personnelles</li>
      </ul>

      <h2>6. Durée de conservation</h2>
      <ul>
        <li>Données de compte : jusqu&apos;à suppression du compte + 3 ans (obligations légales)</li>
        <li>Données d&apos;analyse : pendant la durée d&apos;utilisation du service</li>
        <li>Données de facturation : 10 ans (obligation comptable)</li>
        <li>Logs de navigation : 12 mois</li>
      </ul>

      <h2>7. Vos droits (RGPD)</h2>
      <p>Conformément au RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
        <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
        <li><strong>Droit à l&apos;effacement</strong> : supprimer votre compte et vos données</li>
        <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
        <li><strong>Droit d&apos;opposition</strong> : vous opposer à certains traitements</li>
        <li><strong>Droit à la limitation</strong> : limiter le traitement dans certains cas</li>
      </ul>
      <p>
        Pour exercer ces droits : <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a><br />
        Vous pouvez également introduire une réclamation auprès de la{" "}
        <a href="https://www.cnil.fr" style={{ color: "#a78bfa" }}>CNIL</a>.
      </p>

      <h2>8. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
        vos données : chiffrement TLS, authentification sécurisée, accès restreint aux données,
        mots de passe hashés (bcrypt via Supabase Auth).
      </p>

      <h2>9. Cookies</h2>
      <p>
        ScoreIA utilise uniquement des cookies strictement nécessaires au fonctionnement du service
        (session d&apos;authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé
        sans votre consentement.
      </p>

      <h2>10. Modifications</h2>
      <p>
        Cette politique peut être mise à jour. Vous serez informé par email de tout changement
        significatif. La date de mise à jour est indiquée en en-tête.
      </p>

      <h2>11. Contact DPO</h2>
      <p>
        Pour toute question relative à vos données personnelles :{" "}
        <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a>
      </p>
    </>
  );
}
