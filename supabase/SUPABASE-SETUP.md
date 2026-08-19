# MijnTelewerk — Supabase koppelen (MVP 0.15)

Deze handleiding activeert alleen de eerste online laag: **account + magic-link login + cloudopslag + synchronisatie**. De planner blijft zonder account lokaal werken.

## 1. Maak een Supabase-project

1. Log in op Supabase en maak een nieuw project.
2. Kies een projectnaam, bijvoorbeeld `mijntelewerk`.
3. Kies voor de database bij voorkeur een Europese regio.
4. Bewaar het databasewachtwoord veilig; dit wachtwoord hoort **niet** in de websitecode.

## 2. Installeer het MijnTelewerk-datamodel

1. Open in het Supabase Dashboard **SQL Editor**.
2. Open lokaal `supabase/schema.sql` uit deze MVP.
3. Kopieer de volledige inhoud naar een nieuwe query.
4. Klik **Run**.

Het script maakt:

- `profiles`
- `planning_years`
- `reminder_settings`
- `updated_at` triggers
- Row Level Security (RLS) policies

De RLS-policies zorgen ervoor dat een ingelogde gebruiker alleen rijen met zijn eigen `user_id` kan lezen/wijzigen.

## 3. Haal de browsergegevens op

Zoek in het project de **Connect**-dialoog of **Settings → API Keys** en kopieer:

- **Project URL**
- **Publishable key** (`sb_publishable_...`)

Gebruik in nieuwe projecten de Publishable key. Een legacy `anon` key werkt ook nog, maar is alleen als fallback voorzien.

**Nooit gebruiken in `config.js`:**

- Secret key (`sb_secret_...`)
- `service_role` key

Die hebben verhoogde rechten en horen alleen op een beveiligde backend/server.

## 4. Vul `config.js` in

Open `config.js` en vul je eigen waarden in:

```js
window.MIJNTELEWERK_CONFIG = {
  SUPABASE_URL: 'https://jouw-project.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_jouw_key',
  SUPABASE_ANON_KEY: ''
};
```

## 5. Configureer Magic Link redirects

Ga in Supabase naar **Authentication → URL Configuration**.

Voor lokaal testen kun je bijvoorbeeld gebruiken:

- Site URL: `http://localhost:8080`
- Redirect URL: `http://localhost:8080/**`

Later, wanneer `mijntelewerk.be` live staat:

- Site URL: `https://mijntelewerk.be`
- Production redirect: liefst de exacte productie-URL, bijvoorbeeld `https://mijntelewerk.be/`
- Voeg eventueel `https://www.mijntelewerk.be/` toe als je ook `www` gebruikt.

Magic Link e-mailauthenticatie is bij Supabase standaard beschikbaar. De app gebruikt `signInWithOtp`, dat standaard een Magic Link verzendt.

## 6. Start de app via HTTP

Open de app voor Auth-tests niet rechtstreeks als `file://`.

Open een terminal in de map van MVP 0.15 en start bijvoorbeeld:

```bash
python -m http.server 8080
```

Open daarna in de browser:

```text
http://localhost:8080/
```

Alternatieven zijn VS Code Live Server of een andere eenvoudige statische webserver.

## 7. Test de login

1. Klik rechtsboven op **Account**.
2. Vul je e-mailadres in.
3. Klik **Stuur magic link**.
4. Open de e-mail en klik de magic link.
5. Je komt terug op MijnTelewerk en de Account-knop moet aangeven dat je bent ingelogd.

Een nieuw e-mailadres wordt standaard automatisch als nieuwe gebruiker aangemaakt.

## 8. Test synchronisatie

### Eerste toestel

1. Vul enkele telewerk- en kantoordagen in.
2. Open **Account**.
3. Kies **Upload huidig jaar**.
4. De jaarplanning wordt opgeslagen in `planning_years`.
5. Auto-sync wordt daarna aangezet.

### Tweede browser of toestel

1. Open dezelfde website.
2. Log in met hetzelfde e-mailadres.
3. Open **Account**.
4. Kies **Laad uit cloud**.
5. Bevestig dat de lokale planning vervangen mag worden.

Voor een download maakt MijnTelewerk eerst een lokale backup.

## 9. Wat wordt nu gesynchroniseerd?

Per kalenderjaar:

- maximum telewerkpercentage
- categorieën en eigen emoji's
- kalenderdagen, inclusief halve dagen
- gekozen taal
- automatische feestdagen aan/uit
- standaard werkdagen uit de onboarding
- verwijderde standaardcategorieën

## 10. Eerste onboarding in MVP 0.11

Bij het eerste bezoek verschijnt een dialoog boven een vervaagde planner met drie vragen:

1. maximum telewerkpercentage;
2. normale werkdagen;
3. Belgische feestdagen automatisch tonen of niet.

De instellingen zijn later opnieuw te openen via de `?`-uitlegknop → **Basisinstellingen aanpassen**.

De normale werkdagen worden ook gebruikt door de snelle periode-invoer: wanneer **Niet-werkdagen overslaan** actief is, worden dagen buiten de ingestelde werkweek niet ingevuld.

## 11. Wat nog niet live is

Nog niet gekoppeld:

- herinneringsmails;
- custom SMTP/e-mailprovider;
- account verwijderen;
- wachtwoord/login via Google/Microsoft;
- MijnTelewerk Plus/betalingen;
- server-side welkom-terugdetectie.

Die onderdelen kunnen na een geslaagde account- en synchronisatietest worden toegevoegd.


## MVP 0.15: accountinstellingen upgraden

Als je database al werkt vanuit MVP 0.14, hoef je `schema.sql` niet opnieuw vanaf nul uit te voeren. Open **Supabase → SQL Editor** en voer één keer uit:

```text
supabase/migration-0.15.sql
```

Dit voegt velden toe voor taal, welkom-terugvoorkeuren en de maandmodus van herinneringen. Bestaande planningen blijven behouden.

Na de migratie kun je in **Account** de instellingen bewaren. Alleen het opslaan vereist nog geen mailprovider. Voor de echte verzending volg je `supabase/REMINDERS-SETUP.md`.


## Upgrade naar MVP 0.16
Voer `supabase/migration-0.16.sql` één keer uit. Herinneringen zijn vanaf deze versie in-app pop-ups; e-mailinfrastructuur is niet nodig.
