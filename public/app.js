const STORAGE_KEY = 'mijntelewerk_mvp_v16';
const LEGACY_KEYS = ['mijntelewerk_mvp_v15','mijntelewerk_mvp_v14','mijntelewerk_mvp_v13','mijntelewerk_mvp_v12', 'mijntelewerk_mvp_v8','mijntelewerk_mvp_v7','mijntelewerk_mvp_v6','mijntelewerk_mvp_v5','mijntelewerk_mvp_v4','mijntelewerk_mvp_v3','mijntelewerk_mvp_v2','mijntelewerk_mvp_v1'];

const defaults = {
  maxPercent: 60,
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth(),
  activeCategoryId: 'telework',
  selectedDayPart: 'full',
  currentView: 'month',
  theme: 'light',
  language: 'nl',
  autoHolidays: true,
  workingWeekdays: [1,2,3,4,5],
  standardTeleworkWeekdays: [],
  leaveBudgetByYear: {},
  notes: {},
  holidayWorkExemptions: {},
  onboardingComplete: false,
  removedDefaultCategories: [],
  categories: [
    {id:'telework', name:'Telewerk', emoji:'🏠', color:'#3f9b72', type:'telework', locked:true, selectable:true},
    {id:'office', name:'Kantoor', emoji:'🏢', color:'#3976c4', type:'office', locked:true, selectable:true},
    {id:'leave', name:'Verlof', emoji:'🏖️', color:'#e7aa30', type:'neutral', locked:true, selectable:true},
    {id:'sick', name:'Ziek', emoji:'🤒', color:'#9b6bc3', type:'neutral', selectable:true},
    {id:'holiday', name:'Feestdag', emoji:'🎉', color:'#c94752', type:'neutral', locked:true, selectable:false, automatic:true}
  ],
  days: {}
};

