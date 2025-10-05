import React from "react";
import { Helmet } from "react-helmet-async";

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Mentions légales & CGU - CasaDividendes</title>
        <meta name="description" content="Consultez les mentions légales et conditions générales d'utilisation de CasaDividendes." />
      </Helmet>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-white text-2xl font-bold">Mentions légales & CGU</h1>
        <div className="mt-4 space-y-6 text-sm text-zinc-300 leading-6">
          <section>
            <h2 className="text-white font-semibold">Mentions légales</h2>
            <p>Éditeur : CasaDividendes • Directeur de publication • Hébergeur : o2switch • © CasaDividendes.</p>
          </section>
          <section>
            <h2 className="text-white font-semibold">CGU</h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>Objet & acceptation</li>
              <li>Accès au service</li>
              <li>Abonnements : gratuit / premium</li>
              <li>Sources & limites (pas de conseil d&apos;investissement)</li>
              <li>Disponibilité & responsabilité</li>
              <li>Résiliation • Loi applicable</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
