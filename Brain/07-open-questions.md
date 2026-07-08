# Open Questions

## Product

- Should trainers be able to sell public program templates?
- Should nutrition tracking be macro-detailed by default or simple habit-based by default?
- Should AI nudges ever go directly to clients, or always require trainer approval?

## Business

- Will trainers pay monthly, per client, or both?
- Will clients ever pay Training Hub directly?
- Should payments be handled inside the app or through external payment links first?

## Technical

- Should wearable integrations launch in v1 or shortly after?
- Should exercise videos be hosted by Training Hub or linked from external sources?

### Answered

- Should the first backend use a managed platform or a custom API service? Answered: managed platform — Supabase (Postgres, Auth, Realtime, Storage, RLS). See DEC-010.
- Should v1 ship native apps or web-first? Answered: web-first — one Next.js app serving the trainer dashboard and a mobile-first client PWA; native apps come after the coaching loop is proven. See DEC-008.
- Should clients be allowed to use Training Hub without a trainer? Answered: yes for self-training — any client can save routines and run solo workouts (Train tab); coach-assigned work still takes precedence. A fully trainer-less *public signup* remains deferred (signup is invite-only today). See DEC-014.

## Brand

### Answered

- Should Training Hub feel more elite/performance-focused or friendly/accountability-focused? Answered: elite/performance-focused. See DEC-012.
- Should the visual identity lean dark and athletic or clean and clinical? Answered: dark and athletic — near-black surfaces, volt-green accent, bold type. See DEC-012.