const I18N = {
  nl:{locale:'nl-BE',months:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],weekdays:['Ma','Di','Wo','Do','Vr','Za','Zo'],
    brandTagline:'Plan slim. Hou je percentage onder controle.',export:'Export',print:'Print',reset:'Reset',account:'Account',myAccount:'Mijn account',darkMode:'Dark mode',lightMode:'Light mode',
    teleworkPercentage:'Telewerkpercentage',teleworkDays:'Telewerkdagen',workedDays:'Gewerkte dagen',workedDaysHint:'Kantoor + telewerk, inclusief halve dagen.',monthView:'Maand',yearOverview:'Jaaroverzicht',monthTotals:'Maandtotaal',legend:'Legenda',legendHint:'Kies een item en klik daarna dagen aan.',input:'Invoer',fullDay:'Hele dag',morningHalf:'Voormiddag (½ dag)',afternoonHalf:'Namiddag (½ dag)',quickFill:'Terugkerende dag & periode',quickFillHelpLabel:'Uitleg over terugkerende dag en periode',quickFillHint:'Plan een vaste weekdag voor de geselecteerde maand of het hele jaar, of vul een aaneengesloten periode tussen twee datums in.',fixedWeekday:'Vaste weekdag',standardSchedule:'Standaardweek',standardScheduleTitle:'Standaard telewerkrooster',standardScheduleHint:'Kies de weekdagen waarop je normaal telewerkt. Bij toepassen worden Telewerk en Kantoor aan dit rooster aangepast. Wettelijke feestdagen worden nooit automatisch ingevuld.',standardScheduleSafeHint:'Wettelijke feestdagen blijven altijd beschermd. Plan je zelf Telewerk of Kantoor op een feestdag, dan blijven zowel je planning als de feestdag zichtbaar. Verlof, Ziek en eigen categorieën worden niet overschreven.',noFixedTelework:'Geen vaste telewerkdagen gekozen.',applyStandardMonth:'Vul maand met standaardrooster',applyStandardYear:'Vul jaar met standaardrooster',standardScheduleApplied:'Standaardrooster toegepast op {n} werkdagen.',period:'Periode',weekday:'Weekdag',monday:'Maandag',tuesday:'Dinsdag',wednesday:'Woensdag',thursday:'Donderdag',friday:'Vrijdag',saturday:'Zaterdag',sunday:'Zondag',from:'Van',to:'Tot',skipWeekends:'Dagen buiten standaard werkweek overslaan',skipHolidays:'Wettelijke feestdagen overslaan',category:'Categorie',dayPart:'Dagdeel',applyMonth:'Toepassen op maand',applyYear:'Toepassen op jaar',fillPeriod:'Periode invullen',planning:'Planning',maxTelework:'Max. telewerk',explanation:'Uitleg',howItWorks:'Hoe werkt MijnTelewerk?',calcExplanation:'Telewerk en kantoor tellen als gewerkte tijd. Het jaarpercentage is <strong>telewerk ÷ alle gewerkte tijd × 100</strong>. Een halve dag telt als 0,5. Werk je op een wettelijke feestdag, dan kun je die dag optioneel uitsluiten van deze percentageberekening.',halfDays:'Halve dagen',halfDaysExplanation:'Voormiddag en namiddag worden apart bijgehouden. Zo kan je bijvoorbeeld een halve dag telewerk combineren met een halve dag verlof of kantoor.',belgianHolidays:'Belgische feestdagen',holidayExplanation:'De 10 Belgische wettelijke feestdagen worden automatisch berekend en rood weergegeven. Een vervangingsdag wanneer een feestdag op een niet-gewerkte dag valt, voeg je zelf toe omdat die per werkgever of sector kan verschillen.',holidayWorkEyebrow:'Feestdagmodus',holidayWorkTitle:'Werken op {holiday}?',holidayWorkFunny1:'Je agenda zegt “feestdag”. Jij antwoordt blijkbaar: “challenge accepted”. 😄',holidayWorkFunny2:'Zelfs de koffieautomaat had waarschijnlijk vrij genomen. Jij niet? ☕😅',holidayWorkFunny3:'Je laptop heeft duidelijk de feestdagkalender niet bekeken. 💻🎉',holidayWorkQuestion:'Wil je echt {work} plannen op deze feestdag?',holidayWorkCountLabel:'Deze dag laten meetellen voor mijn telewerkpercentage',holidayWorkCountHint:'Zet dit uit als je werkgever gewerkte feestdagen vrijstelt van de telewerkpercentageberekening.',holidayWorkConfirm:'Ja, plan {work}',holidayWorkExcludedShort:'Niet meegerekend in telewerk%',holidayWorkIncludedShort:'Telt mee in telewerk%',holidayBulkSkipped:'{n} feestdag(en) overgeslagen. Werk op een feestdag plan je bewust rechtstreeks in de kalender.',standardWorkweek:'Standaard werkweek',standardWorkweekExplanation:'Je gekozen werkdagen blokkeren nooit kalenderdagen. Ze dienen alleen als standaard voor functies zoals Periode invullen wanneer “Dagen buiten standaard werkweek overslaan” actief is.',standardTeleworkWeek:'Standaard telewerkweek',standardTeleworkWeekExplanation:'Kies de weekdagen waarop je normaal telewerkt. Wanneer je de standaard telewerkweek op een maand of jaar toepast, zet MijnTelewerk die dagen op Telewerk en de overige dagen uit je werkweek op Kantoor. Bestaand Telewerk en Kantoor worden aan het rooster aangepast; Verlof, Ziek, eigen categorieën en wettelijke feestdagen blijven behouden. Je kunt elke dag daarna nog handmatig wijzigen.',appearance:'Weergave',customizeCategory:'Categorie aanpassen',appearanceHint:'De naam en functie blijven vast. Je past alleen de emoji en kleur aan.',saveChanges:'Wijzigingen opslaan',appearanceSaved:'Weergave aangepast.',understood:'Begrepen',feedbackContactTitle:'Feedback, bug of suggestie?',feedbackContactText:'Heb je iets gevonden dat niet klopt of een idee voor MijnTelewerk? Laat het gerust weten.',feedbackType:'Type',feedbackOptionFeedback:'Feedback',feedbackOptionBug:'Bug',feedbackOptionSuggestion:'Suggestie',feedbackMessage:'Bericht',feedbackPlaceholder:'Beschrijf kort wat je hebt opgemerkt of wat je graag zou zien.',feedbackContactButton:'Contact opnemen',feedbackEmailHint:'Opent je eigen e-mailapp. Je planning wordt niet meegestuurd.',feedbackUnavailable:'Contactadres nog niet ingesteld.',feedbackChooseMessage:'Vul eerst kort je bericht in.',feedbackMailOpened:'Je e-mailapp wordt geopend.',feedbackSubject:'MijnTelewerk — {type}',feedbackTypeFeedback:'Feedback',feedbackTypeBug:'Bug',feedbackTypeSuggestion:'Suggestie',accountTitle:'MijnTelewerk Account',accountEverywhere:'Je planning overal bijhouden',passwordlessLogin:'Inloggen zonder wachtwoord',magicLinkIntro:'Vul je e-mailadres in. Je ontvangt een beveiligde magic link waarmee je meteen kunt inloggen.',emailAddress:'E-mailadres',sendMagicLink:'Stuur magic link',accountLocalHint:'Door een account te gebruiken kan je planning later tussen toestellen synchroniseren. Zonder account blijven je gegevens lokaal in deze browser.',accountPromoEyebrow:'Gratis account',accountPromoTitle:'Je planning begint vorm te krijgen',accountPromoText:'Bewaar je planning veilig in je account en bekijk ze later ook op je andere toestellen.',accountPromoBackup:'Cloudbackup',accountPromoSync:'Synchronisatie tussen toestellen',accountPromoReminders:'Persoonlijke herinneringen',accountPromoCreate:'Gratis account maken',accountPromoLater:'Later',accountPromoNever:'Niet meer tonen',signedInAs:'Ingelogd als',cloudPlanning:'Cloudplanning',checkCloud:'Controleer cloud',uploadCurrentYear:'Upload huidig jaar',uploadHint:'Bewaar deze lokale jaarplanning in je account',downloadCloud:'Laad uit cloud',downloadHint:'Vervang dit lokale jaar door je cloudplanning',autoSync:'Automatisch synchroniseren',autoSyncHint:'Na de eerste koppeling worden wijzigingen automatisch opgeslagen. Als lokaal en cloud tegelijk wijzigen, pauzeert de sync zonder iets te overschrijven.',reminderEmails:'Herinnering op website',reminderHint:'Kies wanneer MijnTelewerk bij je volgende bezoek een pop-up toont om je telewerk door te geven.',reminderEnabled:'Herinnering inschakelen',reminderSchedule:'Moment van herinnering',reminderWeekly:'Wekelijks',reminderMonthly:'Maandelijks',reminderOn:'Op',reminderAt:'Om',reminderMonthlyMode:'Wanneer wil je herinnerd worden?',reminderFixedDay:'Specifieke dag van de maand',reminderFirstWorkday:'Eerste werkdag van de maand',reminderLastWorkday:'Laatste werkdag van de maand',reminderPopupEyebrow:'Herinnering',reminderPopupTitle:'Telewerk nog doorgeven?',reminderPopupText:'Vergeet niet je telewerkgegevens door te geven aan je werkgever.',reminderLater:'Later herinneren',reminderDone:'In orde ✓',reminderSnoozed:'Prima, ik herinner je bij een volgend bezoek opnieuw.',reminderAcknowledged:'In orde. Deze maand stoor ik je hier niet meer mee.',reminderDayOfMonth:'Dag van de maand',saveReminderSettings:'Herinnering bewaren',reminderSaved:'Herinnering opgeslagen.',reminderMailPending:'De melding verschijnt alleen wanneer je MijnTelewerk opent.',welcomeBack:'Welkom terug',welcomeBackHint:'Toon één keer een grappig bericht op je eerste werkdag na een lange geplande verlofperiode.',welcomeBackEnabled:'Welkom-terugbericht inschakelen',welcomeBackMinDays:'Vanaf hoeveel verlofdagen?',saveAccountPreferences:'Accountvoorkeuren bewaren',preferencesSaved:'Accountvoorkeuren opgeslagen.',welcomeBackNote:'De melding gebruikt alleen je geplande Verlof-dagen en verschijnt maximaal één keer per verlofperiode.',comingSoon:'Binnenkort',signOut:'Uitloggen',addCategory:'Categorie toevoegen',dayNote:'Persoonlijke notitie',dayNoteAdd:'Notitie toevoegen',dayNoteEdit:'Notitie aanpassen',dayNotePlaceholder:'Bijv. afspraak, praktische herinnering…',dayNoteHint:'De notitie wordt mee opgeslagen met je planning en synchroniseert wanneer je een account gebruikt.',saveNote:'Notitie opslaan',deleteNote:'Notitie verwijderen',noteSaved:'Notitie opgeslagen.',noteDeleted:'Notitie verwijderd.',name:'Naam',emoji:'Emoji',quickChoice:'Snelle keuze',type:'Type',neutralDay:'Niet-gewerkte dag / neutraal',telework:'Telewerk',office:'Kantoor',leave:'Verlof',sick:'Ziek',holiday:'Feestdag',color:'Kleur',cancel:'Annuleren',add:'Toevoegen',whatPrint:'Wat wil je afdrukken?',printHint:'Kies het overzicht dat je naar de printer of als PDF wilt sturen.',currentMonth:'Huidige maand',fullYearOverview:'Volledig jaaroverzicht',whatReset:'Wat wil je resetten?',resetHint:'Alleen je eigen ingevoerde planning wordt verwijderd. Automatische feestdagen blijven bestaan.',fullYear:'Volledig jaar',exporting:'Exporteren',exportHint:'Exporteer de planning van het geselecteerde jaar.',pdfHint:'Gebruik de printweergave en kies “Opslaan als PDF”',excelHint:'Dagplanning + maandoverzicht van het geselecteerde jaar',icsHint:'Geschikt voor Apple Agenda, Outlook en andere agenda-apps',
    typeAutomatic:'Automatisch · wettelijke feestdag',typeTelework:'Telt als telewerk',typeOffice:'Telt als kantoor',typeNeutral:'Telt niet als gewerkte dag',deleteCategory:'Categorie verwijderen',confirmDelete:'Categorie verwijderen? Dagen met deze categorie worden ook leeggemaakt.',statusNone:'Nog geen gewerkte dagen ingepland.',withinMaximum:'Binnen je maximum van {max}%.',aboveMaximum:'Je zit {delta} procentpunt boven je maximum.',remaining:'Nog maximaal {n} extra {teleworkDayWord} mogelijk bij ongewijzigde planning.',noLimit:'Geen limiet bij 100%.',
    bannerEmptyTitle:'Je kalender staat klaar',bannerEmpty:'Plan een paar werkdagen en ik begin meteen te rekenen.',banner90Title:'Houston, we zijn het kantoor kwijt',banner90:'{pct}% telewerk. Op dit tempo moet je werkgever Google Maps gebruiken om je bureau terug te vinden. Je zit {delta} procentpunt boven je limiet.',banner80Title:'Je kantoorpas heeft een opsporingsbericht',banner80:'{pct}% telewerk. De receptie begint ondertussen te twijfelen of je nog in het personeelsbestand staat. {delta} procentpunt boven je limiet.',banner70Title:'Je bureaustoel zoekt een nieuwe eigenaar',banner70:'{pct}% telewerk. Je stoel op kantoor heeft genoeg tijd gehad om over haar toekomst na te denken. Je zit {delta} procentpunt boven je limiet.',bannerOverTitle:'De zetel heeft gewonnen',bannerOver:'Je zit {delta} procentpunt boven je limiet. Tijd om je kantoorgebouw nog eens van dichtbij te bekijken. 🏢',bannerNearTitle:'Met de tenen tegen de lijn',bannerNear:'Je zit op {pct}% van maximaal {max}%. Nog een paar enthousiaste thuiswerkdagen en de rekenmachine begint te zweten.',banner25Title:'Je thuisbureau heeft een identiteitscrisis',banner25:'Je zit nog onder 25% telewerk. Je bureaustoel thuis vraagt ondertussen of je nog bij het gezin hoort. Misschien mag die nog eens aan het werk.',banner30Title:'Je wifi voelt zich verwaarloosd',banner30:'Nog geen 30% telewerk. Je router overweegt een vermissingsbericht. Er is dus nog ruimte om wat vaker vanuit huis in te loggen.',banner40Title:'Je woon-werkverkeer is wel héél fit',banner40:'Je zit onder 40% telewerk. Je schoenen maken momenteel meer kilometers dan je laptop. Een extra thuiswerkdag kan best.',bannerRoomTitle:'Je thuiskantoor mist je',bannerRoom:'Je hebt nog ongeveer {n} telewerkdagen ruimte. Die koffiemok thuis mag dus nog wat overuren maken.',bannerBalancedTitle:'Mooi in balans',bannerBalanced:'Je hebt nog {n} {teleworkDayWord} speelruimte. Genoeg voor een strategische pyjamabroekdag.',
    holidayNewYear:'Nieuwjaarsdag',holidayEasterMonday:'Paasmaandag',holidayLabour:'Dag van de Arbeid',holidayAscension:'Hemelvaart',holidayWhitMonday:'Pinkstermaandag',holidayNational:'Nationale feestdag',holidayAssumption:'O.L.V. Hemelvaart',holidayAllSaints:'Allerheiligen',holidayArmistice:'Wapenstilstand',holidayChristmas:'Kerstmis',
    themeOn:'🦇 Batman-modus geactiveerd!',themeOff:'☀️ Terug naar het daglicht. Alfred kan de gordijnen weer openen.',helpTitle:'Hoe werkt de berekening?',invalidRange:'Kies een geldige Van- en Tot-datum.',rangeOrder:'De Tot-datum moet op of na de Van-datum liggen.',rangeYear:'De periode moet binnen het geselecteerde kalenderjaar vallen.',rangeDone:'{n} dagdelen ingevuld.',
    resetMonthDone:'Maandplanning gewist.',resetYearDone:'Jaarplanning gewist.',invalidCloud:'Ongeldige cloudplanning.',backendNotLinked:'Accountbackend nog niet gekoppeld.',backendLocalExplanation:'De planner blijft volledig lokaal werken. Vul eerst <code>config.js</code> in met je Supabase-projectgegevens om accounts te activeren.',rlsHint:'De publieke anon key mag in de browser staan; toegang tot planningen wordt in de database met Row Level Security beperkt tot de ingelogde gebruiker.',cloudStatusInitial:'Controleer of er voor dit jaar al een planning in je account staat.',
    onboardingEyebrow:'Eerste instelling',onboardingTitle:'Maak MijnTelewerk meteen van jou',onboardingIntro:'Vier korte keuzes en je planner staat goed ingesteld.',onboardingStep1:'Wat is je maximum telewerkpercentage?',onboardingStep1Hint:'Je kunt dit later altijd aanpassen in de planning.',onboardingStep2:'Welke dagen horen normaal bij je werkweek?',onboardingStep2Hint:'Dit is alleen een standaard voor snel invullen. Elke kalenderdag blijft altijd handmatig invulbaar.',onboardingStep3:'Heb je vaste telewerkdagen?',onboardingStep3Hint:'Selecteer je vaste thuiswerkdagen. Laat alles leeg als je flexibel telewerkt.',onboardingApplySchedule:'Vul lege werkdagen van dit jaar meteen in als Telewerk/Kantoor',onboardingStep4:'Belgische feestdagen automatisch tonen?',onboardingStep4Hint:'De 10 wettelijke feestdagen worden automatisch berekend. Vervangingsdagen blijven handmatig.',onboardingBack:'Terug',onboardingNext:'Volgende',onboardingStart:'Start mijn planning',onboardingLater:'Later instellen',onboardingAdjust:'Basisinstellingen aanpassen',onboardingYes:'Ja, automatisch',onboardingNo:'Nee, ik vul ze zelf in',dayShortMon:'Ma',dayShortTue:'Di',dayShortWed:'Wo',dayShortThu:'Do',dayShortFri:'Vr',dayShortSat:'Za',dayShortSun:'Zo'
  },
  fr:{locale:'fr-BE',months:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],weekdays:['Lu','Ma','Me','Je','Ve','Sa','Di'],
    brandTagline:'Planifiez simplement. Gardez votre pourcentage sous contrôle.',export:'Exporter',print:'Imprimer',reset:'Réinitialiser',account:'Compte',myAccount:'Mon compte',darkMode:'Mode sombre',lightMode:'Mode clair',teleworkPercentage:'Pourcentage de télétravail',teleworkDays:'Jours de télétravail',workedDays:'Jours travaillés',workedDaysHint:'Bureau + télétravail, demi-journées comprises.',monthView:'Mois',yearOverview:'Vue annuelle',monthTotals:'Total du mois',legend:'Légende',legendHint:'Choisissez un élément puis cliquez sur les jours.',input:'Saisie',fullDay:'Journée entière',morningHalf:'Matin (½ journée)',afternoonHalf:'Après-midi (½ journée)',quickFill:'Jour récurrent & période',quickFillHelpLabel:'Explication du jour récurrent et de la période',quickFillHint:'Planifiez un jour fixe pour le mois sélectionné ou toute l’année, ou remplissez une période continue entre deux dates.',fixedWeekday:'Jour fixe',standardSchedule:'Semaine standard',standardScheduleTitle:'Horaire standard de télétravail',standardScheduleHint:'Choisissez les jours où vous télétravaillez normalement. Lors de l’application, Télétravail et Bureau sont adaptés à ce planning. Les jours fériés légaux ne sont jamais remplis automatiquement.',standardScheduleSafeHint:'Les jours fériés légaux restent toujours protégés. Si vous planifiez vous-même Télétravail ou Bureau un jour férié, votre planning et le jour férié restent tous deux visibles. Congé, Maladie et vos catégories ne sont pas remplacés.',noFixedTelework:'Aucun jour fixe de télétravail sélectionné.',applyStandardMonth:'Remplir le mois avec l’horaire standard',applyStandardYear:'Remplir l’année avec l’horaire standard',standardScheduleApplied:'Horaire standard appliqué à {n} jours de travail.',period:'Période',weekday:'Jour de la semaine',monday:'Lundi',tuesday:'Mardi',wednesday:'Mercredi',thursday:'Jeudi',friday:'Vendredi',saturday:'Samedi',sunday:'Dimanche',from:'Du',to:'Au',skipWeekends:'Ignorer les jours hors semaine de travail standard',skipHolidays:'Ignorer les jours fériés légaux',category:'Catégorie',dayPart:'Partie de journée',applyMonth:'Appliquer au mois',applyYear:"Appliquer à l’année",fillPeriod:'Remplir la période',planning:'Planning',maxTelework:'Télétravail max.',explanation:'Explication',howItWorks:'Comment fonctionne MijnTelewerk ?',calcExplanation:'Le télétravail et le bureau comptent comme temps travaillé. Le pourcentage annuel est <strong>télétravail ÷ tout le temps travaillé × 100</strong>. Une demi-journée compte pour 0,5. Si vous travaillez un jour férié légal, vous pouvez l’exclure du calcul du pourcentage.',halfDays:'Demi-journées',halfDaysExplanation:'Le matin et l’après-midi sont suivis séparément. Vous pouvez donc combiner une demi-journée de télétravail avec une demi-journée de congé ou de bureau.',belgianHolidays:'Jours fériés belges',holidayExplanation:'Les 10 jours fériés légaux belges sont calculés automatiquement et affichés en rouge. Les jours de remplacement ne sont pas ajoutés automatiquement car ils peuvent varier selon l’employeur ou le secteur.',holidayWorkEyebrow:'Mode jour férié',holidayWorkTitle:'Travailler le {holiday} ?',holidayWorkFunny1:'Votre agenda dit « jour férié ». Vous répondez apparemment « défi accepté ». 😄',holidayWorkFunny2:'Même la machine à café avait probablement pris congé. Pas vous ? ☕😅',holidayWorkFunny3:'Votre ordinateur n’a manifestement pas consulté le calendrier des jours fériés. 💻🎉',holidayWorkQuestion:'Voulez-vous vraiment planifier {work} ce jour férié ?',holidayWorkCountLabel:'Compter cette journée dans mon pourcentage de télétravail',holidayWorkCountHint:'Désactivez cette option si votre employeur exclut les jours fériés travaillés du calcul du pourcentage de télétravail.',holidayWorkConfirm:'Oui, planifier {work}',holidayWorkExcludedShort:'Exclu du % télétravail',holidayWorkIncludedShort:'Inclus dans le % télétravail',holidayBulkSkipped:'{n} jour(s) férié(s) ignoré(s). Le travail un jour férié doit être planifié volontairement directement dans le calendrier.',standardWorkweek:'Semaine de travail standard',standardWorkweekExplanation:'Les jours choisis ne bloquent jamais le calendrier. Ils servent uniquement de valeur par défaut pour les fonctions comme le remplissage d’une période lorsque le filtre des jours hors semaine standard est activé.',standardTeleworkWeek:'Semaine de télétravail standard',standardTeleworkWeekExplanation:'Choisissez les jours de la semaine où vous télétravaillez normalement. Lorsque vous appliquez la semaine de télétravail standard à un mois ou à une année, ces jours deviennent Télétravail et les autres jours de votre semaine de travail deviennent Bureau. Les entrées Télétravail/Bureau existantes sont adaptées ; Congé, Maladie, vos catégories personnelles et les jours fériés restent inchangés. Chaque jour peut ensuite être modifié manuellement.',appearance:'Apparence',customizeCategory:'Personnaliser la catégorie',appearanceHint:'Le nom et la fonction restent fixes. Seuls l’emoji et la couleur peuvent être modifiés.',saveChanges:'Enregistrer les modifications',appearanceSaved:'Apparence mise à jour.',understood:'Compris',feedbackContactTitle:'Feedback, bug ou suggestion ?',feedbackContactText:'Vous avez repéré quelque chose qui ne fonctionne pas ou vous avez une idée pour MijnTelewerk ? N’hésitez pas à me le signaler.',feedbackType:'Type',feedbackOptionFeedback:'Feedback',feedbackOptionBug:'Bug',feedbackOptionSuggestion:'Suggestion',feedbackMessage:'Message',feedbackPlaceholder:'Décrivez brièvement ce que vous avez remarqué ou ce que vous aimeriez voir.',feedbackContactButton:'Nous contacter',feedbackEmailHint:'Ouvre votre application e-mail. Votre planning n’est pas envoyé.',feedbackUnavailable:'L’adresse de contact n’est pas encore configurée.',feedbackChooseMessage:'Ajoutez d’abord un court message.',feedbackMailOpened:'Votre application e-mail va s’ouvrir.',feedbackSubject:'MijnTelewerk — {type}',feedbackTypeFeedback:'Feedback',feedbackTypeBug:'Bug',feedbackTypeSuggestion:'Suggestion',accountTitle:'Compte MijnTelewerk',accountEverywhere:'Retrouvez votre planning partout',passwordlessLogin:'Connexion sans mot de passe',magicLinkIntro:'Saisissez votre adresse e-mail. Vous recevrez un lien sécurisé pour vous connecter.',emailAddress:'Adresse e-mail',sendMagicLink:'Envoyer le lien magique',accountLocalHint:'Un compte permettra de synchroniser votre planning entre appareils. Sans compte, vos données restent locales dans ce navigateur.',accountPromoEyebrow:'Compte gratuit',accountPromoTitle:'Votre planning prend forme',accountPromoText:'Sauvegardez votre planning dans votre compte et retrouvez-le ensuite sur vos autres appareils.',accountPromoBackup:'Sauvegarde cloud',accountPromoSync:'Synchronisation entre appareils',accountPromoReminders:'Rappels personnels',accountPromoCreate:'Créer un compte gratuit',accountPromoLater:'Plus tard',accountPromoNever:'Ne plus afficher',signedInAs:'Connecté en tant que',cloudPlanning:'Planning cloud',checkCloud:'Vérifier le cloud',uploadCurrentYear:"Envoyer l’année actuelle",uploadHint:'Enregistrer ce planning annuel local dans votre compte',downloadCloud:'Charger depuis le cloud',downloadHint:'Remplacer cette année locale par votre planning cloud',autoSync:'Synchronisation automatique',autoSyncHint:'Après la première liaison, les modifications sont enregistrées automatiquement. Si le local et le cloud changent en même temps, la synchro se met en pause sans rien écraser.',reminderEmails:'Rappel sur le site',reminderHint:'Choisissez quand MijnTelewerk doit afficher une fenêtre lors de votre prochaine visite pour vous rappeler de transmettre votre télétravail.',reminderEnabled:'Activer le rappel',reminderSchedule:'Moment du rappel',reminderWeekly:'Chaque semaine',reminderMonthly:'Chaque mois',reminderOn:'Le',reminderAt:'À',reminderMonthlyMode:'Quand souhaitez-vous être rappelé ?',reminderFixedDay:'Jour précis du mois',reminderFirstWorkday:'Premier jour ouvrable du mois',reminderLastWorkday:'Dernier jour ouvrable du mois',reminderPopupEyebrow:'Rappel',reminderPopupTitle:'Télétravail à transmettre ?',reminderPopupText:'N’oubliez pas de transmettre vos données de télétravail à votre employeur.',reminderLater:'Me le rappeler plus tard',reminderDone:'C’est fait ✓',reminderSnoozed:'D’accord, je vous le rappellerai lors d’une prochaine visite.',reminderAcknowledged:'C’est noté. Plus de rappel pour ce mois-ci.',reminderDayOfMonth:'Jour du mois',saveReminderSettings:'Enregistrer le rappel',reminderSaved:'Rappel enregistré.',reminderMailPending:'Le message apparaît uniquement lorsque vous ouvrez MijnTelewerk.',welcomeBack:'Bon retour',welcomeBackHint:'Afficher une fois un message amusant lors de votre premier jour de travail après une longue période de congé planifiée.',welcomeBackEnabled:'Activer le message de retour',welcomeBackMinDays:'À partir de combien de jours de congé ?',saveAccountPreferences:'Enregistrer les préférences',preferencesSaved:'Préférences du compte enregistrées.',welcomeBackNote:'Le message utilise uniquement les jours Congé planifiés et ne s’affiche qu’une fois par période de congé.',comingSoon:'Bientôt',signOut:'Se déconnecter',addCategory:'Ajouter une catégorie',dayNote:'Note personnelle',dayNoteAdd:'Ajouter une note',dayNoteEdit:'Modifier la note',dayNotePlaceholder:'Ex. rendez-vous, rappel pratique…',dayNoteHint:'La note est enregistrée avec votre planning et synchronisée lorsque vous utilisez un compte.',saveNote:'Enregistrer la note',deleteNote:'Supprimer la note',noteSaved:'Note enregistrée.',noteDeleted:'Note supprimée.',name:'Nom',emoji:'Emoji',quickChoice:'Choix rapide',type:'Type',neutralDay:'Jour non travaillé / neutre',telework:'Télétravail',office:'Bureau',leave:'Congé',sick:'Maladie',holiday:'Jour férié',color:'Couleur',cancel:'Annuler',add:'Ajouter',whatPrint:'Que voulez-vous imprimer ?',printHint:'Choisissez la vue à imprimer ou à enregistrer en PDF.',currentMonth:'Mois actuel',fullYearOverview:'Vue annuelle complète',whatReset:'Que voulez-vous réinitialiser ?',resetHint:'Seul votre planning saisi est supprimé. Les jours fériés automatiques restent présents.',fullYear:'Année complète',exporting:'Exporter',exportHint:"Exportez le planning de l’année sélectionnée.",pdfHint:'Utilisez la vue d’impression puis choisissez « Enregistrer au format PDF »',excelHint:"Planning journalier + aperçu mensuel de l’année sélectionnée",icsHint:'Compatible avec Calendrier Apple, Outlook et autres applications de calendrier',typeAutomatic:'Automatique · jour férié légal',typeTelework:'Compte comme télétravail',typeOffice:'Compte comme bureau',typeNeutral:'Ne compte pas comme jour travaillé',deleteCategory:'Supprimer la catégorie',confirmDelete:'Supprimer la catégorie ? Les jours utilisant cette catégorie seront également vidés.',statusNone:'Aucun jour travaillé planifié.',withinMaximum:'Dans votre maximum de {max} %.',aboveMaximum:'Vous êtes {delta} point(s) de pourcentage au-dessus de votre maximum.',remaining:'Encore {n} jour{plural} de télétravail supplémentaire(s) possible(s) avec le planning actuel.',noLimit:'Aucune limite à 100 %.',bannerEmptyTitle:'Votre calendrier est prêt',bannerEmpty:'Planifiez quelques jours de travail et je commence à calculer.',banner90Title:'Houston, nous avons perdu le bureau',banner90:'{pct} % de télétravail. À ce rythme, votre employeur aura besoin de Google Maps pour retrouver votre bureau. Vous dépassez votre limite de {delta} point(s).',banner80Title:'Votre badge de bureau est porté disparu',banner80:'{pct} % de télétravail. La réception commence à se demander si vous faites encore partie du personnel. {delta} point(s) au-dessus de votre limite.',banner70Title:'Votre chaise de bureau cherche un nouveau propriétaire',banner70:'{pct} % de télétravail. Votre chaise au bureau a eu tout le temps de réfléchir à son avenir. Vous dépassez votre limite de {delta} point(s).',bannerOverTitle:'Le canapé a gagné',bannerOver:'Vous dépassez votre limite de {delta} point(s). Il est peut-être temps de revoir votre immeuble de bureaux. 🏢',bannerNearTitle:'Juste sur la ligne',bannerNear:'Vous êtes à {pct} % sur un maximum de {max} %. Encore quelques journées enthousiastes à domicile et la calculatrice commence à transpirer.',banner25Title:'Votre bureau à domicile traverse une crise d’identité',banner25:'Vous êtes encore sous 25 % de télétravail. Votre chaise à la maison se demande si elle fait toujours partie de la famille.',banner30Title:'Votre Wi-Fi se sent délaissé',banner30:'Moins de 30 % de télétravail. Votre routeur envisage de lancer un avis de recherche. Il reste donc de la marge pour travailler davantage depuis chez vous.',banner40Title:'Vos trajets domicile-travail sont très sportifs',banner40:'Vous êtes sous 40 % de télétravail. Vos chaussures parcourent actuellement plus de kilomètres que votre ordinateur portable.',bannerRoomTitle:'Votre bureau à domicile vous manque',bannerRoom:'Il vous reste environ {n} jour(s) de télétravail. Votre tasse de café à la maison peut encore faire quelques heures supplémentaires.',bannerBalancedTitle:'Bel équilibre',bannerBalanced:'Il vous reste {n} jour{plural} de télétravail de marge. Assez pour une journée pantalon de pyjama stratégique.',holidayNewYear:"Jour de l’An",holidayEasterMonday:'Lundi de Pâques',holidayLabour:'Fête du Travail',holidayAscension:'Ascension',holidayWhitMonday:'Lundi de Pentecôte',holidayNational:'Fête nationale',holidayAssumption:'Assomption',holidayAllSaints:'Toussaint',holidayArmistice:'Armistice',holidayChristmas:'Noël',themeOn:'🦇 Mode Batman activé !',themeOff:'☀️ Retour à la lumière. Alfred peut rouvrir les rideaux.',helpTitle:'Comment fonctionne le calcul ?',invalidRange:'Choisissez des dates de début et de fin valides.',rangeOrder:'La date de fin doit être égale ou postérieure à la date de début.',rangeYear:"La période doit rester dans l’année sélectionnée.",rangeDone:'{n} demi-journées remplies.',resetMonthDone:'Planning du mois effacé.',resetYearDone:"Planning de l’année effacé.",invalidCloud:'Planning cloud invalide.',backendNotLinked:'Backend des comptes pas encore connecté.',backendLocalExplanation:'Le planificateur continue à fonctionner entièrement en local. Renseignez d’abord <code>config.js</code> avec les données de votre projet Supabase pour activer les comptes.',rlsHint:'La clé anon publique peut être utilisée dans le navigateur ; Row Level Security limite l’accès aux plannings à l’utilisateur connecté.',cloudStatusInitial:'Vérifiez si un planning existe déjà dans votre compte pour cette année.',
    onboardingEyebrow:'Configuration initiale',onboardingTitle:'Configurez MijnTelewerk en trois étapes',onboardingIntro:'Quatre choix rapides et votre planning est prêt.',onboardingStep1:'Quel est votre pourcentage maximum de télétravail ?',onboardingStep1Hint:'Vous pourrez toujours le modifier plus tard.',onboardingStep2:'Quels jours font normalement partie de votre semaine de travail ?',onboardingStep2Hint:'Ce réglage sert uniquement de valeur par défaut pour le remplissage rapide. Chaque jour du calendrier reste toujours modifiable manuellement.',onboardingStep3:'Avez-vous des jours fixes de télétravail ?',onboardingStep3Hint:'Sélectionnez vos jours fixes à domicile. Laissez tout vide si votre télétravail est flexible.',onboardingApplySchedule:'Remplir immédiatement les jours ouvrables vides de cette année en Télétravail/Bureau',onboardingStep4:'Afficher automatiquement les jours fériés belges ?',onboardingStep4Hint:'Les 10 jours fériés légaux sont calculés automatiquement. Les jours de remplacement restent manuels.',onboardingBack:'Retour',onboardingNext:'Suivant',onboardingStart:'Commencer mon planning',onboardingLater:'Configurer plus tard',onboardingAdjust:'Modifier les réglages de base',onboardingYes:'Oui, automatiquement',onboardingNo:'Non, je les ajouterai',dayShortMon:'Lu',dayShortTue:'Ma',dayShortWed:'Me',dayShortThu:'Je',dayShortFri:'Ve',dayShortSat:'Sa',dayShortSun:'Di'
  },
  en:{locale:'en-BE',months:['January','February','March','April','May','June','July','August','September','October','November','December'],weekdays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    brandTagline:'Plan smart. Keep your percentage under control.',export:'Export',print:'Print',reset:'Reset',account:'Account',myAccount:'My account',darkMode:'Dark mode',lightMode:'Light mode',teleworkPercentage:'Telework percentage',teleworkDays:'Telework days',workedDays:'Worked days',workedDaysHint:'Office + telework, including half days.',monthView:'Month',yearOverview:'Year overview',monthTotals:'Monthly totals',legend:'Legend',legendHint:'Choose an item, then click the days.',input:'Entry',fullDay:'Full day',morningHalf:'Morning (½ day)',afternoonHalf:'Afternoon (½ day)',quickFill:'Recurring day & period',quickFillHelpLabel:'Explanation of recurring day and period',quickFillHint:'Plan a fixed weekday for the selected month or the full year, or fill a continuous period between two dates.',fixedWeekday:'Fixed weekday',standardSchedule:'Standard week',standardScheduleHint:'Choose the weekdays on which you normally work from home. When applied, Telework and Office are aligned to this pattern. Statutory public holidays are never filled automatically.',standardScheduleSafeHint:'Statutory public holidays always stay protected. If you manually plan Telework or Office on a public holiday, both your planning and the holiday remain visible. Leave, Sick and custom categories are not overwritten.',noFixedTelework:'No fixed telework days selected.',applyStandardMonth:'Fill month with standard schedule',applyStandardYear:'Fill year with standard schedule',standardScheduleApplied:'Standard schedule applied to {n} working days.',period:'Period',weekday:'Weekday',monday:'Monday',tuesday:'Tuesday',wednesday:'Wednesday',thursday:'Thursday',friday:'Friday',saturday:'Saturday',sunday:'Sunday',from:'From',to:'To',skipWeekends:'Skip days outside standard working week',skipHolidays:'Skip legal public holidays',category:'Category',dayPart:'Day part',applyMonth:'Apply to month',applyYear:'Apply to year',fillPeriod:'Fill period',planning:'Planning',maxTelework:'Max. telework',explanation:'Explanation',howItWorks:'How does MijnTelewerk work?',calcExplanation:'Telework and office time count as worked time. The annual percentage is <strong>telework ÷ all worked time × 100</strong>. A half day counts as 0.5. If you work on a statutory public holiday, you can optionally exclude that day from the percentage calculation.',halfDays:'Half days',halfDaysExplanation:'Morning and afternoon are tracked separately. For example, you can combine half a day of telework with half a day of leave or office work.',belgianHolidays:'Belgian public holidays',holidayExplanation:'The 10 Belgian legal public holidays are calculated automatically and shown in red. Replacement days are not added automatically because they can differ by employer or sector.',holidayWorkEyebrow:'Public holiday mode',holidayWorkTitle:'Working on {holiday}?',holidayWorkFunny1:'Your calendar says “public holiday”. You apparently replied “challenge accepted”. 😄',holidayWorkFunny2:'Even the coffee machine probably took the day off. You didn’t? ☕😅',holidayWorkFunny3:'Your laptop clearly forgot to check the public-holiday calendar. 💻🎉',holidayWorkQuestion:'Do you really want to plan {work} on this public holiday?',holidayWorkCountLabel:'Count this day towards my telework percentage',holidayWorkCountHint:'Turn this off if your employer exempts worked public holidays from the telework percentage calculation.',holidayWorkConfirm:'Yes, plan {work}',holidayWorkExcludedShort:'Excluded from telework %',holidayWorkIncludedShort:'Included in telework %',holidayBulkSkipped:'{n} public holiday(s) skipped. Work on a public holiday must be planned deliberately directly in the calendar.',standardWorkweek:'Standard working week',standardWorkweekExplanation:'Your selected workdays never block calendar days. They are only used as defaults for features such as period fill when “Skip days outside standard working week” is enabled.',standardTeleworkWeek:'Standard telework week',standardTeleworkWeekExplanation:'Choose the weekdays on which you normally work from home. When you apply the standard telework week to a month or year, those days become Telework and the other days in your working week become Office. Existing Telework/Office entries are adjusted to the pattern; Leave, Sick, custom categories and public holidays remain unchanged. You can still edit any day manually afterwards.',appearance:'Appearance',customizeCategory:'Customize category',appearanceHint:'The name and function stay fixed. You can only change the emoji and colour.',saveChanges:'Save changes',appearanceSaved:'Appearance updated.',understood:'Got it',feedbackContactTitle:'Feedback, bug or suggestion?',feedbackContactText:'Found something that does not work or have an idea for MijnTelewerk? Feel free to let me know.',feedbackType:'Type',feedbackOptionFeedback:'Feedback',feedbackOptionBug:'Bug',feedbackOptionSuggestion:'Suggestion',feedbackMessage:'Message',feedbackPlaceholder:'Briefly describe what you noticed or what you would like to see.',feedbackContactButton:'Contact',feedbackEmailHint:'Opens your own email app. Your planning is not included.',feedbackUnavailable:'Contact email has not been configured yet.',feedbackChooseMessage:'Please add a short message first.',feedbackMailOpened:'Your email app will open.',feedbackSubject:'MijnTelewerk — {type}',feedbackTypeFeedback:'Feedback',feedbackTypeBug:'Bug',feedbackTypeSuggestion:'Suggestion',accountTitle:'MijnTelewerk Account',accountEverywhere:'Keep your planning everywhere',passwordlessLogin:'Passwordless login',magicLinkIntro:'Enter your email address. You will receive a secure magic link to sign in.',emailAddress:'Email address',sendMagicLink:'Send magic link',accountLocalHint:'An account can later sync your planning across devices. Without an account, your data stays local in this browser.',accountPromoEyebrow:'Free account',accountPromoTitle:'Your planning is taking shape',accountPromoText:'Keep your planning safely in your account and view it later on your other devices.',accountPromoBackup:'Cloud backup',accountPromoSync:'Sync across devices',accountPromoReminders:'Personal reminders',accountPromoCreate:'Create free account',accountPromoLater:'Later',accountPromoNever:'Don\'t show again',signedInAs:'Signed in as',cloudPlanning:'Cloud planning',checkCloud:'Check cloud',uploadCurrentYear:'Upload current year',uploadHint:'Save this local year planning to your account',downloadCloud:'Load from cloud',downloadHint:'Replace this local year with your cloud planning',autoSync:'Automatic sync',autoSyncHint:'After the first link, changes are saved automatically. If local and cloud both change, sync pauses without overwriting anything.',reminderEmails:'Website reminder',reminderHint:'Choose when MijnTelewerk should show a pop-up on your next visit to remind you to report your telework.',reminderEnabled:'Enable reminder',reminderSchedule:'Reminder timing',reminderWeekly:'Weekly',reminderMonthly:'Monthly',reminderOn:'On',reminderAt:'At',reminderMonthlyMode:'When should we remind you?',reminderFixedDay:'Specific day of the month',reminderFirstWorkday:'First working day of the month',reminderLastWorkday:'Last working day of the month',reminderPopupEyebrow:'Reminder',reminderPopupTitle:'Still need to report telework?',reminderPopupText:'Don’t forget to report your telework details to your employer.',reminderLater:'Remind me later',reminderDone:'Done ✓',reminderSnoozed:'Sure, I’ll remind you again on a later visit.',reminderAcknowledged:'Done. I won’t bother you about this again this month.',reminderDayOfMonth:'Day of month',saveReminderSettings:'Save reminder',reminderSaved:'Reminder saved.',reminderMailPending:'The message only appears when you open MijnTelewerk.',welcomeBack:'Welcome back',welcomeBackHint:'Show a one-time funny message on your first working day after a long planned leave period.',welcomeBackEnabled:'Enable welcome-back message',welcomeBackMinDays:'From how many leave days?',saveAccountPreferences:'Save account preferences',preferencesSaved:'Account preferences saved.',welcomeBackNote:'The message only uses planned Leave days and appears at most once per leave period.',comingSoon:'Coming soon',signOut:'Sign out',addCategory:'Add category',dayNote:'Personal note',dayNoteAdd:'Add note',dayNoteEdit:'Edit note',dayNotePlaceholder:'E.g. appointment, practical reminder…',dayNoteHint:'The note is saved with your planning and syncs when you use an account.',saveNote:'Save note',deleteNote:'Delete note',noteSaved:'Note saved.',noteDeleted:'Note deleted.',name:'Name',emoji:'Emoji',quickChoice:'Quick choice',type:'Type',neutralDay:'Non-working day / neutral',telework:'Telework',office:'Office',leave:'Leave',sick:'Sick',holiday:'Public holiday',color:'Colour',cancel:'Cancel',add:'Add',whatPrint:'What do you want to print?',printHint:'Choose the view to print or save as PDF.',currentMonth:'Current month',fullYearOverview:'Full year overview',whatReset:'What do you want to reset?',resetHint:'Only your entered planning is removed. Automatic public holidays remain.',fullYear:'Full year',exporting:'Export',exportHint:'Export the planning for the selected year.',pdfHint:'Use the print view and choose “Save as PDF”',excelHint:'Daily planning + monthly overview for the selected year',icsHint:'Suitable for Apple Calendar, Outlook and other calendar apps',typeAutomatic:'Automatic · legal public holiday',typeTelework:'Counts as telework',typeOffice:'Counts as office',typeNeutral:'Does not count as worked time',deleteCategory:'Delete category',confirmDelete:'Delete category? Days using this category will also be cleared.',statusNone:'No worked days planned yet.',withinMaximum:'Within your maximum of {max}%.',aboveMaximum:'You are {delta} percentage point(s) above your maximum.',remaining:'Up to {n} extra telework day{plural} possible with the current planning.',noLimit:'No limit at 100%.',bannerEmptyTitle:'Your calendar is ready',bannerEmpty:'Plan a few workdays and I will start calculating.',banner90Title:'Houston, we lost the office',banner90:'{pct}% telework. At this rate your employer will need Google Maps to find your desk. You are {delta} percentage point(s) over the limit.',banner80Title:'Your office badge has a missing-person notice',banner80:'{pct}% telework. Reception is starting to wonder whether you are still on the payroll. {delta} percentage point(s) over your limit.',banner70Title:'Your office chair is looking for a new owner',banner70:'{pct}% telework. Your office chair has had plenty of time to think about its future. You are {delta} percentage point(s) over your limit.',bannerOverTitle:'The sofa has won',bannerOver:'You are {delta} percentage point(s) over your limit. Time to see your office building up close again. 🏢',bannerNearTitle:'Right on the line',bannerNear:'You are at {pct}% out of a maximum of {max}%. A few more enthusiastic home-working days and the calculator starts sweating.',banner25Title:'Your home office is having an identity crisis',banner25:'You are still below 25% telework. Your chair at home is starting to wonder whether it is still part of the family.',banner30Title:'Your Wi-Fi feels neglected',banner30:'Less than 30% telework. Your router is considering filing a missing-person report. There is still room to log in from home more often.',banner40Title:'Your commute is extremely fit',banner40:'You are below 40% telework. Your shoes are currently clocking more kilometres than your laptop.',bannerRoomTitle:'Your home office misses you',bannerRoom:'You still have roughly {n} telework days available. That coffee mug at home can put in a few more overtime hours.',bannerBalancedTitle:'Nicely balanced',bannerBalanced:'You still have {n} telework day{plural} of room. Enough for a strategic pyjama-trouser day.',holidayNewYear:"New Year's Day",holidayEasterMonday:'Easter Monday',holidayLabour:'Labour Day',holidayAscension:'Ascension Day',holidayWhitMonday:'Whit Monday',holidayNational:'Belgian National Day',holidayAssumption:'Assumption Day',holidayAllSaints:"All Saints' Day",holidayArmistice:'Armistice Day',holidayChristmas:'Christmas Day',themeOn:'🦇 Batman mode activated!',themeOff:'☀️ Back to daylight. Alfred can open the curtains again.',helpTitle:'How does the calculation work?',invalidRange:'Choose valid From and To dates.',rangeOrder:'The To date must be on or after the From date.',rangeYear:'The period must stay within the selected calendar year.',rangeDone:'{n} half-day slots filled.',resetMonthDone:'Month planning cleared.',resetYearDone:'Year planning cleared.',invalidCloud:'Invalid cloud planning.',backendNotLinked:'Account backend not connected yet.',backendLocalExplanation:'The planner continues to work entirely locally. First add your Supabase project details to <code>config.js</code> to enable accounts.',rlsHint:'The public anon key may be used in the browser; Row Level Security restricts planning access to the signed-in user.',cloudStatusInitial:'Check whether a planning already exists in your account for this year.',
    onboardingEyebrow:'First setup',onboardingTitle:'Make MijnTelewerk yours',onboardingIntro:'Four quick choices and your planner is ready.',onboardingStep1:'What is your maximum telework percentage?',onboardingStep1Hint:'You can always change this later in the planner.',onboardingStep2:'Which days are normally part of your working week?',onboardingStep2Hint:'This is only a default for quick fill. Every calendar day always remains manually editable.',onboardingStep3:'Do you have fixed telework days?',onboardingStep3Hint:'Select your fixed work-from-home days. Leave all days empty if your telework is flexible.',onboardingApplySchedule:'Immediately fill empty working days this year as Telework/Office',onboardingStep4:'Show Belgian public holidays automatically?',onboardingStep4Hint:'The 10 legal public holidays are calculated automatically. Replacement days remain manual.',onboardingBack:'Back',onboardingNext:'Next',onboardingStart:'Start my planning',onboardingLater:'Set up later',onboardingAdjust:'Adjust basic settings',onboardingYes:'Yes, automatically',onboardingNo:'No, I will add them',dayShortMon:'Mon',dayShortTue:'Tue',dayShortWed:'Wed',dayShortThu:'Thu',dayShortFri:'Fri',dayShortSat:'Sat',dayShortSun:'Sun'
  }
 };
