import LegalLayout from "../LegalLayout";
import { LEGAL_INFO } from "@/lib/legalInfo";

export const metadata = { title: "Mentions légales — AlloGaz" };

export default function MentionsLegalesPage() {
  return (
    <LegalLayout>
      <h1 className="font-display text-xl font-medium text-ink-800">Mentions légales</h1>
      <p className="text-xs text-ink-800/40">Dernière mise à jour : {LEGAL_INFO.lastUpdated}</p>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Éditeur du service</h2>
        <p>
          Le service {LEGAL_INFO.serviceName} est édité par <strong>{LEGAL_INFO.companyName}</strong>,{" "}
          {LEGAL_INFO.legalForm}, dont le siège se trouve à {LEGAL_INFO.address}.
        </p>
        <p>Contact : {LEGAL_INFO.contactEmail}</p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Activité</h2>
        <p>
          {LEGAL_INFO.serviceName} est une plateforme de mise en relation entre des vendeurs de gaz
          butane et des clients, permettant la consultation du stock disponible, la commande et
          l&apos;organisation de la livraison. {LEGAL_INFO.companyName} n&apos;est ni producteur ni
          revendeur de gaz : chaque commande est conclue directement entre le client et le vendeur
          affiché sur la plateforme, qui reste seul responsable de la qualité, de la conformité et de
          la sécurité des produits vendus et livrés.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Hébergement</h2>
        <p>
          L&apos;application est hébergée par Vercel Inc. et la base de données par Supabase Inc. Les
          données sont stockées sur l&apos;infrastructure de ces prestataires.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Propriété intellectuelle</h2>
        <p>
          Le nom {LEGAL_INFO.serviceName}, son logo et l&apos;ensemble des éléments graphiques et
          logiciels de l&apos;application sont la propriété de {LEGAL_INFO.companyName}, sauf mention
          contraire, et ne peuvent être reproduits sans autorisation préalable.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Contact</h2>
        <p>
          Pour toute question relative à ces mentions légales, tu peux nous écrire à{" "}
          {LEGAL_INFO.contactEmail}.
        </p>
      </section>
    </LegalLayout>
  );
}
