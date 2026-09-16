import LegalLayout from "../LegalLayout";
import { LEGAL_INFO } from "@/lib/legalInfo";

export const metadata = { title: "Politique de cookies — AlloGaz" };

export default function CookiesPage() {
  return (
    <LegalLayout>
      <h1 className="font-display text-xl font-medium text-ink-800">Politique de cookies</h1>
      <p className="text-xs text-ink-800/40">Dernière mise à jour : {LEGAL_INFO.lastUpdated}</p>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Cookies essentiels</h2>
        <p>
          {LEGAL_INFO.serviceName} utilise des cookies et technologies similaires strictement
          nécessaires au fonctionnement du service : maintien de ta connexion (authentification
          Supabase), et mémorisation de ton choix concernant les cookies. Ces cookies ne peuvent pas
          être désactivés, sinon le service ne fonctionne plus correctement.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Cookies de mesure d&apos;audience</h2>
        <p>
          Avec ton accord, nous utilisons Google Analytics pour comprendre comment l&apos;application est
          utilisée (pages visitées, temps passé, appareil utilisé) et l&apos;améliorer. Ces cookies ne sont
          déposés qu&apos;après ton consentement, et tu peux le retirer à tout moment.
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Gérer ton choix</h2>
        <p>
          Un bandeau te permet d&apos;accepter ou de refuser les cookies de mesure d&apos;audience lors de ta
          première visite. Tu peux changer d&apos;avis à tout moment depuis ton profil, section
          « Confidentialité ».
        </p>
      </section>

      <section>
        <h2 className="font-display text-base font-medium text-ink-800">Contact</h2>
        <p>
          Pour toute question sur cette politique, écris-nous à {LEGAL_INFO.contactEmail}.
        </p>
      </section>
    </LegalLayout>
  );
}