Object.assign(I18N.nl,{
  leaveBudget:'Verlofbudget',leaveBudgetHint:'Hoeveel verlofdagen heb je beschikbaar in het geselecteerde jaar? Laat leeg als je dit niet wilt bijhouden.',leaveBudgetDays:'dagen',leaveBudgetPlanned:'ingepland',leaveBudgetRemaining:'resterend',leaveBudgetExceeded:'boven budget',leaveBudgetNotSet:'Verlofbudget instellen',leaveBudgetStatus:'{planned} / {budget} dagen · {remaining} resterend',leaveBudgetOverStatus:'{planned} / {budget} dagen · {over} te veel',leaveOverWarning:'⚠️ Je hebt {planned} verlofdagen ingepland bij een budget van {budget}. Dat is {over} dag(en) boven je budget.',leaveBudgetNoBlock:'Extra of overgedragen verlofdagen kun je nog steeds plannen.',smartLeavePlanner:'Slimme verlofplanner',smartLeavePlannerHint:'Zoek interessante momenten rond weekends en Belgische feestdagen.',leavePlannerTitle:'Verlofsuggesties voor {year}',leavePlannerIntro:'MijnTelewerk zoekt naar veel aaneengesloten vrije kalenderdagen met zo weinig mogelijk extra verlof.',leavePlannerBudget:'Budget',leavePlannerPlanned:'Gepland',leavePlannerRemaining:'Resterend',leavePlannerNoBudget:'Stel eerst je verlofbudget voor dit jaar in om gerichte suggesties te krijgen.',leavePlannerNoSuggestions:'Geen interessante extra combinaties gevonden binnen je resterende verlofbudget.',leaveSuggestionDaysOff:'{days} dagen vrij',leaveSuggestionCost:'{cost} verlofdag(en)',leaveSuggestionEfficiency:'{ratio} vrije dagen per verlofdag',leaveSuggestionHoliday:'Inclusief {holiday}',planSuggestion:'Plan dit voorstel',suggestionPlanned:'✅ {cost} verlofdag(en) ingepland voor {days} aaneengesloten vrije dagen.',onboardingStep4Leave:'Hoeveel verlofdagen heb je dit jaar?',onboardingStep4LeaveHint:'Optioneel. Hiermee kan MijnTelewerk je verlofbudget bewaken en slimme momenten voorstellen.',onboardingLeaveOptional:'Niet invullen = geen verlofbudget opvolgen',onboardingStep5:'Belgische feestdagen automatisch tonen?',onboardingIntro:'Vijf korte keuzes en je planner staat goed ingesteld.',leaveAppearanceHint:'Pas emoji en kleur aan en stel voor het geselecteerde jaar je verlofbudget in.'
});
Object.assign(I18N.fr,{
  leaveBudget:'Budget de congés',leaveBudgetHint:'Combien de jours de congé avez-vous pour l’année sélectionnée ? Laissez vide pour ne pas le suivre.',leaveBudgetDays:'jours',leaveBudgetPlanned:'planifiés',leaveBudgetRemaining:'restants',leaveBudgetExceeded:'au-dessus du budget',leaveBudgetNotSet:'Définir le budget de congés',leaveBudgetStatus:'{planned} / {budget} jours · {remaining} restants',leaveBudgetOverStatus:'{planned} / {budget} jours · {over} en trop',leaveOverWarning:'⚠️ Vous avez planifié {planned} jours de congé pour un budget de {budget}. Soit {over} jour(s) au-dessus.',leaveBudgetNoBlock:'Vous pouvez toujours planifier des jours supplémentaires ou reportés.',smartLeavePlanner:'Planificateur de congés',smartLeavePlannerHint:'Cherchez les meilleurs ponts autour des week-ends et jours fériés belges.',leavePlannerTitle:'Suggestions de congés pour {year}',leavePlannerIntro:'MijnTelewerk cherche le plus de jours libres consécutifs avec le moins de congés supplémentaires.',leavePlannerBudget:'Budget',leavePlannerPlanned:'Planifié',leavePlannerRemaining:'Restant',leavePlannerNoBudget:'Définissez d’abord votre budget de congés pour obtenir des suggestions ciblées.',leavePlannerNoSuggestions:'Aucune combinaison intéressante trouvée dans votre budget restant.',leaveSuggestionDaysOff:'{days} jours libres',leaveSuggestionCost:'{cost} jour(s) de congé',leaveSuggestionEfficiency:'{ratio} jours libres par jour de congé',leaveSuggestionHoliday:'Inclut {holiday}',planSuggestion:'Planifier',suggestionPlanned:'✅ {cost} jour(s) de congé planifié(s) pour {days} jours libres consécutifs.',onboardingStep4Leave:'Combien de jours de congé avez-vous cette année ?',onboardingStep4LeaveHint:'Optionnel. MijnTelewerk peut ainsi suivre votre budget et suggérer de bons moments.',onboardingLeaveOptional:'Vide = ne pas suivre le budget de congés',onboardingStep5:'Afficher automatiquement les jours fériés belges ?',onboardingIntro:'Cinq choix rapides et votre planning est prêt.',leaveAppearanceHint:'Adaptez l’emoji et la couleur et définissez votre budget de congés pour l’année sélectionnée.'
});
Object.assign(I18N.en,{
  leaveBudget:'Leave allowance',leaveBudgetHint:'How many leave days do you have available in the selected year? Leave blank if you do not want to track this.',leaveBudgetDays:'days',leaveBudgetPlanned:'planned',leaveBudgetRemaining:'remaining',leaveBudgetExceeded:'over allowance',leaveBudgetNotSet:'Set leave allowance',leaveBudgetStatus:'{planned} / {budget} days · {remaining} remaining',leaveBudgetOverStatus:'{planned} / {budget} days · {over} over',leaveOverWarning:'⚠️ You have planned {planned} leave days with an allowance of {budget}. That is {over} day(s) over your allowance.',leaveBudgetNoBlock:'You can still plan extra or carried-over leave days.',smartLeavePlanner:'Smart leave planner',smartLeavePlannerHint:'Find useful opportunities around weekends and Belgian public holidays.',leavePlannerTitle:'Leave suggestions for {year}',leavePlannerIntro:'MijnTelewerk looks for the most consecutive days off using as few extra leave days as possible.',leavePlannerBudget:'Allowance',leavePlannerPlanned:'Planned',leavePlannerRemaining:'Remaining',leavePlannerNoBudget:'Set your leave allowance for this year first to get targeted suggestions.',leavePlannerNoSuggestions:'No worthwhile extra combinations found within your remaining allowance.',leaveSuggestionDaysOff:'{days} days off',leaveSuggestionCost:'{cost} leave day(s)',leaveSuggestionEfficiency:'{ratio} days off per leave day',leaveSuggestionHoliday:'Includes {holiday}',planSuggestion:'Plan this',suggestionPlanned:'✅ {cost} leave day(s) planned for {days} consecutive days off.',onboardingStep4Leave:'How many leave days do you have this year?',onboardingStep4LeaveHint:'Optional. This lets MijnTelewerk track your allowance and suggest useful moments.',onboardingLeaveOptional:'Leave blank = do not track leave allowance',onboardingStep5:'Show Belgian public holidays automatically?',onboardingIntro:'Five quick choices and your planner is ready.',leaveAppearanceHint:'Adjust the emoji and colour and set your leave allowance for the selected year.'
});

