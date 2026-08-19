# MijnTelewerk MVP 0.25

Herstelrelease na 0.21.

## Opgelost
- Jaaroverzicht werkt opnieuw.
- Printscope en printlabels hersteld.
- Vierstappen-onboarding kan opnieuw volledig doorlopen worden.
- De vaste telewerkweek staat niet langer als derde tab in de smalle zijbalk.
- Nieuwe compacte knop **Vaste telewerkdagen** opent een apart dialoogvenster.
- Standaardrooster vult alleen lege dagdelen en overschrijft bestaande planning niet.
- Supabase/cloudsync van `standardTeleworkWeekdays` blijft behouden.

Geen nieuwe SQL-migratie nodig.

## Nieuw in MVP 0.24

- `Standaard telewerkweek` staat boven `Vaste weekdag` en `Periode` voor een duidelijkere hiërarchie.
- Telewerk en Kantoor behouden hun vaste naam en rekentype, maar emoji en kleur zijn nu aanpasbaar via het potlood-icoon.
- De resterende telewerkruimte staat permanent zichtbaar in het grotere vak `Telewerkdagen` in plaats van alleen als hover-uitleg.
- Dubbele browser/website-tooltips op legenda-items zijn verwijderd.
- Geen SQL-migratie nodig.


## MVP 0.24

- Standaard telewerkweek kan opnieuw worden toegepast nadat vaste telewerkdagen wijzigen.
- Bij hernieuwd toepassen worden alleen lege velden en bestaande Telewerk/Kantoor-velden aangepast; Verlof, Ziek, feestdagen en eigen categorieën blijven behouden.
- Wettelijke feestdagen worden door de standaardweek altijd overgeslagen, ook wanneer automatische feestdagen verborgen zijn.
- Dark/light-mode melding staat rechtstreeks onder Account, Dark mode en taalkeuze.
- Emoji's blijven bewust uit de kalendercellen om de maandplanning rustig en goed leesbaar te houden.


## MVP 0.25

- Bugfix: Standaard telewerkweek kan opnieuw worden toegepast nadat vaste telewerkdagen wijzigen. Bestaande Telewerk/Kantoor-dagdelen worden opnieuw afgestemd; Verlof, Ziek, feestdagen en eigen categorieën blijven beschermd.
- Dark/light-mode melding verschijnt onder Account, Dark mode en taalkeuze.
- Emoji's blijven bewust uit de kalendercellen om visuele drukte te vermijden.
- Maandtotaal is omgevormd tot een compacte horizontale strook met kleine chips.
- Geen SQL-migratie nodig.


## MVP 0.27

- `Maandtotaal` is geen apart blok meer onder de planner.
- Een compacte knop `Maandtotaal` in de planning-header opent een apart venster met de totalen van de geselecteerde maand.
- De maandtotalen nemen daardoor geen permanente verticale ruimte meer in en blijven automatisch buiten print/PDF.
- De standaard telewerkweek kan opnieuw worden toegepast nadat vaste telewerkdagen wijzigen; alleen Telewerk/Kantoor en lege velden worden afgestemd.
- Dark/light-mode melding blijft onder Account, Dark mode en taalkeuze.
- Emoji's blijven bewust uit de kalendercellen voor een rustigere planner.
- Geen SQL-migratie nodig.


## MVP 0.27

- Maandtotaal is nu een visueel aangehechte tab linksonder aan de planner.
- De tab gebruikt dezelfde kaart-, rand- en accentstijl als de planner en neemt geen vaste inhoudsruimte in.
- De tab verdwijnt in Jaaroverzicht en in de printweergave.


## MVP 0.30 — Verlofbudget
- Verlof is een vaste standaardcategorie en kan niet meer verwijderd worden.
- Emoji en kleur blijven aanpasbaar.
- Optioneel verlofbudget per kalenderjaar, inclusief halve dagen.
- Legenda toont gepland / budget / resterend of overschrijding.
- Overschrijding waarschuwt maar blokkeert niet.
- Slimme verlofplanner zoekt kansen rond weekends en Belgische wettelijke feestdagen op basis van vrije kalenderdagen per extra verlofdag.
- Suggesties worden alleen na expliciete keuze ingepland.
- Verlofbudget synchroniseert in het bestaande jaar-JSON; geen SQL-migratie nodig.


