# MijnTelewerk — accountarchitectuur MVP 0.16

## Kern
- Supabase Auth: passwordless magic link.
- `planning_years`: één cloudrecord per gebruiker/kalenderjaar.
- Auto-sync met conflictbeveiliging via `updated_at` + lokale fingerprints.
- `profiles`: taal, tijdzone en welkom-terugvoorkeuren.
- `reminder_settings`: voorkeur voor een maandelijkse in-app herinnering.

## In-app reminder
De reminder draait volledig client-side wanneer een ingelogde gebruiker MijnTelewerk opent of naar de tab terugkeert. De voorkeur en bevestigingsstatus staan in Supabase.

Ondersteunde momenten:
- specifieke dag van de maand;
- eerste werkdag van de maand;
- laatste werkdag van de maand.

De app gebruikt de standaardwerkweek en Belgische wettelijke feestdagen om de eerste/laatste werkdag te bepalen.

`last_acknowledged_period` voorkomt dubbele meldingen in dezelfde maand. `snoozed_until` ondersteunt Later herinneren.

## Bewust niet aanwezig
- Geen mailprovider.
- Geen Edge Function voor reminders.
- Geen cronjob.
- Geen pushnotificaties.


## Account recommendation (0.17)

De account-aanbeveling is bewust lokaal en niet verplicht. De gebruiker kan MijnTelewerk volledig zonder account blijven gebruiken. De browser bewaart alleen de promo-status (bezoeken, later-uitstel en niet-meer-tonen) in localStorage. Er wordt hiervoor geen profiel aangemaakt en niets naar Supabase gestuurd zolang de gebruiker niet inlogt.

## MVP 0.21 — standaard telewerkweek

`standardTeleworkWeekdays` wordt als onderdeel van de jaarpayload opgeslagen. Omdat `planning_years.settings` JSON gebruikt, is geen schema-migratie nodig.

Het standaardrooster vult uitsluitend lege AM/PM-slots binnen `workingWeekdays`. Telewerkweekdagen krijgen categorie `telework`; overige standaardwerkdagen krijgen `office`. Automatische feestdagen worden overgeslagen. Handmatige invoer heeft altijd voorrang.


## 0.23 UI-correctie
De vaste telewerkweek wordt ingesteld via een apart dialoogvenster. De snelle invulbalk behoudt alleen de twee hoofdtaken: vaste weekdag en periode.

## MVP 0.30 — verlofbudget

`leaveBudgetByYear` wordt lokaal per kalenderjaar bijgehouden. In de cloudpayload van een jaar wordt alleen `leaveBudget` van dat jaar opgenomen, waardoor budgetten voor verschillende jaren los synchroniseren.

De vaste categorie `leave` kan niet verwijderd worden. Emoji en kleur blijven aanpasbaar. Geplande halve dagen tellen telkens als 0,5 verlofdag.

De slimme verlofplanner is adviserend. Hij analyseert de standaard werkweek, wettelijke Belgische feestdagen, weekends en reeds gepland verlof. Kandidaten worden gerangschikt op het aantal aaneengesloten vrije kalenderdagen per bijkomende verlofdag. Verlof, ziekte en eigen beschermde categorieën worden niet automatisch overschreven; een suggestie wordt pas toegepast na een expliciete gebruikersactie.


## 0.30 leave planning
Bridge suggestions explicitly seed worthwhile windows around legal public holidays that fall on normal workdays. Long-leave search supports a client-side month preference filter and recalculates immediately without a submit button.


## MVP 0.32

- Slimme brugdagen toont alleen nog voorstellen die effectief een Belgische wettelijke feestdag op een normale werkdag benutten. Gewone weekendcombinaties zonder feestdag worden gefilterd.
- De tabs van de verlofplanner hergebruiken het bestaande `fill-mode` ontwerp van MijnTelewerk.
- De maandselectie bij Lang verlof hergebruikt het bestaande werkdag-selectiedesign uit de onboarding.


## MVP 0.32
De slimme verlofplanner staat permanent naast de planning op brede schermen en verhuist onder de planning op kleinere schermen. De planner is niet langer verborgen in een dialoog achter de categorie Verlof.


## UI 0.34 — Leave planner drawer
De slimme verlofplanner is een uitschuifbare rechter drawer. De drawer beïnvloedt de gridbreedte van de hoofdplanner niet en wordt niet geprint.