Object.assign(I18N.nl,{
  leaveBridgeMode:'Slimme brugdagen',leaveLongMode:'Lang verlof',leaveLongQuestion:'Hoe lang wil je aaneengesloten vrij zijn?',leaveLongHint:'MijnTelewerk zoekt de periode waarvoor je zo weinig mogelijk verlofdagen nodig hebt.',weeks:'weken',includeTeleworkExtension:'Toon ook hoe lang je niet naar kantoor hoeft dankzij aansluitende telewerkdagen',searchBestPeriods:'Zoek beste periodes',teleworkNotLeaveNote:'Telewerk telt nooit als verlof. Het wordt alleen apart getoond als extra periode waarin je niet naar kantoor hoeft.',leaveLongNoSuggestions:'Geen geschikte periode gevonden voor {weeks} weken binnen je huidige planning{budget}.',leaveLongBudgetSuffix:' en resterende verlofbudget',leaveLongDaysOff:'{days} dagen echt vrij',leaveLongOfficeFree:'{days} dagen niet naar kantoor',leaveLongTeleworkDetail:'waarvan {telework} telewerkdag(en)',leaveLongNeeds:'{cost} verlofdag(en) nodig',leaveLongStarts:'Beste periode',leaveResultLeave:'{count} verlofdagen',leaveResultEfficiency:'{ratio}× rendement',leaveResultHome:'{days} dagen zonder kantoor',leaveResultTelework:'{count} telewerkdag(en)',leaveLongSearchInvalid:'Kies een duur tussen 1 en 8 weken.',leaveLongMonths:'Wanneer wil je ongeveer verlof nemen?',leaveLongMonthsHint:'Kies één of meerdere maanden. Een voorstel wordt getoond wanneer minstens de helft van de verlofperiode binnen je gekozen maanden valt.',leaveAllMonths:'Alle maanden',leaveChooseMonths:'Maanden kiezen',leaveMonthsSelected:'{count} maanden gekozen',leaveMonthsRequired:'Kies minstens één maand of gebruik Alle maanden.'
});
Object.assign(I18N.fr,{
  leaveBridgeMode:'Ponts avantageux',leaveLongMode:'Long congé',leaveLongQuestion:'Combien de temps souhaitez-vous être libre sans interruption ?',leaveLongHint:'MijnTelewerk cherche la période qui nécessite le moins de jours de congé.',weeks:'semaines',includeTeleworkExtension:'Afficher aussi combien de temps vous pouvez éviter le bureau grâce aux jours de télétravail adjacents',searchBestPeriods:'Chercher les meilleures périodes',teleworkNotLeaveNote:'Le télétravail ne compte jamais comme congé. Il est seulement affiché séparément comme période supplémentaire sans déplacement au bureau.',leaveLongNoSuggestions:'Aucune période adaptée trouvée pour {weeks} semaines avec votre planning actuel{budget}.',leaveLongBudgetSuffix:' et votre solde de congés',leaveLongDaysOff:'{days} jours réellement libres',leaveLongOfficeFree:'{days} jours sans aller au bureau',leaveLongTeleworkDetail:'dont {telework} jour(s) de télétravail',leaveLongNeeds:'{cost} jour(s) de congé nécessaires',leaveLongStarts:'Meilleure période',leaveResultLeave:'{count} jours de congé',leaveResultEfficiency:'{ratio}× rendement',leaveResultHome:'{days} jours sans bureau',leaveResultTelework:'{count} jour(s) de télétravail',leaveLongSearchInvalid:'Choisissez une durée entre 1 et 8 semaines.',leaveLongMonths:'Quand souhaitez-vous environ prendre congé ?',leaveLongMonthsHint:'Choisissez un ou plusieurs mois. Une proposition est affichée si au moins la moitié de la période tombe dans les mois choisis.',leaveAllMonths:'Tous les mois',leaveChooseMonths:'Choisir les mois',leaveMonthsSelected:'{count} mois choisis',leaveMonthsRequired:'Choisissez au moins un mois ou utilisez Tous les mois.'
});
Object.assign(I18N.en,{
  leaveBridgeMode:'Smart bridge days',leaveLongMode:'Long leave',leaveLongQuestion:'How long would you like to be continuously off?',leaveLongHint:'MijnTelewerk finds the period that needs the fewest leave days.',weeks:'weeks',includeTeleworkExtension:'Also show how long you can stay away from the office thanks to adjacent telework days',searchBestPeriods:'Find best periods',teleworkNotLeaveNote:'Telework never counts as leave. It is only shown separately as extra time without travelling to the office.',leaveLongNoSuggestions:'No suitable period found for {weeks} weeks within your current planning{budget}.',leaveLongBudgetSuffix:' and remaining leave allowance',leaveLongDaysOff:'{days} actual days off',leaveLongOfficeFree:'{days} days without going to the office',leaveLongTeleworkDetail:'including {telework} telework day(s)',leaveLongNeeds:'{cost} leave day(s) needed',leaveLongStarts:'Best period',leaveResultLeave:'{count} leave days',leaveResultEfficiency:'{ratio}× efficiency',leaveResultHome:'{days} days without office',leaveResultTelework:'{count} telework day(s)',leaveLongSearchInvalid:'Choose a duration between 1 and 8 weeks.',leaveLongMonths:'Roughly when would you like to take leave?',leaveLongMonthsHint:'Choose one or more months. A suggestion is shown when at least half of the leave period falls within your selected months.',leaveAllMonths:'All months',leaveChooseMonths:'Choose months',leaveMonthsSelected:'{count} months selected',leaveMonthsRequired:'Choose at least one month or use All months.'
});


Object.assign(I18N.nl,{openLeavePlanner:'Slimme verlofplanner openen',closeLeavePlanner:'Slimme verlofplanner sluiten'});
Object.assign(I18N.fr,{openLeavePlanner:'Ouvrir le planificateur de congés',closeLeavePlanner:'Fermer le planificateur de congés'});
Object.assign(I18N.en,{openLeavePlanner:'Open smart leave planner',closeLeavePlanner:'Close smart leave planner'});

let state = loadState();
const $ = id => document.getElementById(id);
let months = I18N.nl.months;
let weekdays = I18N.nl.weekdays;
function t(key, vars={}){let s=(I18N[state?.language]||I18N.nl)[key] ?? I18N.nl[key] ?? key;Object.entries(vars).forEach(([k,v])=>{s=String(s).replaceAll(`{${k}}`,v)});return s;}
function currentLocale(){return (I18N[state.language]||I18N.nl).locale;}

function feedbackEmail(){
  return String(window.MIJNTELEWERK_CONFIG?.FEEDBACK_EMAIL||'').trim();
}
function feedbackTypeLabel(value){
  return value==='bug'?t('feedbackTypeBug'):value==='suggestion'?t('feedbackTypeSuggestion'):t('feedbackTypeFeedback');
}
function openFeedbackEmail(){
  const email=feedbackEmail();
  const message=($('feedbackMessage')?.value||'').trim();
  const type=$('feedbackType')?.value||'feedback';
  if(!email){
    showToast(t('feedbackUnavailable'),3200);
    return;
  }
  if(!message){
    showToast(t('feedbackChooseMessage'),2600);
    $('feedbackMessage')?.focus();
    return;
  }

  const subject=t('feedbackSubject',{type:feedbackTypeLabel(type)});
  const technical=[
    '',
    '---',
    'MijnTelewerk',
    `Taal: ${state.language.toUpperCase()}`,
    `Jaar: ${state.selectedYear}`,
    `Browser: ${navigator.userAgent}`
  ].join('\n');

  const body=`${message}${technical}`;
  window.location.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  showToast(t('feedbackMailOpened'),2200);
}
function categoryName(c){if(!c)return'';const map={telework:'telework',office:'office',leave:'leave',sick:'sick',holiday:'holiday'};return map[c.id]?t(map[c.id]):c.name;}
function applyLanguage(){
  const pack=I18N[state.language]||I18N.nl; months=pack.months; weekdays=pack.weekdays; document.documentElement.lang=state.language;
  document.querySelectorAll('[data-i18n]').forEach(n=>{const k=n.dataset.i18n;if(pack[k]!=null)n.textContent=pack[k];});
  document.querySelectorAll('[data-i18n-html]').forEach(n=>{const k=n.dataset.i18nHtml;if(pack[k]!=null)n.innerHTML=pack[k];});
  document.querySelectorAll('[data-i18n-title]').forEach(n=>{const k=n.dataset.i18nTitle;if(pack[k]!=null)n.title=pack[k];});
  document.querySelectorAll('[data-i18n-aria]').forEach(n=>{const k=n.dataset.i18nAria;if(pack[k]!=null)n.setAttribute('aria-label',pack[k]);});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(n=>{const k=n.dataset.i18nPlaceholder;if(pack[k]!=null)n.setAttribute('placeholder',pack[k]);});
  const lang=$('languageSelect');if(lang)lang.value=state.language;
  const themeLabel=$('themeLabel');if(themeLabel)themeLabel.textContent=state.theme==='dark'?t('lightMode'):t('darkMode');
  holidayCache.clear();
}

const holidayCache = new Map();

function clone(o){ return JSON.parse(JSON.stringify(o)); }
function esc(s){ return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch])); }
function key(y,m,d){ return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function cat(id){ return state.categories.find(c => c.id === id); }
function formatNumber(n){ return Number(n).toLocaleString(currentLocale(), {maximumFractionDigits:1}); }

function loadState(){
  try{
    const current = localStorage.getItem(STORAGE_KEY);
    if(current) return normalizeState(JSON.parse(current));
    for(const legacyKey of LEGACY_KEYS){
      const raw = localStorage.getItem(legacyKey);
      if(raw){
        const migrated = normalizeState(JSON.parse(raw));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  }catch(err){ console.warn('Kon planning niet laden:', err); }
  return clone(defaults);
}

function normalizeState(parsed){
  const merged = {...clone(defaults), ...(parsed || {})};
  merged.removedDefaultCategories=Array.isArray(merged.removedDefaultCategories)?merged.removedDefaultCategories:[];
  merged.categories = normalizeCategories(merged.categories, merged.removedDefaultCategories);
  merged.days = normalizeDays(merged.days);
  if(!['month','year'].includes(merged.currentView)) merged.currentView = 'month';
  if(!['light','dark'].includes(merged.theme)) merged.theme = 'light';
  if(!['nl','fr','en'].includes(merged.language)) merged.language = 'nl';
  merged.autoHolidays = merged.autoHolidays !== false;
  merged.workingWeekdays = Array.isArray(merged.workingWeekdays) ? merged.workingWeekdays.map(Number).filter(d=>d>=0&&d<=6) : [1,2,3,4,5];
  merged.standardTeleworkWeekdays = Array.isArray(merged.standardTeleworkWeekdays) ? merged.standardTeleworkWeekdays.map(Number).filter(d=>merged.workingWeekdays.includes(d)) : [];
  merged.leaveBudgetByYear = merged.leaveBudgetByYear && typeof merged.leaveBudgetByYear==='object' ? merged.leaveBudgetByYear : {};
  merged.notes = merged.notes && typeof merged.notes==='object' ? Object.fromEntries(Object.entries(merged.notes).filter(([date,note])=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&typeof note==='string'&&note.trim()).map(([date,note])=>[date,note.trim().slice(0,500)])) : {};
  merged.holidayWorkExemptions = merged.holidayWorkExemptions && typeof merged.holidayWorkExemptions==='object' ? Object.fromEntries(Object.entries(merged.holidayWorkExemptions).filter(([date,value])=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&value===true)) : {};
  Object.keys(merged.leaveBudgetByYear).forEach(y=>{const v=Number(merged.leaveBudgetByYear[y]);if(!Number.isFinite(v)||v<0)delete merged.leaveBudgetByYear[y];else merged.leaveBudgetByYear[y]=Math.round(v*2)/2;});
  merged.removedDefaultCategories = merged.removedDefaultCategories.filter(id=>id==='sick');
  merged.onboardingComplete = merged.onboardingComplete === true;
  return merged;
}

function normalizeCategories(categories, removedDefaults=[]){
  const emojiById = {telework:'🏠',office:'🏢',leave:'🏖️',sick:'🤒',holiday:'🎉'};
  const source = Array.isArray(categories) ? categories : [];
  const cleaned = source
    .filter(c => c && c.id !== 'fixed-leave')
    .map(c => ({...c, emoji:c.emoji || emojiById[c.id] || '📌', selectable:c.id==='holiday'?false:(c.selectable!==false)}));
  clone(defaults.categories).forEach(req => {
    const existing = cleaned.find(c => c.id === req.id);
    if(!existing && (req.id==='leave' || !removedDefaults.includes(req.id))) cleaned.push(req);
    else if(existing) Object.assign(existing, {...req, ...existing, emoji:existing.emoji || req.emoji, color:req.id==='holiday'?req.color:existing.color});
  });
  ['telework','office','leave','holiday'].forEach(id=>{const c=cleaned.find(x=>x.id===id);if(c)c.locked=true;});
  const holidayIndex=cleaned.findIndex(c=>c.id==='holiday');
  if(holidayIndex>=0){const [holiday]=cleaned.splice(holidayIndex,1);cleaned.push(holiday);}
  return cleaned;
}

function normalizeDays(days){
  const result = {};
  Object.entries(days || {}).forEach(([date,value]) => {
    if(typeof value === 'string'){
      const id = value === 'fixed-leave' ? 'leave' : value;
      result[date] = {am:id,pm:id};
    }else if(value && typeof value === 'object'){
      result[date] = {
        am:value.am === 'fixed-leave' ? 'leave' : (value.am || null),
        pm:value.pm === 'fixed-leave' ? 'leave' : (value.pm || null)
      };
    }
  });
  return result;
}

function save(options={}){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent('mijntelewerk:state-changed', {detail:{
    year:+state.selectedYear,
    planningInteraction:options.planningInteraction===true
  }}));
}

let toastTimer = null;
function showToast(message, duration=2400){
  const toast=$('toast');
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),duration);
}
let themeToastTimer=null;
function showThemeToast(message,duration=2200){
  const toast=$('themeToast');
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(themeToastTimer);
  themeToastTimer=setTimeout(()=>toast.classList.remove('show'),duration);
}
function applyTheme(announce=false){
  const dark=state.theme==='dark';
  document.documentElement.dataset.theme=dark?'dark':'light';
  const btn=$('themeBtn');
  if(btn){
    btn.setAttribute('aria-pressed',String(dark));
    btn.title=dark?t('lightMode'):t('darkMode');
    $('themeIcon').textContent=dark?'☀️':'🌙';
    $('themeLabel').textContent=dark?t('lightMode'):t('darkMode');
  }
  if(announce) showThemeToast(dark?t('themeOn'):t('themeOff'));
}
function toggleTheme(){
  state.theme=state.theme==='dark'?'light':'dark';
  save();
  applyTheme(true);
}

function easterSunday(year){
  const a=year%19,b=Math.floor(year/100),c=year%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3);
  const h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451);
  const month=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;
  return new Date(year,month-1,day);
}
function addDays(date,days){ const d=new Date(date.getFullYear(),date.getMonth(),date.getDate()); d.setDate(d.getDate()+days); return d; }
function belgianHolidays(year){
  const cacheKey=`${state.language}-${year}`;
  if(holidayCache.has(cacheKey)) return holidayCache.get(cacheKey);
  const map=new Map(),add=(date,name)=>map.set(key(date.getFullYear(),date.getMonth(),date.getDate()),name),fixed=(m,d,n)=>add(new Date(year,m-1,d),n),easter=easterSunday(year);
  fixed(1,1,t('holidayNewYear')); add(addDays(easter,1),t('holidayEasterMonday')); fixed(5,1,t('holidayLabour')); add(addDays(easter,39),t('holidayAscension')); add(addDays(easter,50),t('holidayWhitMonday')); fixed(7,21,t('holidayNational')); fixed(8,15,t('holidayAssumption')); fixed(11,1,t('holidayAllSaints')); fixed(11,11,t('holidayArmistice')); fixed(12,25,t('holidayChristmas'));
  holidayCache.set(cacheKey,map); return map;
}
function holidayName(y,m,d){ if(state.autoHolidays===false)return null; return belgianHolidays(y).get(key(y,m,d)) || null; }

function initSelectors(){
  const ys=$('yearSelect'),ms=$('monthSelect'),cy=new Date().getFullYear(); ys.innerHTML='';
  for(let y=cy-5;y<=cy+20;y++) ys.innerHTML += `<option value="${y}" ${y===+state.selectedYear?'selected':''}>${y}</option>`;
  ms.innerHTML=months.map((m,i)=>`<option value="${i}" ${i===+state.selectedMonth?'selected':''}>${m}</option>`).join('');
  $('maxPercent').value=state.maxPercent; $('dayPartSelect').value=state.selectedDayPart||'full';
  initRangeInputs();
}
function initRangeInputs(){
  const start=$('rangeStart'),end=$('rangeEnd');
  if(!start||!end)return;
  const y=+state.selectedYear,m=+state.selectedMonth,min=`${y}-01-01`,max=`${y}-12-31`;
  start.min=end.min=min; start.max=end.max=max;
  const monthStart=`${y}-${String(m+1).padStart(2,'0')}-01`;
  const monthEnd=`${y}-${String(m+1).padStart(2,'0')}-${String(new Date(y,m+1,0).getDate()).padStart(2,'0')}`;
  if(!start.value || !start.value.startsWith(`${y}-`)) start.value=monthStart;
  if(!end.value || !end.value.startsWith(`${y}-`)) end.value=monthEnd;
}
function typeLabel(c){ return ''; }
function typeTooltip(c){ if(c.automatic)return t('typeAutomatic'); if(c.type==='telework')return t('typeTelework'); if(c.type==='office')return t('typeOffice'); return t('typeNeutral'); }
function dayPartLabel(part){ return part==='am'?t('morningHalf').replace(' (½ dag)','').replace(' (½ journée)','').replace(' (½ day)',''):part==='pm'?t('afternoonHalf').replace(' (½ dag)','').replace(' (½ journée)','').replace(' (½ day)',''):t('fullDay'); }

function leaveBudgetForYear(year=+state.selectedYear){const value=Number(state.leaveBudgetByYear?.[year]);return Number.isFinite(value)&&value>=0?value:null;}
function leavePlannedForYear(year=+state.selectedYear){let planned=0,prefix=`${year}-`;Object.entries(state.days).forEach(([date,slots])=>{if(!date.startsWith(prefix))return;if(slots?.am==='leave')planned+=0.5;if(slots?.pm==='leave')planned+=0.5;});return Math.round(planned*2)/2;}
function leaveStatusForYear(year=+state.selectedYear){const budget=leaveBudgetForYear(year),planned=leavePlannedForYear(year);if(budget==null)return{budget:null,planned,remaining:null,over:0};const remaining=Math.round((budget-planned)*2)/2;return{budget,planned,remaining:Math.max(0,remaining),over:Math.max(0,-remaining)};}
function leaveBudgetText(year=+state.selectedYear){const s=leaveStatusForYear(year);if(s.budget==null)return t('leaveBudgetNotSet');return s.over>0?t('leaveBudgetOverStatus',{planned:formatNumber(s.planned),budget:formatNumber(s.budget),over:formatNumber(s.over)}):t('leaveBudgetStatus',{planned:formatNumber(s.planned),budget:formatNumber(s.budget),remaining:formatNumber(s.remaining)});}
function leaveBudgetLegendHtml(year=+state.selectedYear){
  const s=leaveStatusForYear(year);
  if(s.budget==null)return `<span class="legend-leave-budget"><span class="legend-leave-budget-main">${esc(t('leaveBudgetNotSet'))}</span></span>`;
  const main=`${formatNumber(s.planned)} / ${formatNumber(s.budget)} ${t('leaveBudgetDays')}`;
  const detail=s.over>0?`${formatNumber(s.over)} ${t('leaveBudgetExceeded')}`:`${formatNumber(s.remaining)} ${t('leaveBudgetRemaining')}`;
  return `<span class="legend-leave-budget ${s.over>0?'over':''}"><span class="legend-leave-budget-main">${esc(main)}</span><span class="legend-leave-budget-detail">${esc(detail)}</span></span>`;
}
function leaveOverWarning(year=+state.selectedYear){const s=leaveStatusForYear(year);return s.over>0?t('leaveOverWarning',{planned:formatNumber(s.planned),budget:formatNumber(s.budget),over:formatNumber(s.over)}):'';}