## Nieuw in MVP 0.30

- De slimme verlofplanner heeft nu twee modi: **Slimme brugdagen** en **Lang verlof**.
- Bij Lang verlof kiest de gebruiker hoeveel weken hij/zij aaneengesloten echt vrij wil zijn (standaard 2 weken).
- De planner zoekt de gunstigste periodes op basis van weekends, Belgische feestdagen, bestaande planning en het resterende verlofbudget.
- Een optionele telewerkberekening toont apart hoe lang de gebruiker niet naar kantoor hoeft dankzij aansluitende telewerkdagen. Telewerk telt nooit als verlof of echte vrije tijd.
- Een voorstel wordt alleen ingepland nadat de gebruiker expliciet op **Plan dit voorstel** klikt.


## MVP 0.30
- Slimme brugdagen geeft wettelijke feestdagen op werkdagen expliciet voorrang, waaronder 11 november (Wapenstilstand).
- Lang verlof filtert automatisch tijdens invoer; de overbodige zoekknop is verwijderd.
- Lang verlof kan worden beperkt tot één of meerdere voorkeursmaanden.
- Verlofplanner-tabs zijn visueel opnieuw afgestemd op de rest van MijnTelewerk.
- Verlofbudgettekst vereenvoudigd: extra of overgedragen dagen kunnen nog steeds worden gepland.


## MVP 0.34

- Slimme brugdagen toont alleen nog voorstellen die effectief een Belgische wettelijke feestdag op een normale werkdag benutten. Gewone weekendcombinaties zonder feestdag worden gefilterd.
- De tabs van de verlofplanner hergebruiken het bestaande `fill-mode` ontwerp van MijnTelewerk.
- De maandselectie bij Lang verlof hergebruikt het bestaande werkdag-selectiedesign uit de onboarding.


## MVP 0.34
De slimme verlofplanner staat permanent naast de planning op brede schermen en verhuist onder de planning op kleinere schermen. De planner is niet langer verborgen in een dialoog achter de categorie Verlof.


## MVP 0.34

- Slimme verlofplanner is niet langer een vaste derde kolom.
- Een verticale tab rechts van de planner opent een uitschuifbaar zijpaneel.
- De kalender behoudt daardoor zijn volledige breedte.
- Het paneel sluit via × of Escape en blijft ook op kleinere schermen een drawer.

## MVP 0.55 — responsive laptop polish

- Grote desktop/ultrawide (>= 1600 CSS px): ruime bestaande layout behouden.
- Laptop (1300–1599 px): smallere zijbalk, compactere spacing/toolbars en lagere kalendercellen zonder globale schaaltruc.
- Compacte laptop (1100–1299 px): planner krijgt nog meer prioriteit; bediening wordt compacter maar tekst blijft leesbaar.
- Onder 1100 px: Legenda en snel invullen komen boven de planner zodat de kalender niet horizontaal wordt samengedrukt.
- Geen browserzoom nodig: ontworpen om op 100% zoom bruikbaar te blijven.


## MVP 0.55 — geen horizontale scroll op laptops

De Slimme verlofplanner-tab krijgt op laptop- en compacte desktopweergaven eigen ruimte binnen de viewport. De kalender gebruikt daar geen vaste minimumbreedte meer, zodat de pagina en kalender niet horizontaal hoeven te scrollen om de tab te bereiken.


## Feedback
De ?-uitleg bevat onderaan een feedbackformulier. Stel `FEEDBACK_EMAIL` in `config.js` in om de contactknop te activeren. De planning zelf wordt niet meegestuurd.


## Feestdagbescherming
Automatische invulfuncties gebruiken altijd de Belgische wettelijke feestdagkalender. Handmatige planning op een feestdag blijft mogelijk; de planning verschijnt boven de rode feestdagbalk.


## Werken op een feestdag
Handmatig Telewerk/Kantoor op een wettelijke feestdag vraagt bevestiging. Per feestdag kan de gebruiker kiezen of die dag meetelt in de telewerkpercentageberekening. De echte gewerkte en telewerkdagtotalen blijven zichtbaar.
