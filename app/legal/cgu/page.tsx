import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions Générales d'Utilisation — ScoreIA" };

export default function CGU() {
  return (
    <>
      <h1>Conditions Générales d&apos;Utilisation</h1>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Mise à jour : juin 2025</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation de la
        plateforme ScoreIA, accessible à l&apos;adresse scoreia.fr, éditée par Ilane Boucobza.
      </p>

      <h2>2. Acceptation</h2>
      <p>
        L&apos;utilisation de ScoreIA implique l&apos;acceptation pleine et entière des présentes CGU. Si vous
        n&apos;acceptez pas ces conditions, veuillez ne pas utiliser le service.
      </p>

      <h2>3. Description du service</h2>
      <p>
        ScoreIA est un outil SaaS de Generative Engine Optimization (GEO) permettant de :
      </p>
      <ul>
        <li>Mesurer la visibilité d&apos;une marque dans les réponses des IA génératives (ChatGPT, Gemini, Claude, Perplexity)</li>
        <li>Obtenir un score de visibilité de 0 à 100</li>
        <li>Recevoir des recommandations de contenu personnalisées (plan payant)</li>
        <li>Générer des articles optimisés pour les IA (plan payant)</li>
        <li>Suivre l&apos;évolution du score dans le temps</li>
      </ul>

      <h2>4. Inscription et compte</h2>
      <p>
        L&apos;accès au service nécessite la création d&apos;un compte. L&apos;utilisateur s&apos;engage à fournir des
        informations exactes et à maintenir la confidentialité de ses identifiants. Tout accès
        frauduleux ou non autorisé est strictement interdit.
      </p>

      <h2>5. Plans et facturation</h2>
      <p>
        ScoreIA propose plusieurs plans tarifaires :
      </p>
      <ul>
        <li><strong>Plan Gratuit</strong> : score IA + analyse complète, sans limite de durée</li>
        <li><strong>Plan Starter (89€/mois)</strong> : accès au plan de contenu et à la génération d&apos;articles</li>
        <li><strong>Plan Agency (249€/mois)</strong> : jusqu&apos;à 10 marques, rapports white-label</li>
      </ul>
      <p>
        Les plans payants sont facturés mensuellement ou annuellement via Stripe. L&apos;abonnement est
        résiliable à tout moment depuis le dashboard, sans frais ni pénalité.
      </p>

      <h2>6. Essai gratuit</h2>
      <p>
        Les plans payants bénéficient d&apos;un essai gratuit de 14 jours sans engagement. Aucune carte
        bancaire n&apos;est requise pour démarrer l&apos;essai. À l&apos;issue de la période d&apos;essai, le compte bascule
        automatiquement sur le plan Gratuit sauf souscription active.
      </p>

      <h2>7. Données et résultats</h2>
      <p>
        Les scores et analyses produits par ScoreIA sont générés en interrogeant des modèles d&apos;IA
        tiers (OpenAI, Anthropic, Google, Perplexity). Ces résultats sont fournis à titre indicatif.
        ScoreIA ne peut garantir leur exhaustivité, leur exactitude ni leur permanence dans le temps,
        les réponses des IA étant par nature variables.
      </p>

      <h2>8. Propriété des données</h2>
      <p>
        L&apos;utilisateur conserve l&apos;entière propriété des données qu&apos;il renseigne (nom de marque,
        mots-clés, contexte). ScoreIA ne revend pas les données utilisateurs à des tiers.
      </p>

      <h2>9. Utilisation acceptable</h2>
      <p>Il est interdit d&apos;utiliser ScoreIA pour :</p>
      <ul>
        <li>Analyser des marques dont vous n&apos;êtes pas propriétaire ou représentant autorisé</li>
        <li>Tenter de contourner les mécanismes de sécurité du service</li>
        <li>Effectuer des requêtes automatisées massives (scraping, bots)</li>
        <li>Tout usage illégal ou contraire aux lois en vigueur</li>
      </ul>

      <h2>10. Suspension et résiliation</h2>
      <p>
        ScoreIA se réserve le droit de suspendre ou résilier tout compte en cas de violation des
        présentes CGU, sans préavis ni remboursement.
      </p>

      <h2>11. Limitation de responsabilité</h2>
      <p>
        ScoreIA ne saurait être tenu responsable des décisions commerciales prises sur la base
        des analyses fournies. La responsabilité de ScoreIA est limitée au montant des sommes
        effectivement payées par l&apos;utilisateur au cours des 12 derniers mois.
      </p>

      <h2>12. Modifications des CGU</h2>
      <p>
        ScoreIA se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs
        seront informés par email de toute modification substantielle.
      </p>

      <h2>13. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux
        compétents sont ceux de Paris.
      </p>

      <h2>14. Contact</h2>
      <p>
        Pour toute question : <a href="mailto:hello@scoreia.fr" style={{ color: "#a78bfa" }}>hello@scoreia.fr</a>
      </p>
    </>
  );
}