function renderLegend(){
  const l=$('legendList'); l.innerHTML='';
  state.categories.forEach(c=>{
    const b=document.createElement('button'); b.type='button';
    b.className=`legend-item ${state.activeCategoryId===c.id?'active':''} ${c.selectable===false?'non-selectable':''}`; if(c.id==='holiday')b.dataset.holiday='true';
    const editHtml=['telework','office','leave'].includes(c.id)?`<span class="legend-edit" role="button" tabindex="0" aria-label="${esc(t('customizeCategory'))}">✎</span>`:'';
    const removeHtml=c.locked?'':`<span class="legend-remove" aria-label="${esc(t('deleteCategory'))}">×</span>`;
    b.innerHTML=`<span class="legend-emoji">${esc(c.emoji||'📌')}</span><span class="legend-swatch" style="background:${c.color}"></span><span><span class="legend-name">${esc(categoryName(c))}</span>${c.id==='leave'?leaveBudgetLegendHtml():`<span class="legend-type">${typeLabel(c)}</span>`}</span><span class="legend-actions">${editHtml}${removeHtml}</span>`;
    const activate=()=>{ if(c.selectable===false)return; state.activeCategoryId=c.id; save(); renderAll(); };
    b.onclick=e=>{
      if(e.target.classList.contains('legend-remove')) return removeCategory(c.id);
      if(e.target.classList.contains('legend-edit')) return openCategoryAppearance(c.id);
      activate();
    };
    b.onkeydown=e=>{
      if((e.key==='Enter'||e.key===' ') && e.target.classList.contains('legend-edit')){e.preventDefault();openCategoryAppearance(c.id);}
    };
    l.appendChild(b);
  });
  $('recurringCategory').innerHTML=state.categories.filter(c=>c.selectable!==false).map(c=>`<option value="${c.id}">${esc(c.emoji||'')} ${esc(categoryName(c))}</option>`).join('');
}
let appearanceCategoryId=null;
function openCategoryAppearance(id){
  const c=cat(id); if(!c || !['telework','office','leave'].includes(id))return;
  appearanceCategoryId=id;
  $('categoryAppearanceTitle').textContent=`${t('customizeCategory')}: ${categoryName(c)}`;
  $('appearanceEmoji').value=c.emoji||'';
  $('appearanceColor').value=c.color||'#3f9b72';
  const leaveSection=$('leaveBudgetSection');if(leaveSection){leaveSection.classList.toggle('hidden',id!=='leave');$('categoryAppearanceHint').textContent=id==='leave'?t('leaveAppearanceHint'):t('appearanceHint');$('leaveBudgetYear').textContent=state.selectedYear;$('annualLeaveBudget').value=leaveBudgetForYear()==null?'':String(leaveBudgetForYear());updateLeaveBudgetPreview();}
  document.querySelectorAll('.appearance-emoji-preset').forEach(b=>b.classList.toggle('selected',b.dataset.emoji===(c.emoji||'')));
  $('categoryAppearanceDialog').showModal();
}
function closeCategoryAppearance(){
  appearanceCategoryId=null;
  $('categoryAppearanceDialog').close();
}

function updateLeaveBudgetPreview(){const el=$('leaveBudgetPreview');if(!el)return;const raw=$('annualLeaveBudget')?.value,planned=leavePlannedForYear(),temp=raw===''?null:Number(raw);el.classList.remove('over');if(temp==null||!Number.isFinite(temp)){el.innerHTML=`<strong>${formatNumber(planned)}</strong> ${esc(t('leaveBudgetPlanned'))} · ${esc(t('leaveBudgetNotSet'))}`;return;}const rem=Math.round((temp-planned)*2)/2;if(rem<0)el.classList.add('over');el.innerHTML=rem<0?`<strong>${formatNumber(planned)}</strong> / ${formatNumber(temp)} · <b>${formatNumber(-rem)} ${esc(t('leaveBudgetExceeded'))}</b>`:`<strong>${formatNumber(planned)}</strong> / ${formatNumber(temp)} · <b>${formatNumber(rem)} ${esc(t('leaveBudgetRemaining'))}</b>`;}
function assignmentClassForLeave(y,m,d,part){const id=state.days[key(y,m,d)]?.[part]||null;if(id==='leave')return{kind:'free'};if(id==='sick'||(id&&!['telework','office'].includes(id)))return{kind:'blocked'};return{kind:'candidate'};}
function legalHolidayName(y,m,d){return belgianHolidays(y).get(key(y,m,d))||null;}
function isCalendarFreeDay(dt){const y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate();if(!state.workingWeekdays.includes(dt.getDay())||legalHolidayName(y,m,d))return true;const slots=state.days[key(y,m,d)]||{};return slots.am==='leave'&&slots.pm==='leave';}
function leaveWindowInfo(start,end){let cost=0;const holidays=[],workdayHolidays=[],parts=[];for(let dt=new Date(start);dt<=end;dt=addDays(dt,1)){const y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),wd=dt.getDay(),h=legalHolidayName(y,m,d);if(h){if(!holidays.includes(h))holidays.push(h);if(state.workingWeekdays.includes(wd)&&!workdayHolidays.includes(h))workdayHolidays.push(h);continue;}if(!state.workingWeekdays.includes(wd))continue;for(const part of ['am','pm']){const info=assignmentClassForLeave(y,m,d,part);if(info.kind==='blocked')return null;if(info.kind==='candidate'){cost+=0.5;parts.push({y,m,d,part});}}}return{cost:Math.round(cost*2)/2,holiday:holidays.join(' · '),holidays,workdayHolidays,parts};}
function smartLeaveSuggestions(year=+state.selectedYear){
  const s=leaveStatusForYear(year);if(s.budget==null||s.remaining<0.5)return[];
  const now=new Date(),min=year===now.getFullYear()?new Date(year,now.getMonth(),now.getDate(),12):new Date(year,0,1,12),max=new Date(year,11,31,12),all=[];
  for(let len=3;len<=10;len++)for(let start=new Date(min);start<=max;start=addDays(start,1)){
    const end=addDays(start,len-1);if(end>max)break;
    if(!isCalendarFreeDay(start)||!isCalendarFreeDay(end))continue;
    const info=leaveWindowInfo(start,end);if(!info||info.cost<0.5||info.cost>s.remaining||info.cost>5)continue;
    // Slimme brugdagen moeten daadwerkelijk voordeel halen uit een wettelijke feestdag
    // die op een normale werkdag valt. Een gewoon weekend + verlofdag hoort hier niet thuis.
    if(!(info.workdayHolidays||[]).length)continue;
    const ratio=len/info.cost;if(ratio<1.8)continue;
    all.push({start:new Date(start),end,days:len,cost:info.cost,ratio,holiday:info.workdayHolidays.join(' · '),holidays:info.workdayHolidays||[],parts:info.parts});
  }
  all.sort((a,b)=>b.ratio-a.ratio||Number(!!b.holiday)-Number(!!a.holiday)||b.days-a.days||a.cost-b.cost||a.start-b.start);

  // Give legal holidays on normal workdays a fair chance to surface. This prevents
  // an unrelated high-ratio window in the same month from hiding e.g. 11 November.
  const out=[];
  for(const [holidayKey,holidayLabel] of belgianHolidays(year)){
    const [yy,mm,dd]=holidayKey.split('-').map(Number),dt=new Date(yy,mm-1,dd,12);
    if(dt<min||dt>max||!state.workingWeekdays.includes(dt.getDay()))continue;
    const candidates=all.filter(c=>(c.holidays||[]).includes(holidayLabel));
    if(!candidates.length)continue;
    const best=candidates[0];
    if(!out.some(x=>best.start<=x.end&&best.end>=x.start))out.push(best);
  }
  for(const c of all){
    if(out.includes(c)||out.some(x=>c.start<=x.end&&c.end>=x.start))continue;
    if(out.filter(x=>x.start.getMonth()===c.start.getMonth()).length)continue;
    out.push(c);if(out.length>=6)break;
  }
  if(out.length<4)for(const c of all){if(out.includes(c)||out.some(x=>c.start<=x.end&&c.end>=x.start))continue;out.push(c);if(out.length>=6)break;}
  return out.sort((a,b)=>a.start-b.start).slice(0,6);
}
function formatDateRange(start,end){const f=new Intl.DateTimeFormat(currentLocale(),{day:'numeric',month:'short'});return`${f.format(start)} – ${f.format(end)}`;}
function dateDiffDays(a,b){return Math.round((new Date(b.getFullYear(),b.getMonth(),b.getDate(),12)-new Date(a.getFullYear(),a.getMonth(),a.getDate(),12))/86400000)+1;}
function daySlotsForOfficeExtension(dt){const y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),wd=dt.getDay();if(!state.workingWeekdays.includes(wd)||legalHolidayName(y,m,d))return{home:true,telework:0};const slots=state.days[key(y,m,d)]||{am:null,pm:null};const explicit=slots.am||slots.pm;if(!explicit&&state.standardTeleworkWeekdays?.includes(wd))return{home:true,telework:1};let tele=0;for(const part of ['am','pm']){const id=slots[part];if(id==='telework')tele+=0.5;else if(id==='leave'){}else return{home:false,telework:0};}return{home:true,telework:tele};}
function officeFreeExtension(start,end,includeTelework){if(!includeTelework)return{start:new Date(start),end:new Date(end),days:dateDiffDays(start,end),telework:0};const year=start.getFullYear(),yearStart=new Date(year,0,1,12),yearEnd=new Date(year,11,31,12);let hs=new Date(start),he=new Date(end),tele=0;let cur=addDays(hs,-1);while(cur>=yearStart){const x=daySlotsForOfficeExtension(cur);if(!x.home)break;tele+=x.telework;hs=new Date(cur);cur=addDays(cur,-1);}cur=addDays(he,1);while(cur<=yearEnd){const x=daySlotsForOfficeExtension(cur);if(!x.home)break;tele+=x.telework;he=new Date(cur);cur=addDays(cur,1);}return{start:hs,end:he,days:dateDiffDays(hs,he),telework:Math.round(tele*2)/2};}
function selectedLongLeaveMonths(){return [...document.querySelectorAll('#leaveMonthChoices input[data-month]:checked')].map(b=>Number(b.dataset.month));}
function windowMatchesMonths(start,end,selectedMonths){if(!selectedMonths||selectedMonths.length===12)return true;let total=0,inside=0;for(let dt=new Date(start);dt<=end;dt=addDays(dt,1)){total++;if(selectedMonths.includes(dt.getMonth()))inside++;}return inside>=Math.ceil(total/2);}
function targetedLeaveSuggestions(year,weeks,includeTelework,selectedMonths=null){const targetDays=Math.max(7,Math.round(Number(weeks)*7)),status=leaveStatusForYear(year),maxCost=status.budget==null?Math.ceil(targetDays/7)*5:Math.max(0,status.remaining),now=new Date(),min=year===now.getFullYear()?new Date(year,now.getMonth(),now.getDate(),12):new Date(year,0,1,12),max=new Date(year,11,31,12),all=[];for(let start=new Date(min);start<=max;start=addDays(start,1)){const end=addDays(start,targetDays-1);if(end>max)break;if(!windowMatchesMonths(start,end,selectedMonths))continue;const info=leaveWindowInfo(start,end);if(!info||info.cost<0.5||info.cost>maxCost)continue;const ext=officeFreeExtension(start,end,includeTelework);all.push({start:new Date(start),end,days:targetDays,cost:info.cost,ratio:targetDays/info.cost,holiday:info.holiday,holidays:info.holidays||[],parts:info.parts,officeStart:ext.start,officeEnd:ext.end,officeDays:ext.days,teleworkExtension:ext.telework});}all.sort((a,b)=>a.cost-b.cost||b.officeDays-a.officeDays||b.ratio-a.ratio||a.start-b.start);const out=[];for(const c of all){if(out.some(x=>Math.abs(c.start-x.start)<20*86400000))continue;out.push(c);if(out.length>=6)break;}return out;}
let currentLeaveSuggestions=[];
let leavePlannerMode='bridges';
function setLeavePlannerMode(mode){leavePlannerMode=mode==='long'?'long':'bridges';$('leaveBridgeModeBtn')?.classList.toggle('active',leavePlannerMode==='bridges');$('leaveLongModeBtn')?.classList.toggle('active',leavePlannerMode==='long');$('leaveLongControls')?.classList.toggle('hidden',leavePlannerMode!=='long');renderLeavePlanner();}
function renderLeavePlanner(){
  const year=+state.selectedYear,s=leaveStatusForYear(year);
  $('leavePlannerTitle').textContent=t('leavePlannerTitle',{year});
  const list=$('leaveSuggestionList');

  const resultCard=(x,i,{long=false,includeTelework=false}={})=>{
    const officeExtra=long&&includeTelework&&x.officeDays>x.days;
    const title=long?t('leaveLongDaysOff',{days:x.days}):t('leaveSuggestionDaysOff',{days:x.days});
    const notes=[];
    if(x.holiday)notes.push(`<span class="leave-result-note holiday">🎉 ${esc(x.holiday)}</span>`);
    if(officeExtra){
      const tw=x.teleworkExtension?` · ${esc(t('leaveResultTelework',{count:formatNumber(x.teleworkExtension)}))}`:'';
      notes.push(`<span class="leave-result-note home">🏠 ${esc(t('leaveResultHome',{days:x.officeDays}))}${tw}</span>`);
    }
    return `<article class="leave-result-card">
      <div class="leave-result-head">
        <span class="leave-result-date">${esc(formatDateRange(x.start,x.end))}</span>
        <strong class="leave-result-title">${esc(title)}</strong>
      </div>
      <div class="leave-result-stats">
        <span><b>${esc(formatNumber(x.cost))}</b> ${esc(t('leaveResultLeave',{count:''}).replace(/^\s+|\s+$/g,'').replace(/^[0-9.,]*\s*/,''))}</span>
        <span><b>${esc(formatNumber(x.ratio))}×</b> ${esc(t('leaveResultEfficiency',{ratio:''}).replace(/^×?\s*/,'').replace(/^[0-9.,]*×?\s*/,''))}</span>
      </div>
      ${notes.length?`<div class="leave-result-notes">${notes.join('')}</div>`:''}
      <button class="btn secondary leave-result-action" type="button" data-suggestion-index="${i}">${esc(t('planSuggestion'))}</button>
    </article>`;
  };

  if(leavePlannerMode==='long'){
    const weeks=Number($('leaveTargetWeeks')?.value||2);
    const includeTelework=!!$('includeTeleworkExtension')?.checked;
    if(!Number.isFinite(weeks)||weeks<1||weeks>8){
      list.innerHTML=`<div class="leave-suggestion-empty">${esc(t('leaveLongSearchInvalid'))}</div>`;
      currentLeaveSuggestions=[];
      return;
    }
    const selectedMonths=selectedLongLeaveMonths();
    if(!selectedMonths.length){
      list.innerHTML=`<div class="leave-suggestion-empty">${esc(t('leaveMonthsRequired'))}</div>`;
      currentLeaveSuggestions=[];
      return;
    }
    currentLeaveSuggestions=targetedLeaveSuggestions(year,weeks,includeTelework,selectedMonths);
    if(!currentLeaveSuggestions.length){
      list.innerHTML=`<div class="leave-suggestion-empty">${esc(t('leaveLongNoSuggestions',{weeks:formatNumber(weeks),budget:s.budget==null?'':t('leaveLongBudgetSuffix')}))}</div>`;
      return;
    }
    list.innerHTML=currentLeaveSuggestions.map((x,i)=>resultCard(x,i,{long:true,includeTelework})).join('');
  }else{
    if(s.budget==null){
      list.innerHTML=`<div class="leave-suggestion-empty">${esc(t('leavePlannerNoBudget'))}</div>`;
      currentLeaveSuggestions=[];
      return;
    }
    currentLeaveSuggestions=smartLeaveSuggestions(year);
    if(!currentLeaveSuggestions.length){
      list.innerHTML=`<div class="leave-suggestion-empty">${esc(t('leavePlannerNoSuggestions'))}</div>`;
      return;
    }
    list.innerHTML=currentLeaveSuggestions.map((x,i)=>resultCard(x,i)).join('');
  }

  list.querySelectorAll('[data-suggestion-index]').forEach(b=>b.onclick=()=>applyLeaveSuggestion(+b.dataset.suggestionIndex));
  if(leavePlannerDrawerOpen)requestAnimationFrame(positionLeavePlannerDrawer);
}
function renderLongLeaveMonthChoices(){const wrap=$('leaveMonthChoices');if(!wrap)return;const previous=wrap.children.length?selectedLongLeaveMonths():months.map((_,i)=>i);wrap.innerHTML=months.map((name,i)=>`<label><input type="checkbox" data-month="${i}" ${previous.includes(i)?'checked':''}><span>${esc(name.slice(0,3))}</span></label>`).join('');wrap.dataset.language=state.language;wrap.querySelectorAll('input[data-month]').forEach(cb=>cb.onchange=()=>{syncAllMonthsChoice();if(leavePlannerMode==='long')renderLeavePlanner();});syncAllMonthsChoice();}
function syncAllMonthsChoice(){const all=$('leaveAllMonthsBtn'),checks=[...document.querySelectorAll('#leaveMonthChoices input[data-month]')],selected=checks.filter(cb=>cb.checked),allOn=checks.length>0&&selected.length===checks.length,label=$('leaveChooseMonthsLabel');if(all){all.classList.toggle('active',allOn);all.setAttribute('aria-pressed',String(allOn));}if(label){label.textContent=allOn?t('leaveChooseMonths'):t('leaveMonthsSelected',{count:selected.length});}}
function applyLeaveSuggestion(i){const s=currentLeaveSuggestions[i];if(!s)return;for(const p of s.parts){const k=key(p.y,p.m,p.d),slots=state.days[k]||{am:null,pm:null},cur=slots[p.part];if(cur==null||cur==='telework'||cur==='office')slots[p.part]='leave';state.days[k]=slots;}save({planningInteraction:true});renderAll();renderLeavePlanner();showToast(t('suggestionPlanned',{cost:formatNumber(s.cost),days:s.days}));}

function removeCategory(id){
  if(!confirm(t('confirmDelete')))return;
  state.categories=state.categories.filter(x=>x.id!==id);
  if(id==='sick' && !state.removedDefaultCategories.includes(id))state.removedDefaultCategories.push(id);
  Object.keys(state.days).forEach(k=>{ const s=state.days[k]; if(s.am===id)s.am=null; if(s.pm===id)s.pm=null; cleanupDay(k); });
  if(state.activeCategoryId===id) state.activeCategoryId=state.categories.find(c=>c.selectable!==false)?.id||'telework'; save(); renderAll();
}
function effectiveSlot(y,m,d,part){
  const k=key(y,m,d),userId=state.days[k]?.[part]||null;
  if(userId) return {categoryId:userId,label:categoryName(cat(userId))||userId,automatic:false};
  const holiday=holidayName(y,m,d); if(holiday)return {categoryId:'holiday',label:holiday,automatic:true}; return null;
}
function renderUserAssignments(y,m,d){
  const slots=state.days[key(y,m,d)]||{am:null,pm:null};
  const makeSlot=id=>{
    if(!id||id==='holiday')return null;
    return {categoryId:id,label:categoryName(cat(id))||id,automatic:false};
  };
  const am=makeSlot(slots.am),pm=makeSlot(slots.pm);
  if(!am&&!pm)return'';

  if(am&&pm&&am.categoryId===pm.categoryId&&am.label===pm.label){
    const c=cat(am.categoryId);
    return `<span class="day-tag full-tag user-day-tag" style="background:${c?.color||'#7d8796'}">${esc(am.label)}</span>`;
  }

  const slotHtml=(slot,prefix)=>!slot
    ?`<span class="half-tag empty-half"><b>${prefix}</b> —</span>`
    :(()=>{const c=cat(slot.categoryId);return `<span class="half-tag" style="--tag-color:${c?.color||'#7d8796'}"><b>${prefix}</b><span>${esc(slot.label)}</span></span>`})();

  return `<div class="half-tags user-half-tags">${slotHtml(am,'VM')}${slotHtml(pm,'NM')}</div>`;
}

