import LegalLayout from "../LegalLayout";
import { LEGAL_INFO } from "@/lib/legalInfo";

export const metadata = { title: "Politique de confidentialité — AlloGaz" };

export default function ConfidentialitePage() {
  return (
    <LegalLayout>
      <h1 className="font-display text-xl font-medium text-ink-800">Politique de confidentialité</h1>
      <p className="text-xs text-ink-800/40">Dernière mise à jour : {LEGAL_INFO.lastUpdated}</p>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Qui traite tes données ?</h2>
        <p>
          {LEGAL_INFO.companyName} ({LEGAL_INFO.legalForm}), éditeur de {LEGAL_INFO.serviceName},
          traite les données décrites ci-dessous pour faire fonctionner le service. Contact :{" "}
          {LEGAL_INFO.contactEmail}.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Données collectées</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Identité : nom, numéro de téléphone, adresse email.</li>
          <li>Localisation : ville, quartier, coordonnées GPS (uniquement si tu les partages).</li>
          <li>Données de commande : historique, montants, produits, méthode de paiement choisie.</li>
          <li>
            Pour les vendeurs : nom du commerce, stock, horaires, et photo/logo si tu choisis d&apos;en
            ajouter un.
          </li>
          <li>Données techniques : type d&apos;appareil, et si tu l&apos;acceptes, données de mesure d&apos;audience.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Pourquoi on les utilise</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Créer ton compte et te connecter aux vendeurs ou clients pertinents.</li>
          <li>Traiter et suivre tes commandes.</li>
          <li>T&apos;envoyer des notifications utiles, par exemple un rappel quand ton gaz doit bientôt finir.</li>
          <li>Améliorer le service et mesurer son usage (si tu as accepté les cookies de mesure d&apos;audience).</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Partage des données</h2>
        <p>
          Tes données de commande (nom, téléphone, adresse) sont partagées avec le vendeur concerné,
          uniquement pour permettre la livraison. Nous ne vendons aucune donnée à des tiers. Certaines
          données techniques peuvent être partagées avec Google Analytics si tu as accepté les cookies
          de mesure d&apos;audience.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Durée de conservation</h2>
        <p>
          Tes données sont conservées tant que ton compte est actif. Tu peux demander la suppression de
          ton compte et de tes données à tout moment en nous écrivant.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Tes droits</h2>
        <p>
          Tu peux à tout moment demander l&apos;accès, la correction ou la suppression de tes données en
          écrivant à {LEGAL_INFO.contactEmail}.
        </p>
      </section>
    </LegalLayout>
  );
}
