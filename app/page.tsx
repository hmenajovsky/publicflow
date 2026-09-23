export default function Home() {
  return (
    <main className="min-h-screen p-8 sm:p-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">PublicFlow</h1>

        <p className="mt-4 text-lg text-gray-600">
          Application pédagogique permettant de consulter des dispositifs
          d&apos;accompagnement public et de déposer des demandes.
        </p>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Workshop développement avec l&apos;IA</h2>

          <p className="mt-4 text-gray-600">
            Ce projet sert de support pour expérimenter le développement
            assisté par un agent IA.
          </p>

          <p className="mt-4 text-gray-600">
            Les fonctionnalités seront construites progressivement à partir
            de User Stories.
          </p>
        </section>

        <section className="mt-12 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Démarche</h2>

          <p className="mt-3 font-medium">
            Contexte → User Story → Agent → Test → Observation → Itération → Validation
          </p>
        </section>
      </div>
    </main>
  );
}