function renderDayAssignments(y,m,d){
  const userHtml=renderUserAssignments(y,m,d);
  const holiday=holidayName(y,m,d);

  if(holiday){
    const holidayCategory=cat('holiday');
    const holidayHtml=`<span class="day-tag full-tag holiday-base-tag" style="background:${holidayCategory?.color||'#c94752'}">${esc(holiday)}</span>`;
    if(userHtml){
      const dateKey=key(y,m,d);
      const stored=state.days[dateKey]||{};
      const hasWork=['am','pm'].some(part=>categoryCountsAsWork(stored?.[part]));
      const exempt=hasWork&&holidayWorkIsExempt(dateKey);
      const countState=hasWork?`<span class="holiday-count-status ${exempt?'excluded':'included'}">${esc(t(exempt?'holidayWorkExcludedShort':'holidayWorkIncludedShort'))}</span>`:'';
      return `<div class="holiday-day-stack">${userHtml}${countState}${holidayHtml}</div>`;
    }
    return holidayHtml;
  }

  return userHtml;
}


let editingNoteKey=null;
let dayNoteTooltipEl=null;
function hideDayNoteTooltip(){
  if(dayNoteTooltipEl){
    dayNoteTooltipEl.remove();
    dayNoteTooltipEl=null;
  }
}
function showDayNoteTooltip(button,text){
  hideDayNoteTooltip();
  if(!button||!text)return;
  const tip=document.createElement('div');
  tip.className='day-note-tooltip';
  tip.textContent=text;
  tip.setAttribute('role','tooltip');
  document.body.appendChild(tip);
  dayNoteTooltipEl=tip;

  const r=button.getBoundingClientRect();
  const margin=10,gap=7;
  const tr=tip.getBoundingClientRect();
  let left=r.right-tr.width;
  left=Math.max(margin,Math.min(left,window.innerWidth-tr.width-margin));
  let top=r.top-tr.height-gap;
  if(top<margin)top=r.bottom+gap;
  top=Math.min(top,window.innerHeight-tr.height-margin);

  tip.style.left=`${Math.round(left)}px`;
  tip.style.top=`${Math.round(top)}px`;
  tip.classList.add('visible');
}
function noteForDate(y,m,d){return state.notes?.[key(y,m,d)]||'';}
function noteDateLabel(y,m,d){return new Date(y,m,d).toLocaleDateString(currentLocale(),{weekday:'long',day:'numeric',month:'long',year:'numeric'});}
function openNoteDialog(y,m,d){
  const dlg=$('dayNoteDialog'),dateKey=key(y,m,d),note=state.notes?.[dateKey]||'';
  if(!dlg)return;
  editingNoteKey=dateKey;
  $('dayNoteDate').textContent=noteDateLabel(y,m,d);
  $('dayNoteText').value=note;
  $('dayNoteDelete').classList.toggle('hidden',!note);
  applyLanguage();
  dlg.showModal();
  requestAnimationFrame(()=>$('dayNoteText')?.focus());
}
function closeNoteDialog(){editingNoteKey=null;$('dayNoteDialog')?.close();}
function saveDayNote(){
  if(!editingNoteKey)return;
  const text=($('dayNoteText')?.value||'').trim().slice(0,500);
  state.notes=state.notes||{};
  if(text)state.notes[editingNoteKey]=text;else delete state.notes[editingNoteKey];
  save();closeNoteDialog();renderCalendar();showToast(text?t('noteSaved'):t('noteDeleted'));
}
function deleteDayNote(){
  if(!editingNoteKey)return;
  if(state.notes)delete state.notes[editingNoteKey];
  save();closeNoteDialog();renderCalendar();showToast(t('noteDeleted'));
}

function renderCalendar(){
  hideDayNoteTooltip();
  const cal=$('calendar'); cal.innerHTML='';
  weekdays.forEach((w,i)=>{
    const h=document.createElement('div');
    h.className=`cal-head ${i>=5?'weekend-head':''}`;
    h.textContent=w;
    h.style.gridColumn=String(i+1);
    h.style.gridRow='1';
    cal.appendChild(h);
  });
  const y=+state.selectedYear,m=+state.selectedMonth; $('monthTitle').textContent=`${months[m]} ${y}`;
  const first=new Date(y,m,1),offset=(first.getDay()+6)%7,dim=new Date(y,m+1,0).getDate(),prev=new Date(y,m,0).getDate(),cells=Math.ceil((offset+dim)/7)*7,today=new Date();

  for(let i=0;i<cells;i++){
    let d,cm=m,cy=y,current=true;
    if(i<offset){d=prev-offset+i+1;cm--;current=false;if(cm<0){cm=11;cy--;}}
    else if(i>=offset+dim){d=i-offset-dim+1;cm++;current=false;if(cm>11){cm=0;cy++;}}
    else d=i-offset+1;

    const dt=new Date(cy,cm,d),isWeekend=dt.getDay()===0||dt.getDay()===6;
    const col=(i%7)+1,row=Math.floor(i/7)+2;
    const b=document.createElement('button');
    b.type='button';
    b.className=`day ${current?'':'other'} ${isWeekend?'weekend':''} ${col===7?'last-col':''}`;
    b.style.gridColumn=String(col);
    b.style.gridRow=String(row);
    if(current&&today.getFullYear()===cy&&today.getMonth()===cm&&today.getDate()===d)b.classList.add('today');
    const assignments=renderDayAssignments(cy,cm,d);
    b.innerHTML=`<span class="day-number">${d}</span>${assignments}`;
    b.onclick=()=>{
      if(!current)return;
      const selected=state.activeCategoryId;
      if(shouldConfirmHolidayWork(cy,cm,d,selected,state.selectedDayPart)){
        openHolidayWorkDialog(cy,cm,d,selected,state.selectedDayPart);
        return;
      }
      applyToDate(cy,cm,d,selected,state.selectedDayPart);
      save({planningInteraction:true});renderAll();
      if(selected==='leave'){const w=leaveOverWarning(cy);if(w)showToast(w,3800);}
    };
    cal.appendChild(b);

    if(current){
      const noteText=noteForDate(cy,cm,d);
      const noteBtn=document.createElement('button');
      noteBtn.type='button';
      noteBtn.className=`day-note-btn no-print ${noteText?'has-note':''}`;
      noteBtn.style.gridColumn=String(col);
      noteBtn.style.gridRow=String(row);
      noteBtn.textContent=noteText?'✎':'+';
      noteBtn.setAttribute('aria-label',`${noteText?t('dayNoteEdit'):t('dayNoteAdd')} — ${noteDateLabel(cy,cm,d)}`);
      if(noteText){
        noteBtn.addEventListener('mouseenter',()=>showDayNoteTooltip(noteBtn,noteText));
        noteBtn.addEventListener('mouseleave',hideDayNoteTooltip);
        noteBtn.addEventListener('focus',()=>showDayNoteTooltip(noteBtn,noteText));
        noteBtn.addEventListener('blur',hideDayNoteTooltip);
      }
      noteBtn.onclick=e=>{e.stopPropagation();hideDayNoteTooltip();openNoteDialog(cy,cm,d);};
      cal.appendChild(noteBtn);
    }
  }
}
let pendingHolidayWork=null;
function categoryCountsAsWork(categoryId){
  const c=cat(categoryId);
  return c?.type==='telework'||c?.type==='office';
}
function holidayWorkIsExempt(dateKey){
  if(state.holidayWorkExemptions?.[dateKey]!==true)return false;
  const [y,m,d]=dateKey.split('-').map(Number);
  return !!legalHolidayName(y,m-1,d);
}
function wouldAddCategory(y,m,d,categoryId,part){
  const slots=state.days[key(y,m,d)]||{am:null,pm:null};
  if(part==='full')return !(slots.am===categoryId&&slots.pm===categoryId);
  return slots[part]!==categoryId;
}
function shouldConfirmHolidayWork(y,m,d,categoryId,part){
  return !!legalHolidayName(y,m,d)&&categoryCountsAsWork(categoryId)&&wouldAddCategory(y,m,d,categoryId,part);
}
function openHolidayWorkDialog(y,m,d,categoryId,part){
  const holiday=legalHolidayName(y,m,d),c=cat(categoryId);
  if(!holiday||!c)return;
  const dateKey=key(y,m,d),work=categoryName(c);
  pendingHolidayWork={y,m,d,categoryId,part,dateKey};
  const funnyKey=['holidayWorkFunny1','holidayWorkFunny2','holidayWorkFunny3'][(m+d)%3];
  $('holidayWorkTitle').textContent=t('holidayWorkTitle',{holiday});
  $('holidayWorkFunny').textContent=t(funnyKey);
  $('holidayWorkQuestion').textContent=t('holidayWorkQuestion',{work});
  $('holidayWorkCountCheckbox').checked=!holidayWorkIsExempt(dateKey);
  $('holidayWorkConfirmBtn').textContent=t('holidayWorkConfirm',{work});
  $('holidayWorkDialog').showModal();
}
function closeHolidayWorkDialog(){
  pendingHolidayWork=null;
  $('holidayWorkDialog')?.close();
}
function confirmHolidayWork(){
  if(!pendingHolidayWork)return;
  const p=pendingHolidayWork;
  state.holidayWorkExemptions=state.holidayWorkExemptions||{};
  applyToDate(p.y,p.m,p.d,p.categoryId,p.part);
  if($('holidayWorkCountCheckbox').checked)delete state.holidayWorkExemptions[p.dateKey];
  else state.holidayWorkExemptions[p.dateKey]=true;
  pendingHolidayWork=null;
  $('holidayWorkDialog').close();
  save({planningInteraction:true});
  renderAll();
}
function applyToDate(y,m,d,categoryId,part){
  const k=key(y,m,d),slots=state.days[k]||{am:null,pm:null};
  if(part==='full'){const same=slots.am===categoryId&&slots.pm===categoryId;slots.am=same?null:categoryId;slots.pm=same?null:categoryId;}else slots[part]=slots[part]===categoryId?null:categoryId;
  state.days[k]=slots;cleanupDay(k);
}
function cleanupDay(k){
  const s=state.days[k];
  if(!s||(!s.am&&!s.pm)){
    delete state.days[k];
    if(state.holidayWorkExemptions)delete state.holidayWorkExemptions[k];
    return;
  }
  const hasWork=['am','pm'].some(part=>categoryCountsAsWork(s?.[part]));
  if(!hasWork&&state.holidayWorkExemptions)delete state.holidayWorkExemptions[k];
}

function statsForYear(year){
  let tele=0,office=0,pctTele=0,pctOffice=0;
  const prefix=`${year}-`;
  Object.entries(state.days).forEach(([date,slots])=>{
    if(!date.startsWith(prefix))return;
    const exempt=holidayWorkIsExempt(date);
    ['am','pm'].forEach(part=>{
      const c=cat(slots?.[part]);
      if(c?.type==='telework'){tele+=0.5;if(!exempt)pctTele+=0.5;}
      if(c?.type==='office'){office+=0.5;if(!exempt)pctOffice+=0.5;}
    });
  });
  const worked=tele+office,pctWorked=pctTele+pctOffice,pct=pctWorked?pctTele/pctWorked*100:0,max=+state.maxPercent||0;
  let remaining=0;
  if(max>=100)remaining=Infinity;
  else if(max>0){
    const r=max/100,raw=((r*pctWorked)-pctTele)/(1-r);
    remaining=Math.max(0,Math.floor((raw+1e-9)*2)/2);
  }
  return {tele,office,worked,pctTele,pctOffice,pctWorked,pct,max,remaining};
}
function renderStats(){
  const s=statsForYear(+state.selectedYear); $('currentPercent').textContent=`${formatNumber(s.pct)}%`; $('teleworkCount').textContent=formatNumber(s.tele); $('workedCount').textContent=formatNumber(s.worked);
  const bar=$('progressBar'); bar.style.width=`${Math.min(s.pct,100)}%`; bar.style.background=s.pct>s.max?'var(--danger)':'var(--success)';
  if(!s.pctWorked)$('statusText').textContent=t('statusNone');
  else if(s.pct>s.max)$('statusText').textContent=t('aboveMaximum',{delta:formatNumber(s.pct-s.max)});
  else $('statusText').textContent=t('withinMaximum',{max:formatNumber(s.max)});
  $('remainingText').textContent=s.remaining===Infinity?t('noLimit'):t('remaining',{n:formatNumber(s.remaining),plural:s.remaining===1?'':'s',teleworkDayWord:s.remaining===1?'telewerkdag':'telewerkdagen'});
  renderFunMessage(s);
}
function renderFunMessage(s){
  const banner=$('funBanner'),icon=$('funIcon'),title=$('funTitle'),message=$('funMessage'); banner.className='fun-banner planner-fun-status';
  if(!s.pctWorked){icon.textContent='👋';title.textContent=t('bannerEmptyTitle');message.textContent=t('bannerEmpty');return;}
  const delta=s.max-s.pct;
  if(s.pct>s.max){
    banner.classList.add('danger'); const vars={pct:formatNumber(s.pct),delta:formatNumber(Math.abs(delta))};
    if(s.pct>=90){icon.textContent='🛰️';title.textContent=t('banner90Title');message.textContent=t('banner90',vars);return;}
    if(s.pct>=80){icon.textContent='🕵️';title.textContent=t('banner80Title');message.textContent=t('banner80',vars);return;}
    if(s.pct>=70){icon.textContent='🪑';title.textContent=t('banner70Title');message.textContent=t('banner70',vars);return;}
    icon.textContent='🚨';title.textContent=t('bannerOverTitle');message.textContent=t('bannerOver',vars);return;
  }
  if(delta<=1){banner.classList.add('warning');icon.textContent='😅';title.textContent=t('bannerNearTitle');message.textContent=t('bannerNear',{pct:formatNumber(s.pct),max:formatNumber(s.max)});return;}
  if(s.pct<25){banner.classList.add('success');icon.textContent='🛋️';title.textContent=t('banner25Title');message.textContent=t('banner25');return;}
  if(s.pct<30){banner.classList.add('success');icon.textContent='📶';title.textContent=t('banner30Title');message.textContent=t('banner30');return;}
  if(s.pct<40){banner.classList.add('success');icon.textContent='👟';title.textContent=t('banner40Title');message.textContent=t('banner40');return;}
  if(s.remaining>=5){banner.classList.add('success');icon.textContent='☕';title.textContent=t('bannerRoomTitle');message.textContent=t('bannerRoom',{n:formatNumber(s.remaining)});return;}
  banner.classList.add('success');icon.textContent='🏠';title.textContent=t('bannerBalancedTitle');message.textContent=t('bannerBalanced',{n:formatNumber(s.remaining),plural:s.remaining===1?'':'s',teleworkDayWord:s.remaining===1?'telewerkdag':'telewerkdagen'});
}

function countsForMonth(y,m){
  const counts={};state.categories.forEach(c=>counts[c.id]=0);const dim=new Date(y,m+1,0).getDate();
  for(let d=1;d<=dim;d++)['am','pm'].forEach(part=>{const slot=effectiveSlot(y,m,d,part);if(slot&&counts[slot.categoryId]!=null)counts[slot.categoryId]+=0.5;}); return counts;
}
function renderSummary(){
  const y=+state.selectedYear,m=+state.selectedMonth,counts=countsForMonth(y,m);
  if($('monthTotalsTitle')) $('monthTotalsTitle').textContent=`${months[m]} ${y}`;
  $('monthSummary').innerHTML=state.categories.map(c=>`<div class="summary-item"><span>${esc(c.emoji||'')} ${esc(categoryName(c))}</span><strong>${formatNumber(counts[c.id]||0)}</strong></div>`).join('');
}

function renderYearOverview(){
  const y=+state.selectedYear,container=$('yearOverview');
  $('yearTitle').textContent=`Planning ${y}`;
  container.innerHTML='';
  for(let m=0;m<12;m++){
    const box=document.createElement('section');
    box.className='mini-month';
    box.innerHTML=`<h3>${months[m]}</h3><div class="mini-grid"></div>`;
    const grid=box.querySelector('.mini-grid');
    weekdays.forEach(w=>{
      const h=document.createElement('div');
      h.className='mini-head';
      h.textContent=w.substring(0,1);
      grid.appendChild(h);
    });
    const first=new Date(y,m,1),
      offset=(first.getDay()+6)%7,
      dim=new Date(y,m+1,0).getDate(),
      cells=Math.ceil((offset+dim)/7)*7;
    for(let i=0;i<cells;i++){
      const cell=document.createElement('div');
      if(i<offset||i>=offset+dim){
        cell.className='mini-day other';
        grid.appendChild(cell);
        continue;
      }
      const d=i-offset+1,
        dt=new Date(y,m,d),
        weekend=dt.getDay()===0||dt.getDay()===6;
      cell.className=`mini-day ${weekend?'weekend':''}`;
      const am=effectiveSlot(y,m,d,'am'),
        pm=effectiveSlot(y,m,d,'pm'),
        slots=[am,pm].filter(Boolean);
      let markers='';
      slots.forEach(slot=>{
        const c=cat(slot.categoryId);
        markers+=`<span class="mini-marker" title="${esc(slot.label)}" style="background:${c?.color||'#7d8796'}"></span>`;
      });
      const holiday=holidayName(y,m,d);
      cell.innerHTML=`<span class="mini-num">${d}</span><div class="mini-markers">${markers}</div>${holiday?`<div class="mini-holiday" title="${esc(holiday)}">${esc(holiday)}</div>`:''}`;
      grid.appendChild(cell);
    }
    container.appendChild(box);
  }
}

function setDateAssignment(y,m,d,id,part){
  const k=key(y,m,d),slots=state.days[k]||{am:null,pm:null};
  if(part==='full'){slots.am=id;slots.pm=id;}else slots[part]=id;
  state.days[k]=slots;
}
function recurring(scope){
  const wd=+$('recurringWeekday').value,id=$('recurringCategory').value,part=$('recurringDayPart').value,y=+state.selectedYear,start=scope==='year'?0:+state.selectedMonth,end=scope==='year'?11:+state.selectedMonth;
  let count=0,skippedHolidays=0;
  for(let m=start;m<=end;m++){
    for(let d=1;d<=new Date(y,m+1,0).getDate();d++){
      if(new Date(y,m,d).getDay()!==wd)continue;
      // Een vaste weekdag mag nooit een Belgische wettelijke feestdag overschrijven.
      // Dit geldt ook als automatische feestdagen tijdelijk verborgen zijn.
      if(legalHolidayName(y,m,d)){skippedHolidays++;continue;}
      const slots=state.days[key(y,m,d)]||{am:null,pm:null};
      if(slots.am==='holiday'||slots.pm==='holiday'){skippedHolidays++;continue;}
      setDateAssignment(y,m,d,id,part);count++;
    }
  }
  save({planningInteraction:true});renderAll();
  const filledMsg=state.language==='fr'?`✅ ${count} ${count===1?'jour':'jours'} rempli${count===1?'':'s'}.`:state.language==='en'?`✅ ${count} ${count===1?'day':'days'} filled.`:`✅ ${count} ${count===1?'dag':'dagen'} ingevuld.`;
  const holidayMsg=skippedHolidays?(state.language==='fr'?` ${skippedHolidays} jour${skippedHolidays===1?' férié a été ignoré.':'s fériés ont été ignorés.'}`:state.language==='en'?` ${skippedHolidays} public holiday${skippedHolidays===1?' was':'s were'} skipped.`:` ${skippedHolidays} feestdag${skippedHolidays===1?' is':'en zijn'} overgeslagen.`):'';
  const leaveWarning=id==='leave'?leaveOverWarning(y):'';showToast((filledMsg+holidayMsg)+(leaveWarning?` ${leaveWarning}`:''),leaveWarning?4200:2400);
}
function parseDateInput(value){
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');
  if(!match)return null;
  const y=+match[1],m=+match[2]-1,d=+match[3],date=new Date(y,m,d,12,0,0);
  return date.getFullYear()===y&&date.getMonth()===m&&date.getDate()===d?date:null;
}
function fillRange(){
  const start=parseDateInput($('rangeStart').value),end=parseDateInput($('rangeEnd').value),selectedYear=+state.selectedYear;
  if(!start||!end){showToast('⚠️ Kies eerst een geldige begin- en einddatum.');return;}
  if(start>end){showToast('⚠️ De einddatum moet na de begindatum liggen.');return;}
  if(start.getFullYear()!==selectedYear||end.getFullYear()!==selectedYear){showToast(`⚠️ Kies datums binnen ${selectedYear}.`);return;}
  const id=$('recurringCategory').value,part=$('recurringDayPart').value,skipWeekends=$('rangeSkipWeekends').checked,skipHolidays=$('rangeSkipHolidays').checked;
  const workCategory=categoryCountsAsWork(id);
  let count=0,skippedWorkHolidays=0;
  for(let dt=new Date(start);dt<=end;dt.setDate(dt.getDate()+1)){
    const y=dt.getFullYear(),m=dt.getMonth(),d=dt.getDate(),weekday=dt.getDay();
    if(skipWeekends&&!state.workingWeekdays.includes(weekday))continue;
    const legalHoliday=legalHolidayName(y,m,d);
    if(workCategory&&legalHoliday){skippedWorkHolidays++;continue;}
    if(skipHolidays&&legalHoliday)continue;
    setDateAssignment(y,m,d,id,part);count++;
  }
  save({planningInteraction:true});renderAll();let msg=count?(state.language==='fr'?`✅ ${count} ${count===1?'jour':'jours'} rempli${count===1?'':'s'}.`:state.language==='en'?`✅ ${count} ${count===1?'day':'days'} filled.`:`✅ ${count} ${count===1?'dag':'dagen'} ingevuld.`):(state.language==='fr'?'ℹ️ Aucun jour rempli avec ces filtres.':state.language==='en'?'ℹ️ No days filled with these filters.':'ℹ️ Geen dagen ingevuld met deze filters.');const leaveWarning=id==='leave'?leaveOverWarning(selectedYear):'';if(leaveWarning)msg+=` ${leaveWarning}`;if(skippedWorkHolidays)msg+=` ${t('holidayBulkSkipped',{n:skippedWorkHolidays})}`;showToast(msg,(leaveWarning||skippedWorkHolidays)?4200:2400);
}
let quickFillMode='recurring';
function renderStandardSchedulePicker(){
  document.querySelectorAll('[data-standard-telework]').forEach(cb=>{
    const day=Number(cb.dataset.standardTelework);
    cb.checked=state.standardTeleworkWeekdays.includes(day);
    cb.disabled=!state.workingWeekdays.includes(day);
  });
}
function setQuickFillMode(mode){
  quickFillMode=mode==='range'?'range':'recurring';
  const range=quickFillMode==='range';
  $('recurringModeBtn').classList.toggle('active',!range);
  $('rangeModeBtn').classList.toggle('active',range);
  $('recurringFields').classList.toggle('hidden',range);
  $('rangeFields').classList.toggle('hidden',!range);
  $('recurringCategory').closest('label').classList.remove('hidden');
  $('recurringDayPart').closest('label').classList.remove('hidden');
  $('recurringActions').classList.toggle('hidden',range);
  $('applyRangeBtn').classList.toggle('hidden',!range);
}
function applyStandardSchedule(scope,{saveAfter=true,toast=true}={}){
  const teleDays=state.standardTeleworkWeekdays.filter(d=>state.workingWeekdays.includes(d));
  if(!teleDays.length){ if(toast)showToast(t('noFixedTelework')); return 0; }
  const y=+state.selectedYear,start=scope==='month'?+state.selectedMonth:0,end=scope==='month'?+state.selectedMonth:11;
  const touched=new Set();
  for(let m=start;m<=end;m++){
    const dim=new Date(y,m+1,0).getDate();
    for(let d=1;d<=dim;d++){
      const dt=new Date(y,m,d),weekday=dt.getDay();
      if(!state.workingWeekdays.includes(weekday))continue;
      // Wettelijke feestdagen worden altijd beschermd, ook wanneer automatische feestdagen verborgen zijn.
      if(legalHolidayName(y,m,d))continue;
      const k=key(y,m,d),desired=teleDays.includes(weekday)?'telework':'office';
      const slots=state.days[k]||{am:null,pm:null};
      let changed=false;
      for(const part of ['am','pm']){
        const current=slots[part];
        // Opnieuw toepassen mag enkel lege velden en bestaande Telewerk/Kantoor-velden bijwerken.
        // Verlof, Ziek en eigen categorieën blijven daardoor onaangeroerd.
        if(current==null || current==='telework' || current==='office'){
          if(current!==desired){ slots[part]=desired; changed=true; }
        }
      }
      if(changed){state.days[k]=slots;touched.add(k);}
    }
  }
  if(saveAfter){save({planningInteraction:true});renderAll();}
  if(toast)showToast(t('standardScheduleApplied',{n:formatNumber(touched.size)}));
  return touched.size;
}
function bindStandardSchedulePicker(){
  document.querySelectorAll('[data-standard-telework]').forEach(cb=>cb.addEventListener('change',()=>{
    state.standardTeleworkWeekdays=[...document.querySelectorAll('[data-standard-telework]:checked')].map(x=>Number(x.dataset.standardTelework)).filter(d=>state.workingWeekdays.includes(d));
    save();
  }));
}
function setView(view){
  state.currentView=view==='year'?'year':'month';
  save();
  $('monthViewBtn').classList.toggle('active',state.currentView==='month');
  $('yearViewBtn').classList.toggle('active',state.currentView==='year');
  $('monthPrintArea').classList.toggle('hidden',state.currentView!=='month');
  $('yearPrintArea').classList.toggle('hidden',state.currentView!=='year');
  $('monthTotalsBtn')?.classList.toggle('hidden',state.currentView!=='month');
  $('leavePlannerToggle')?.classList.toggle('hidden',state.currentView==='year');
  if(state.currentView==='year'&&leavePlannerDrawerOpen)setLeavePlannerDrawer(false);
  document.querySelector('.planning-card')?.classList.toggle('year-mode-active',state.currentView==='year');
  document.querySelector('.planning-selects')?.classList.toggle('year-mode',state.currentView==='year');
}
function renderDialogLabels(){
  const y=+state.selectedYear,m=+state.selectedMonth;
  $('printMonthLabel').textContent=`${months[m]} ${y}`;
  $('printYearLabel').textContent=String(y);
  $('resetMonthLabel').textContent=state.language==='fr'?`Effacer ${months[m].toLowerCase()} ${y}`:state.language==='en'?`Clear ${months[m]} ${y}`:`Wis ${months[m].toLowerCase()} ${y}`;
  $('resetYearLabel').textContent=state.language==='fr'?`Effacer tous les jours saisis de ${y}`:state.language==='en'?`Clear all entered days in ${y}`:`Wis alle ingevoerde dagen van ${y}`;
}
function printScope(scope){
  $('printDialog').close();
  document.body.classList.remove('print-month','print-year');
  document.body.classList.add(scope==='year'?'print-year':'print-month');
  window.print();
  setTimeout(()=>document.body.classList.remove('print-month','print-year'),250);
}
function resetScope(scope){
  const y=+state.selectedYear,m=+state.selectedMonth,prefix=scope==='year'?`${y}-`:`${y}-${String(m+1).padStart(2,'0')}-`;
  const question=state.language==='fr'?(scope==='year'?`Effacer tout le planning de ${y} ?`:`Effacer le planning de ${months[m]} ${y} ?`):state.language==='en'?(scope==='year'?`Clear all planning for ${y}?`:`Clear the planning for ${months[m]} ${y}?`):(scope==='year'?`Planning voor het volledige jaar ${y} wissen?`:`Planning voor ${months[m]} ${y} wissen?`);
  if(!confirm(question))return;Object.keys(state.days).forEach(k=>{if(k.startsWith(prefix))delete state.days[k];});Object.keys(state.notes||{}).forEach(k=>{if(k.startsWith(prefix))delete state.notes[k];});Object.keys(state.holidayWorkExemptions||{}).forEach(k=>{if(k.startsWith(prefix))delete state.holidayWorkExemptions[k];});save();$('resetDialog').close();renderAll();showToast(scope==='month'?t('resetMonthDone'):t('resetYearDone'));
}


function xmlEsc(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function excelCol(n){let s='';while(n>0){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26);}return s;}
function sheetXml(rows,widths=[]){
  const rowXml=rows.map((row,ri)=>{
    const cells=row.map((value,ci)=>{
      const ref=`${excelCol(ci+1)}${ri+1}`,style=ri===0?' s="1"':'';
      if(typeof value==='number'&&Number.isFinite(value))return `<c r="${ref}"${style}><v>${value}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${style}><is><t>${xmlEsc(value??'')}</t></is></c>`;
    }).join('');
    return `<row r="${ri+1}">${cells}</row>`;
  }).join('');
  const cols=widths.length?`<cols>${widths.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols>`:'';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${cols}<sheetData>${rowXml}</sheetData></worksheet>`;
}
function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function u16(n){return new Uint8Array([n&255,(n>>>8)&255]);}
function u32(n){return new Uint8Array([n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]);}
function concatBytes(parts){const len=parts.reduce((a,b)=>a+b.length,0),out=new Uint8Array(len);let pos=0;for(const part of parts){out.set(part,pos);pos+=part.length;}return out;}
function makeZip(files){
  const enc=new TextEncoder(),locals=[],centrals=[];let offset=0;
  for(const file of files){
    const name=enc.encode(file.name),data=typeof file.data==='string'?enc.encode(file.data):file.data,crc=crc32(data);
    const local=concatBytes([u32(0x04034b50),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),name,data]);
    locals.push(local);
    centrals.push(concatBytes([u32(0x02014b50),u16(20),u16(20),u16(0),u16(0),u16(0),u16(0),u32(crc),u32(data.length),u32(data.length),u16(name.length),u16(0),u16(0),u16(0),u16(0),u32(0),u32(offset),name]));
    offset+=local.length;
  }
  const central=concatBytes(centrals),end=concatBytes([u32(0x06054b50),u16(0),u16(0),u16(files.length),u16(files.length),u32(central.length),u32(offset),u16(0)]);
  return concatBytes([...locals,central,end]);
}
function dayName(date){const sets={nl:['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],fr:['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};return (sets[state.language]||sets.nl)[date.getDay()];}
function exportExcel(){
  const y=+state.selectedYear;const headers=state.language==='fr'?['Date','Jour','Matin','Après-midi','Jour travaillé','Jour de télétravail','Note']:state.language==='en'?['Date','Day','Morning','Afternoon','Worked day','Telework day','Note']:['Datum','Dag','Voormiddag','Namiddag','Gewerkte dag','Telewerkdag','Notitie'];const planning=[headers];
  for(let m=0;m<12;m++)for(let d=1;d<=new Date(y,m+1,0).getDate();d++){
    const am=effectiveSlot(y,m,d,'am'),pm=effectiveSlot(y,m,d,'pm'),note=state.notes?.[key(y,m,d)]||'';if(!am&&!pm&&!note)continue;
    const slots=[am,pm],worked=slots.reduce((n,slot)=>n+(slot&&['telework','office'].includes(cat(slot.categoryId)?.type)?0.5:0),0),tele=slots.reduce((n,slot)=>n+(slot&&cat(slot.categoryId)?.type==='telework'?0.5:0),0);
    planning.push([`${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}/${y}`,dayName(new Date(y,m,d)),am?.label||'',pm?.label||'',worked,tele,state.notes?.[key(y,m,d)]||'']);
  }
  const s=statsForYear(y),overview=state.language==='fr'?[['Vue annuelle MijnTelewerk',String(y)],['Pourcentage maximum de télétravail',`${formatNumber(s.max)}%`],['Pourcentage actuel de télétravail',`${formatNumber(s.pct)}%`],['Jours de télétravail',s.tele],['Jours de bureau',s.office],['Jours travaillés',s.worked],[],['Mois','Télétravail','Bureau','Travaillé','Pourcentage de télétravail']]:state.language==='en'?[['MijnTelewerk year overview',String(y)],['Maximum telework percentage',`${formatNumber(s.max)}%`],['Current telework percentage',`${formatNumber(s.pct)}%`],['Telework days',s.tele],['Office days',s.office],['Worked days',s.worked],[],['Month','Telework','Office','Worked','Telework percentage']]:[['MijnTelewerk jaaroverzicht',String(y)],['Maximum telewerkpercentage',`${formatNumber(s.max)}%`],['Actueel telewerkpercentage',`${formatNumber(s.pct)}%`],['Telewerkdagen',s.tele],['Kantoordagen',s.office],['Gewerkte dagen',s.worked],[],['Maand','Telewerk','Kantoor','Gewerkt','Telewerkpercentage']];
  for(let m=0;m<12;m++){
    let tele=0,office=0,pctTele=0,pctOffice=0;const dim=new Date(y,m+1,0).getDate();
    for(let d=1;d<=dim;d++){
      const exempt=holidayWorkIsExempt(key(y,m,d));
      ['am','pm'].forEach(part=>{
        const slot=effectiveSlot(y,m,d,part),type=slot?cat(slot.categoryId)?.type:null;
        if(type==='telework'){tele+=0.5;if(!exempt)pctTele+=0.5;}
        if(type==='office'){office+=0.5;if(!exempt)pctOffice+=0.5;}
      });
    }
    const worked=tele+office,pctWorked=pctTele+pctOffice;
    overview.push([months[m],tele,office,worked,pctWorked?`${formatNumber(pctTele/pctWorked*100)}%`:'0%']);
  }
  const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbook=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${state.language==='fr'?'Planning':state.language==='en'?'Planning':'Planning'}" sheetId="1" r:id="rId1"/><sheet name="${state.language==='fr'?'Aperçu':state.language==='en'?'Overview':'Overzicht'}" sheetId="2" r:id="rId2"/></sheets></workbook>`;
  const workbookRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`;
  const zip=makeZip([{name:'[Content_Types].xml',data:contentTypes},{name:'_rels/.rels',data:rels},{name:'xl/workbook.xml',data:workbook},{name:'xl/_rels/workbook.xml.rels',data:workbookRels},{name:'xl/styles.xml',data:styles},{name:'xl/worksheets/sheet1.xml',data:sheetXml(planning,[13,14,25,25,14,14,38])},{name:'xl/worksheets/sheet2.xml',data:sheetXml(overview,[28,18,18,18,22])}]);
  const blob=new Blob([zip],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`mijntelewerk-${y}.xlsx`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);$('exportDialog').close();
}

function icsEscape(text){return String(text).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function icsDate(y,m,d){return `${y}${String(m+1).padStart(2,'0')}${String(d).padStart(2,'0')}`;}
function nextDateString(y,m,d){const dt=new Date(y,m,d);dt.setDate(dt.getDate()+1);return icsDate(dt.getFullYear(),dt.getMonth(),dt.getDate());}
function exportIcs(){
  const y=+state.selectedYear,events=[],stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  for(let m=0;m<12;m++)for(let d=1;d<=new Date(y,m+1,0).getDate();d++){
    const am=effectiveSlot(y,m,d,'am'),pm=effectiveSlot(y,m,d,'pm'),note=state.notes?.[key(y,m,d)]||'';if(!am&&!pm&&!note)continue;
    let title,description;if(am&&pm&&am.categoryId===pm.categoryId&&am.label===pm.label){title=am.label;description=`${t('fullDay')}: ${am.label}`;}else if(am||pm){title='MijnTelewerk';const amLabel=state.language==='fr'?'Matin':state.language==='en'?'Morning':'Voormiddag',pmLabel=state.language==='fr'?'Après-midi':state.language==='en'?'Afternoon':'Namiddag';description=`${amLabel}: ${am?.label||'—'}\n${pmLabel}: ${pm?.label||'—'}`;}else{title=t('dayNote');description='';}if(note)description+=`${description?'\n\n':''}${t('dayNote')}: ${note}`;
    const uid=`mijntelewerk-${key(y,m,d)}-${Math.random().toString(36).slice(2)}@mijntelewerk.be`;
    events.push(['BEGIN:VEVENT',`UID:${uid}`,`DTSTAMP:${stamp}Z`,`DTSTART;VALUE=DATE:${icsDate(y,m,d)}`,`DTEND;VALUE=DATE:${nextDateString(y,m,d)}`,`SUMMARY:${icsEscape(title)}`,`DESCRIPTION:${icsEscape(description)}`,'END:VEVENT'].join('\r\n'));
  }
  const ics=['BEGIN:VCALENDAR','VERSION:2.0',`PRODID:-//MijnTelewerk//${state.language.toUpperCase()}`,'CALSCALE:GREGORIAN','METHOD:PUBLISH',...events,'END:VCALENDAR'].join('\r\n');
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`mijntelewerk-${y}.ics`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);$('exportDialog').close();
}


let onboardingStep=1;
function renderOnboarding(){
  const dlg=$('onboardingDialog'); if(!dlg)return;
  dlg.querySelectorAll('[data-onboarding-step]').forEach(el=>el.classList.toggle('hidden',Number(el.dataset.onboardingStep)!==onboardingStep));
  $('onboardingProgress').textContent=`${onboardingStep}/5`;
  $('onboardingBackBtn').classList.toggle('hidden',onboardingStep===1);
  $('onboardingNextBtn').classList.toggle('hidden',onboardingStep===5);
  $('onboardingStartBtn').classList.toggle('hidden',onboardingStep!==5);
  $('onboardingMaxPercent').value=state.maxPercent;
  document.querySelectorAll('[data-workday]').forEach(cb=>cb.checked=state.workingWeekdays.includes(Number(cb.dataset.workday)));
  document.querySelectorAll('[data-teleworkday]').forEach(cb=>{ const day=Number(cb.dataset.teleworkday); cb.checked=state.standardTeleworkWeekdays.includes(day); cb.disabled=!state.workingWeekdays.includes(day); });
  const applyBox=$('onboardingApplySchedule'); if(applyBox) applyBox.checked=!state.onboardingComplete && state.standardTeleworkWeekdays.length>0;
  if($('onboardingLeaveBudget'))$('onboardingLeaveBudget').value=leaveBudgetForYear()==null?'':String(leaveBudgetForYear());
  const radio=document.querySelector(`input[name="onboardingHolidays"][value="${state.autoHolidays?'yes':'no'}"]`); if(radio)radio.checked=true;
}
function openOnboarding(resetStep=true){ if(resetStep)onboardingStep=1; applyLanguage(); renderOnboarding(); const dlg=$('onboardingDialog'); if(dlg&&!dlg.open)dlg.showModal(); }
function saveOnboardingStep(){
  state.maxPercent=Math.min(100,Math.max(0,+$('onboardingMaxPercent').value||0));
  state.workingWeekdays=[...document.querySelectorAll('[data-workday]:checked')].map(cb=>Number(cb.dataset.workday));
  state.standardTeleworkWeekdays=[...document.querySelectorAll('[data-teleworkday]:checked')].map(cb=>Number(cb.dataset.teleworkday)).filter(d=>state.workingWeekdays.includes(d));
  const leaveRaw=$('onboardingLeaveBudget')?.value;if(leaveRaw!==undefined){if(leaveRaw==='')delete state.leaveBudgetByYear[state.selectedYear];else{const v=Number(leaveRaw);if(Number.isFinite(v)&&v>=0)state.leaveBudgetByYear[state.selectedYear]=Math.round(v*2)/2;}}
  state.autoHolidays=(document.querySelector('input[name="onboardingHolidays"]:checked')?.value||'yes')==='yes';
}
function finishOnboarding(){ saveOnboardingStep(); const shouldApply=$('onboardingApplySchedule')?.checked && state.standardTeleworkWeekdays.length>0; state.onboardingComplete=true; if(shouldApply) applyStandardSchedule('year',{saveAfter:false,toast:false}); save(); $('onboardingDialog').close(); renderAll(); }
function maybeShowOnboarding(){ if(!state.onboardingComplete) setTimeout(()=>openOnboarding(true),120); }


let leavePlannerDrawerOpen=false;
function positionLeavePlannerDrawer(){
  const toggle=$('leavePlannerToggle'),panel=$('leavePlannerDrawerPanel'),list=$('leaveSuggestionList');
  if(!toggle||!panel)return;

  const toggleRect=toggle.getBoundingClientRect();
  const planner=document.querySelector('.planning-card');
  const plannerRect=planner?.getBoundingClientRect();
  const statusBar=document.querySelector('.planner-status');
  const statusRect=statusBar?.getBoundingClientRect();

  const sideGap=10;
  const viewportMargin=12;
  const preferredWidth=380;
  const minWidth=280;

  const anchorRight=plannerRect ? plannerRect.right : toggleRect.right;
  const availableRight=Math.max(0,window.innerWidth-anchorRight-sideGap);

  let width=Math.min(preferredWidth,availableRight);
  let left=anchorRight+sideGap;

  if(width<minWidth){
    width=Math.min(preferredWidth,Math.max(minWidth,window.innerWidth-(viewportMargin*2)));
    left=Math.max(viewportMargin,window.innerWidth-width-viewportMargin);
  }

  // Visueel uitlijnen met de balk waarin telewerkpercentage + grappige boodschap staan.
  const desiredTop=statusRect ? statusRect.top : (plannerRect ? plannerRect.top : toggleRect.top);
  const top=Math.max(viewportMargin,Math.min(desiredTop,Math.max(viewportMargin,window.innerHeight-300)));
  const availableHeight=Math.max(280,window.innerHeight-top-viewportMargin);

  panel.style.left=`${Math.round(left)}px`;
  panel.style.top=`${Math.round(top)}px`;
  panel.style.width=`${Math.round(width)}px`;

  // Eerst natuurlijke hoogte meten zonder dat de resultatenlijst zichzelf begrenst.
  const previousListFlex=list?.style.flex||'';
  const previousListOverflow=list?.style.overflowY||'';
  const previousListMaxHeight=list?.style.maxHeight||'';

  panel.style.height='auto';
  panel.style.maxHeight='none';

  if(list){
    list.style.flex='0 0 auto';
    list.style.overflowY='visible';
    list.style.maxHeight='none';
  }

  const naturalHeight=Math.ceil(panel.scrollHeight);
  const needsScroll=naturalHeight>availableHeight;
  const targetHeight=Math.min(naturalHeight,availableHeight);

  panel.style.height=`${Math.max(220,targetHeight)}px`;
  panel.style.maxHeight=`${Math.round(availableHeight)}px`;

  if(list){
    if(needsScroll){
      list.style.flex='1 1 0';
      list.style.overflowY='auto';
      list.style.maxHeight='none';
    }else{
      list.style.flex='0 0 auto';
      list.style.overflowY='visible';
      list.style.maxHeight='none';
    }
  }
}
function setLeavePlannerDrawer(open){
  leavePlannerDrawerOpen=!!open;
  const drawer=$('leavePlannerDrawer'),toggle=$('leavePlannerToggle');
  if(!drawer||!toggle)return;
  drawer.classList.toggle('open',leavePlannerDrawerOpen);
  toggle.setAttribute('aria-expanded',String(leavePlannerDrawerOpen));
  toggle.setAttribute('aria-label',t(leavePlannerDrawerOpen?'closeLeavePlanner':'openLeavePlanner'));
  document.body.classList.toggle('leave-planner-open-state',leavePlannerDrawerOpen);
  if(leavePlannerDrawerOpen){
    positionLeavePlannerDrawer();
    requestAnimationFrame(positionLeavePlannerDrawer);
  }
}

function renderAll(){applyLanguage();applyTheme(false);initSelectors();renderLegend();renderCalendar();renderStats();renderSummary();renderYearOverview();renderDialogLabels();setView(state.currentView||'month');setQuickFillMode(quickFillMode);const monthWrap=$('leaveMonthChoices');if(monthWrap&&(!monthWrap.children.length||monthWrap.dataset.language!==state.language))renderLongLeaveMonthChoices();renderLeavePlanner();setLeavePlannerDrawer(leavePlannerDrawerOpen);}

$('yearSelect').onchange=e=>{state.selectedYear=+e.target.value;save();renderAll();};
$('monthSelect').onchange=e=>{state.selectedMonth=+e.target.value;save();renderAll();};
$('maxPercent').oninput=e=>{state.maxPercent=Math.min(100,Math.max(0,+e.target.value||0));save();renderStats();renderYearOverview();};
$('dayPartSelect').onchange=e=>{state.selectedDayPart=e.target.value;save();renderLegend();};
$('monthViewBtn').onclick=()=>setView('month'); $('yearViewBtn').onclick=()=>setView('year');
$('applyRecurringMonth').onclick=()=>recurring('month'); $('applyRecurringYear').onclick=()=>recurring('year');
$('recurringModeBtn').onclick=()=>setQuickFillMode('recurring'); $('rangeModeBtn').onclick=()=>setQuickFillMode('range'); $('applyRangeBtn').onclick=fillRange; bindStandardSchedulePicker();

const categoryDlg=$('categoryDialog'),printDlg=$('printDialog'),resetDlg=$('resetDialog'),exportDlg=$('exportDialog'),helpDlg=$('helpDialog');
const monthTotalsDlg=$('monthTotalsDialog');
const dayNoteDlg=$('dayNoteDialog');
const holidayWorkDlg=$('holidayWorkDialog');
const standardScheduleDlg=$('standardScheduleDialog');
$('standardScheduleBtn').onclick=()=>{renderStandardSchedulePicker();standardScheduleDlg.showModal();};
$('closeStandardScheduleBtn').onclick=()=>standardScheduleDlg.close();
$('applyStandardMonth').onclick=()=>{applyStandardSchedule('month');standardScheduleDlg.close();};
$('applyStandardYear').onclick=()=>{applyStandardSchedule('year');standardScheduleDlg.close();};
standardScheduleDlg.addEventListener('cancel',()=>standardScheduleDlg.close());
document.querySelectorAll('#emojiPresets .emoji-preset').forEach(btn=>btn.addEventListener('click',()=>{ $('newCategoryEmoji').value=btn.dataset.emoji||''; document.querySelectorAll('#emojiPresets .emoji-preset').forEach(b=>b.classList.toggle('selected',b===btn)); }));
document.querySelectorAll('.appearance-emoji-preset').forEach(btn=>btn.addEventListener('click',()=>{ $('appearanceEmoji').value=btn.dataset.emoji||''; document.querySelectorAll('.appearance-emoji-preset').forEach(b=>b.classList.toggle('selected',b===btn)); }));
$('closeCategoryAppearanceBtn').onclick=closeCategoryAppearance;
$('cancelCategoryAppearanceBtn').onclick=closeCategoryAppearance;
$('categoryAppearanceDialog').addEventListener('cancel',e=>{e.preventDefault();closeCategoryAppearance();});
$('annualLeaveBudget').oninput=updateLeaveBudgetPreview;
$('leaveBridgeModeBtn').onclick=()=>setLeavePlannerMode('bridges');
$('leaveLongModeBtn').onclick=()=>setLeavePlannerMode('long');
$('leaveAllMonthsBtn').onclick=()=>{const checks=[...document.querySelectorAll('#leaveMonthChoices input[data-month]')];checks.forEach(cb=>cb.checked=true);syncAllMonthsChoice();$('leaveMonthMenu')?.classList.add('hidden');$('leaveChooseMonthsBtn')?.setAttribute('aria-expanded','false');if(leavePlannerMode==='long')renderLeavePlanner();};
$('leaveChooseMonthsBtn').onclick=(e)=>{e.stopPropagation();const menu=$('leaveMonthMenu'),btn=$('leaveChooseMonthsBtn');if(!menu||!btn)return;const open=menu.classList.contains('hidden');menu.classList.toggle('hidden',!open);btn.setAttribute('aria-expanded',String(open));};
$('leaveMonthMenu')?.addEventListener('click',e=>e.stopPropagation());
document.addEventListener('click',()=>{$('leaveMonthMenu')?.classList.add('hidden');$('leaveChooseMonthsBtn')?.setAttribute('aria-expanded','false');});

$('leaveTargetWeeks').oninput=()=>{if(leavePlannerMode==='long')renderLeavePlanner();};
$('includeTeleworkExtension').onchange=()=>{if(leavePlannerMode==='long')renderLeavePlanner();};
$('leavePlannerToggle').onclick=()=>setLeavePlannerDrawer(!leavePlannerDrawerOpen);
$('leavePlannerClose').onclick=()=>setLeavePlannerDrawer(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&leavePlannerDrawerOpen)setLeavePlannerDrawer(false);});
window.addEventListener('resize',()=>{if(leavePlannerDrawerOpen)positionLeavePlannerDrawer();});
window.addEventListener('scroll',()=>{if(leavePlannerDrawerOpen)positionLeavePlannerDrawer();},{passive:true});

$('categoryAppearanceForm').onsubmit=e=>{
  e.preventDefault();
  const c=cat(appearanceCategoryId); if(!c)return closeCategoryAppearance();
  c.emoji=$('appearanceEmoji').value.trim()||c.emoji||'📌';
  c.color=$('appearanceColor').value||c.color;
  if(appearanceCategoryId==='leave'){const raw=$('annualLeaveBudget').value;if(raw==='')delete state.leaveBudgetByYear[state.selectedYear];else{const v=Number(raw);if(Number.isFinite(v)&&v>=0)state.leaveBudgetByYear[state.selectedYear]=Math.round(v*2)/2;}}
  save(); closeCategoryAppearance(); renderAll(); showToast(t('appearanceSaved'));
};
$('addCategoryBtn').onclick=()=>categoryDlg.showModal(); $('cancelCategoryBtn').onclick=()=>{categoryDlg.close();$('newCategoryName').value='';$('newCategoryEmoji').value='';document.querySelectorAll('#emojiPresets .emoji-preset').forEach(b=>b.classList.remove('selected'));};
$('categoryForm').onsubmit=e=>{e.preventDefault();const name=$('newCategoryName').value.trim();if(!name)return;const id='custom-'+Date.now();const newCat={id,name,emoji:$('newCategoryEmoji').value.trim()||'📌',type:$('newCategoryType').value,color:$('newCategoryColor').value,selectable:true};const holidayPos=state.categories.findIndex(c=>c.id==='holiday');if(holidayPos>=0)state.categories.splice(holidayPos,0,newCat);else state.categories.push(newCat);state.activeCategoryId=id;save();categoryDlg.close();$('newCategoryName').value='';$('newCategoryEmoji').value='';document.querySelectorAll('#emojiPresets .emoji-preset').forEach(b=>b.classList.remove('selected'));renderAll();};
categoryDlg.addEventListener('cancel',()=>{$('newCategoryName').value='';$('newCategoryEmoji').value='';document.querySelectorAll('#emojiPresets .emoji-preset').forEach(b=>b.classList.remove('selected'));});

$('printBtn').onclick=()=>{renderDialogLabels();printDlg.showModal();}; $('cancelPrintBtn').onclick=()=>printDlg.close(); $('printMonthChoice').onclick=()=>printScope('month'); $('printYearChoice').onclick=()=>printScope('year');
$('resetBtn').onclick=()=>{renderDialogLabels();resetDlg.showModal();}; $('cancelResetBtn').onclick=()=>resetDlg.close(); $('resetMonthChoice').onclick=()=>resetScope('month'); $('resetYearChoice').onclick=()=>resetScope('year');
$('themeBtn').onclick=toggleTheme;
$('languageSelect').onchange=e=>{state.language=e.target.value;save();renderAll();if($('onboardingDialog')?.open)renderOnboarding();window.dispatchEvent(new CustomEvent('mijntelewerk:language-changed'));};
$('monthTotalsBtn').onclick=()=>{renderSummary();monthTotalsDlg.showModal();}; $('closeMonthTotalsBtn').onclick=()=>monthTotalsDlg.close(); monthTotalsDlg.addEventListener('cancel',()=>monthTotalsDlg.close());
$('dayNoteForm').onsubmit=e=>{e.preventDefault();saveDayNote();};
$('dayNoteCancel').onclick=()=>closeNoteDialog();
$('dayNoteClose').onclick=()=>closeNoteDialog();
$('dayNoteDelete').onclick=()=>deleteDayNote();
dayNoteDlg?.addEventListener('cancel',e=>{e.preventDefault();closeNoteDialog();});
$('holidayWorkCancelBtn').onclick=closeHolidayWorkDialog;
$('holidayWorkConfirmBtn').onclick=confirmHolidayWork;
holidayWorkDlg?.addEventListener('cancel',e=>{e.preventDefault();closeHolidayWorkDialog();});
$('helpBtn').onclick=()=>helpDlg.showModal(); $('closeHelpBtn').onclick=()=>helpDlg.close(); $('helpOkBtn').onclick=()=>helpDlg.close();
$('feedbackContactBtn').onclick=openFeedbackEmail;

document.querySelectorAll('[data-workday]').forEach(cb=>cb.addEventListener('change',()=>{
  const active=[...document.querySelectorAll('[data-workday]:checked')].map(x=>Number(x.dataset.workday));
  document.querySelectorAll('[data-teleworkday]').forEach(tw=>{const d=Number(tw.dataset.teleworkday);tw.disabled=!active.includes(d);if(!active.includes(d))tw.checked=false;});
}));
document.querySelectorAll('[data-teleworkday]').forEach(cb=>cb.addEventListener('change',()=>{
  const any=[...document.querySelectorAll('[data-teleworkday]:checked')].length>0;
  const applyBox=$('onboardingApplySchedule'); if(applyBox && !state.onboardingComplete) applyBox.checked=any;
}));
$('onboardingSettingsBtn').onclick=()=>{helpDlg.close();openOnboarding(true);};
$('onboardingBackBtn').onclick=()=>{saveOnboardingStep();onboardingStep=Math.max(1,onboardingStep-1);renderOnboarding();};
$('onboardingNextBtn').onclick=()=>{saveOnboardingStep();onboardingStep=Math.min(5,onboardingStep+1);renderOnboarding();};
$('onboardingStartBtn').onclick=finishOnboarding;
$('onboardingLaterBtn').onclick=()=>{$('onboardingDialog').close();state.onboardingComplete=true;save();};
$('exportBtn').onclick=()=>exportDlg.showModal(); $('cancelExportBtn').onclick=()=>exportDlg.close(); $('exportPdfChoice').onclick=()=>{exportDlg.close();renderDialogLabels();printDlg.showModal();}; $('exportExcelChoice').onclick=exportExcel; $('exportIcsChoice').onclick=exportIcs;

function exportYearPayload(year=+state.selectedYear){
  const y=+year,prefix=`${y}-`,days={},notes={},holidayWorkExemptions={};
  Object.entries(state.days).forEach(([date,slots])=>{if(date.startsWith(prefix))days[date]=clone(slots);});
  Object.entries(state.notes||{}).forEach(([date,note])=>{if(date.startsWith(prefix)&&note)notes[date]=note;});
  Object.entries(state.holidayWorkExemptions||{}).forEach(([date,value])=>{if(date.startsWith(prefix)&&value===true)holidayWorkExemptions[date]=true;});
  return {
    schemaVersion:1,
    year:y,
    maxPercent:+state.maxPercent,
    language:state.language,
    autoHolidays:state.autoHolidays,
    workingWeekdays:clone(state.workingWeekdays),
    standardTeleworkWeekdays:clone(state.standardTeleworkWeekdays),
    leaveBudget:leaveBudgetForYear(y),
    removedDefaultCategories:clone(state.removedDefaultCategories),
    categories:clone(state.categories),
    days,
    notes,
    holidayWorkExemptions,
    exportedAt:new Date().toISOString()
  };
}
function importYearPayload(year,payload){
  if(!payload||typeof payload!=='object')throw new Error(t('invalidCloud'));
  const y=+year,prefix=`${y}-`;
  Object.keys(state.days).forEach(date=>{if(date.startsWith(prefix))delete state.days[date];});
  Object.keys(state.notes||{}).forEach(date=>{if(date.startsWith(prefix))delete state.notes[date];});
  Object.keys(state.holidayWorkExemptions||{}).forEach(date=>{if(date.startsWith(prefix))delete state.holidayWorkExemptions[date];});
  const incoming=normalizeDays(payload.days||{});
  Object.entries(incoming).forEach(([date,slots])=>{if(date.startsWith(prefix))state.days[date]=slots;});
  if(payload.notes&&typeof payload.notes==='object')Object.entries(payload.notes).forEach(([date,note])=>{if(date.startsWith(prefix)&&typeof note==='string'&&note.trim())state.notes[date]=note.trim().slice(0,500);});
  if(payload.holidayWorkExemptions&&typeof payload.holidayWorkExemptions==='object')Object.entries(payload.holidayWorkExemptions).forEach(([date,value])=>{if(date.startsWith(prefix)&&value===true)state.holidayWorkExemptions[date]=true;});
  if(Array.isArray(payload.categories)){
    const removed=Array.isArray(payload.removedDefaultCategories)?payload.removedDefaultCategories:['leave','sick'].filter(id=>!payload.categories.some(c=>c?.id===id));
    state.removedDefaultCategories=removed.filter(id=>id==='sick');
    state.categories=normalizeCategories(payload.categories,state.removedDefaultCategories);
  }
  if(['nl','fr','en'].includes(payload.language))state.language=payload.language;
  if(typeof payload.autoHolidays==='boolean')state.autoHolidays=payload.autoHolidays;
  if(Array.isArray(payload.workingWeekdays))state.workingWeekdays=payload.workingWeekdays.map(Number).filter(d=>d>=0&&d<=6);
  state.standardTeleworkWeekdays=Array.isArray(payload.standardTeleworkWeekdays)?payload.standardTeleworkWeekdays.map(Number).filter(d=>state.workingWeekdays.includes(d)):[];
  if(payload.leaveBudget===null||payload.leaveBudget==='')delete state.leaveBudgetByYear[y];else if(Number.isFinite(+payload.leaveBudget)&&+payload.leaveBudget>=0)state.leaveBudgetByYear[y]=Math.round(+payload.leaveBudget*2)/2;
  if(Number.isFinite(+payload.maxPercent))state.maxPercent=Math.min(100,Math.max(0,+payload.maxPercent));
  state.selectedYear=y;
  save();
  renderAll();
}
window.MijnTelewerkApp={
  getSelectedYear:()=>+state.selectedYear,
  exportYearPayload,
  importYearPayload,
  showToast,
  renderAll,
  t,
  getLanguage:()=>state.language,
  getLocale:currentLocale
};

renderAll();
maybeShowOnboarding();
