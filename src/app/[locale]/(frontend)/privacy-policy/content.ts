import type { AppLocale } from "@/i18n/routing"

/** Un item di lista: stringa semplice oppure item con sotto-elenco (1 livello). */
export type LegalListItem = string | { text: string; items: string[] }

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: LegalListItem[] }
  | { type: "address"; lines: string[] }

export type LegalDoc = {
  title: string
  blocks: LegalBlock[]
}

const it: LegalDoc = {
  title: "Informativa sulla Privacy e la Protezione dei Dati Personali",
  blocks: [
    {
      type: "p",
      text: 'La presente informativa è resa, nel rispetto degli artt. 13 e 14 del Regolamento UE 679/2016 (di seguito "Regolamento"), agli utilizzatori (di seguito: "Utenti" oppure "Utente") del sito in versione desktop Ducati Case.it, (di seguito: "Sito") di proprietà di DucatiCase.it., Titolare del Trattamento dei dati personali (di seguito: "Titolare") ed ha lo scopo di descrivere le modalità di gestione di Sito con riferimento al trattamento dei dati personali, nonché di consentire agli Utenti di Sito di conoscere le finalità e le modalità di trattamento dei dati personali da parte del Titolare in caso di loro conferimento.',
    },
    {
      type: "p",
      text: "I servizi offerti dal Titolare sono rivolti a persone di età superiore ai 18 anni. Qualora il Titolare dovesse venire a conoscenza del trattamento di dati di minori di 18 anni di età senza un valido consenso dei genitori o di un tutore legale, si riserva il diritto di interrompere unilateralmente la fruizione del servizio offerto nonché di cancellare i dati acquisiti.",
    },

    {
      type: "h2",
      text: "Principi applicabili al Trattamento dei Dati Personali",
    },
    {
      type: "p",
      text: "Il Titolare, ai sensi e per gli effetti del Regolamento, rende noto che la citata normativa prevede la tutela delle persone fisiche rispetto al trattamento dei dati personali, e che tale trattamento sarà improntato ai principi di correttezza, liceità, trasparenza e di tutela della riservatezza e dei diritti fondamentali.",
    },

    { type: "h2", text: "Tipologia di Utenti" },
    {
      type: "p",
      text: "In relazione all'utilizzo di Sito gli Utenti possono accedere ad alcuni servizi (es. ricerca di immobili) in maniera anonima.",
    },

    {
      type: "h2",
      text: "Finalità, base giuridica del Trattamento e Facoltatività del Conferimento",
    },
    {
      type: "p",
      text: "I dati personali forniti dagli Utenti attraverso l'utilizzo di Sito, verranno trattati con il loro consenso, per le finalità di seguito descritte.",
    },
    {
      type: "p",
      text: "In questa pagina si descrivono le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano. Il trattamento si basa sempre su principi di liceità e correttezza in ottemperanza a tutte le vigenti normative.",
    },
    {
      type: "p",
      text: "Tale privacy policy è data anche come Informativa ai sensi dell'art. 13 del D.Lgs. 196/03 (normativa italiana sul trattamento dei dati personali in ottemperanza alla direttiva 95-46-CE) e nel rispetto degli artt. 13 e 14 del Regolamento UE 679/2016 a coloro che interagiscono con i servizi web di questo sito, al fine della protezione dei dati personali, accessibili per via telematica a partire dall'indirizzo www.ducaticase.it corrispondente alla pagina iniziale del sito ufficiale di Ducati Case Srl. L'Informativa è resa solo per il sito di cui sopra e non anche per altri siti web eventualmente consultati dall'utente tramite link. Essi sono autonomi Titolari del trattamento e pertanto si rimanda ai siti in questione.",
    },
    {
      type: "p",
      text: "L'Informativa si ispira anche alla Raccomandazione n. 2/2001 che le autorità europee per la protezione dei dati personali, riunite nel Gruppo istituito dall'art. 29 della direttiva n. 95/46/CE, hanno adottato il 17 maggio 2001 per individuare alcuni requisiti minimi per la raccolta di dati personali on-line e, in particolare, le modalità, i tempi e la natura delle informazioni che i Titolari del trattamento devono fornire agli utenti quando questi si collegano a pagine web, indipendentemente dagli scopi del collegamento.",
    },
    {
      type: "p",
      text: "Il trattamento dei dati da Lei liberamente conferiti sarà effettuato nel rispetto delle norme in vigore. In particolare, il trattamento sarà improntato ai principi di correttezza, liceità e trasparenza, pertinenza, completezza e non eccedenza. I dati saranno raccolti e registrati per le finalità di cui al punto seguente e conservati per un periodo strettamente necessario agli scopi.",
    },
    {
      type: "p",
      text: "Tipi di dati trattati, modalità del trattamento, finalità del trattamento, facoltatività o meno.",
    },

    { type: "h3", text: "Dati di navigazione" },
    {
      type: "p",
      text: "I sistemi informatici e le procedure software preposte al funzionamento di questo sito web acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet.",
    },
    {
      type: "p",
      text: "Si tratta di informazioni che non sono raccolte per essere associate a interessati identificati, ma che per loro stessa natura potrebbero, attraverso elaborazioni ed associazioni con dati detenuti da terzi, permettere di identificare gli utenti.",
    },
    {
      type: "p",
      text: "In questa categoria di dati rientrano gli indirizzi IP o i nomi a dominio dei computer utilizzati dagli utenti che si connettono al sito, gli indirizzi in notazione URI (Uniform Resource Identifier) delle risorse richieste, l'orario della richiesta, il metodo utilizzato nel sottoporre la richiesta al server, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta data dal server (buon fine, errore, ecc.) ed altri parametri relativi al sistema operativo e all'ambiente informatico dell'utente.",
    },
    {
      type: "p",
      text: "Questi dati vengono utilizzati al solo fine di ricavare informazioni statistiche anonime sull'uso del sito e per controllarne il corretto funzionamento, e vengono cancellati immediatamente dopo l'elaborazione. I dati potrebbero essere utilizzati per l'accertamento di Responsabilità in caso di ipotetici reati informatici ai danni del sito.",
    },

    { type: "h3", text: "Dati forniti volontariamente dall'utente" },
    {
      type: "p",
      text: "L'invio facoltativo, esplicito e volontario di posta elettronica agli indirizzi indicati su questo sito comporta la successiva acquisizione dell'indirizzo del mittente e dei dati personali necessari per rispondere alle richieste e/o fornire i servizi richiesti, nonché degli eventuali altri dati personali inseriti nella missiva (e negli allegati alla stessa) o nei form appositi.",
    },
    {
      type: "p",
      text: "Le e-mail ricevute sono archiviate a tempo indeterminato su un server protetto da opportune misure di sicurezza. L'interessato può esercitare tutti i diritti previsti dall'art. 7 D.Lgs. 196/2003 e nel rispetto degli artt. 13 e 14 del Regolamento UE 679/2016, in particolare può conoscere quali suoi dati sono presenti nell'archivio e ottenerne la cancellazione, scrivendo al Responsabile del trattamento all'indirizzo di posta elettronica privacy@ducaticase.it.",
    },
    {
      type: "p",
      text: "I dati saranno pertanto trattati in modalità informatica e telematica, per rispondere alle richieste e/o fornire il servizio richiesto. Il conferimento è sempre facoltativo e il mancato conferimento comporta solo l'impossibilità di dare seguito alle richieste.",
    },
    {
      type: "p",
      text: "I Suoi dati potranno da noi essere comunicati (con tale termine intendendosi il darne conoscenza ad uno o più soggetti determinati) a soggetti che possono accedere ai dati in forza di disposizione di legge, di regolamento o di normativa comunitaria, nei limiti previsti da tali norme, oltre che a soggetti che hanno necessità di accedere ai Suoi dati per finalità ausiliare al rapporto che intercorre tra Lei e noi, nei limiti strettamente necessari per svolgere i compiti ausiliari.",
    },

    { type: "h3", text: "Cookies" },
    {
      type: "p",
      text: "Nessun dato personale degli utenti viene dal sito. Non viene fatto uso di cookies per la trasmissione di informazioni di carattere personale, né vengono utilizzati c.d. cookies persistenti di alcun tipo, ovvero sistemi per il tracciamento degli utenti.",
    },
    {
      type: "p",
      text: "L'uso di c.d. cookies di sessione (che non vengono memorizzati in modo persistente sul computer dell'utente e svaniscono con la chiusura del browser) è strettamente limitato alla trasmissione di identificativi di sessione (costituiti da numeri casuali generati dal server) necessari per consentire l'esplorazione sicura ed efficiente del sito.",
    },
    {
      type: "p",
      text: "I c.d. cookies di sessione utilizzati in questo sito evitano il ricorso ad altre tecniche informatiche potenzialmente pregiudizievoli per la riservatezza della navigazione degli utenti e non consentono l'acquisizione di dati personali identificativi dell'utente.",
    },

    {
      type: "h3",
      text: "Luogo di trattamento dei dati e ambito di comunicazione o diffusione",
    },
    {
      type: "p",
      text: "I dati connessi ai servizi web di questo sito sono trattati dal Provider, nei limiti strettamente indispensabili per fornire il servizio di hosting, e presso la sede della nostra organizzazione solo da personale tecnico incaricato del trattamento, oppure da eventuali incaricati di occasionali operazioni di manutenzione. Nessun dato derivante dal servizio web viene comunicato o diffuso. I dati personali forniti volontariamente dagli utenti tramite email o compilazione di appositi form, sono utilizzati al solo fine di eseguire il servizio o la prestazione richiesta e sono comunicati a terzi nel solo caso in cui ciò sia a tal fine necessario.",
    },
    {
      type: "p",
      text: "Al fine di erogare alcuni servizi quali ad esempio la ricezione di informazioni su nuovi annunci, inoltro documentazione, è necessario che l'Utente li fornisca direttamente via e.mail o telefonicamente. I dati necessari si limitano al conferimento di:",
    },
    {
      type: "ul",
      items: ["Nome", "Cognome", "Indirizzo Email", "Numero di telefono"],
    },

    {
      type: "h2",
      text: "Modalità di Trattamento e Conservazione dei Dati Personali",
    },
    {
      type: "p",
      text: "Il Titolare assicura che i dati personali sono trattati nel pieno rispetto del Regolamento, mediante sistemi manuali, informatici o telematici. Il trattamento potrà essere effettuato anche attraverso strumenti automatizzati atti a memorizzare, gestire e trasmettere i dati stessi.",
    },
    {
      type: "p",
      text: "I dati raccolti ed oggetto di trattamento saranno protetti con metodologie fisiche e logiche tali da ridurre al minimo i rischi di accesso non consentito, diffusione, perdita e distruzione dei dati, ai sensi degli art. 25 e 32 del Regolamento.",
    },
    {
      type: "p",
      text: "Il trattamento dei dati avrà durata non superiore a quanto necessario per soddisfare le finalità per le quali sono stati raccolti, quali la memorizzazione di criteri di ricerca, la notifica, la pubblicazione di annunci e il contatto di operatori professionali.",
    },
    {
      type: "p",
      text: "Ai sensi dell'art. 7 comma 3 del Regolamento, l'interessato ha diritto di ottenere in qualsiasi momento la revoca del consenso al trattamento.",
    },
    {
      type: "p",
      text: "Qualora non pervenga al Titolare una richiesta di cancellazione, i dati personali saranno conservati per un termine non superiore a 10 (dieci) anni, con decorrenza dalla data dell'ultimo accesso a Sito da parte dell'Utente.",
    },

    { type: "h2", text: "Destinatari dei Dati Personali" },
    {
      type: "p",
      text: "I dati personali raccolti potranno essere trattati da soggetti o categorie di soggetti che agiscono come Responsabili del trattamento dei dati ai sensi dell'art. 28 del Regolamento o che sono autorizzati al trattamento dei dati ai sensi dell'art. 29 del Regolamento.",
    },
    {
      type: "p",
      text: "Inoltre, per alcuni servizi, i dati potranno essere comunicati a società che collaborano o utilizzano i servizi del Titolare (ad esempio i singoli proponenti per le informazioni sugli immobili; banche o intermediari creditizi per l'erogazione di mutui e prestiti ed altri servizi finanziari connessi alla compravendita di un immobile), con l'unico intento di erogare i servizi richiesti dall'Utente. In questi casi le società sono autonome titolari, pertanto il Titolare non è responsabile del trattamento dei dati da parte delle stesse. Il Titolare inoltre non è responsabile dei contenuti e del rispetto della normativa in tema di protezione dei dati personali da parte di siti non gestiti dal Titolare.",
    },
    {
      type: "p",
      text: "Al di fuori delle suindicate ipotesi, i dati personali non saranno oggetto di comunicazione se non nei confronti di soggetti, enti e Autorità verso cui la comunicazione sia obbligatoria in forza di disposizioni di legge o di regolamento.",
    },

    {
      type: "h2",
      text: "Trasferimento dei Dati ad un Paese Terzo o a un'Organizzazione Internazionale",
    },
    {
      type: "p",
      text: "I dati personali raccolti, potranno essere trasferiti al di fuori del territorio nazionale, solo ed esclusivamente per l'esecuzione dei servizi richiesti e nel rispetto delle specifiche disposizioni previste dal Regolamento.",
    },
    {
      type: "p",
      text: "Alcuni dati personali potrebbero essere condivisi con destinatari situati al di fuori dello Spazio Economico Europeo. Il Titolare assicura che il trattamento dei dati personali da parte di questi destinatari avviene nel rispetto del Regolamento.",
    },

    { type: "h2", text: "Diritti dell'Interessato" },
    {
      type: "p",
      text: "Ai sensi degli artt. dal 15 al 22 del Regolamento, l'Utente, quale soggetto interessato, ha la facoltà di esercitare specifici diritti inerenti i suoi Dati Personali. In particolare, l'Interessato ha diritto di ottenere:",
    },
    {
      type: "ul",
      items: [
        "la conferma dell'esistenza o meno di dati personali che lo riguardano, anche se non ancora registrati, in forma concisa, trasparente, intelligibile e facilmente accessibile, con un linguaggio semplice e chiaro;",
        {
          text: "l'indicazione:",
          items: [
            "a. dell'origine dei dati personali;",
            "b. delle finalità e modalità di trattamento;",
            "c. dei legittimi interessi perseguiti dal Titolare o da terzi;",
            "d. degli eventuali destinatari o le eventuali categorie di destinatari dei dati personali;",
            "e. dell'eventuale intenzione del titolare di trasferire dati personali a un paese terzo o a un'organizzazione internazionale;",
            "f. del periodo di conservazione dei dati personali;",
            "g. della logica applicata, nonché l'importanza e le conseguenze previste di tale trattamento per l'interessato, in caso di trattamento effettuato con l'ausilio di strumenti elettronici nell'ambito di un processo automatico di raccolta e/o profilazione;",
            "h. degli estremi identificativi del Titolare, dei Responsabili, dell'eventuale Rappresentante designato e del Responsabile della protezione dei Dati (c.d. DPO);",
            "i. dei soggetti e delle categorie di soggetti ai quali i dati personali possono essere comunicati o che possono venirne a conoscenza in qualità di rappresentante designato nel territorio dello Stato, di responsabili o incaricati;",
          ],
        },
        "la possibilità di proporre un reclamo ad un'Autorità di controllo;",
        "l'aggiornamento, la rettificazione ovvero, quando vi ha interesse, l'integrazione dei dati;",
        "la cancellazione, la trasformazione in forma anonima o il blocco dei dati trattati in violazione della legge, compresi quelli di cui non è necessaria la conservazione in relazione agli scopi per i quali i dati sono stati raccolti o successivamente trattati;",
        "la limitazione al trattamento;",
        "la portabilità dei dati personali che lo riguardano ad altro Titolare del trattamento;",
        "la revoca del trattamento;",
        "l'attestazione che le operazioni di cui alle lettere a) e b) sono state portate a conoscenza, anche per quanto riguarda il loro contenuto, di coloro ai quali i dati sono stati comunicati o diffusi, eccettuato il caso in cui tale adempimento si rivela impossibile o comporta un impiego di mezzi manifestatamente sproporzionato rispetto al diritto tutelato;",
        "l'opposizione, in tutto o in parte, per motivi legittimi, al trattamento dei dati personali che lo riguardano, ancorché pertinenti allo scopo della raccolta.",
      ],
    },

    {
      type: "h2",
      text: "Titolare del Trattamento e Responsabile della Protezione dei Dati",
    },
    {
      type: "p",
      text: "Per esercitare i diritti al punto precedente, l'interessato potrà rivolgersi in ogni momento al Titolare e/o al Responsabile della Protezione dei Dati per eventuali comunicazioni in merito al trattamento dei propri Dati Personali, o per conoscere l'elenco aggiornato degli eventuali Responsabili del Trattamento nominati dalla Società, inviando comunicazione ai contatti di seguito riportati:",
    },
    { type: "h3", text: "Il Titolare del Trattamento" },
    {
      type: "address",
      lines: ["Ducati Case Srl", "Via Vittorio Veneto, 24", "20124 MILANO"],
    },
    {
      type: "h3",
      text: "Il Responsabile della Protezione dei Dati (c.d. DPO)",
    },
    { type: "address", lines: ["Ducati Case Srl", "info@ducaticase.it"] },

    { type: "h2", text: "Modifiche" },
    {
      type: "p",
      text: "La presente informativa potrebbe essere soggetta a modifiche. Qualora vengano apportate sostanziali modifiche all'utilizzo dei dati relativi all'Utente da parte di Ducati Case srl questa avviserà l'Utente pubblicandole con la massima evidenza sulle proprie pagine.",
    },
  ],
}

const en: LegalDoc = {
  title: "Privacy Policy and Personal Data Protection Notice",
  blocks: [
    {
      type: "p",
      text: 'This notice is provided, in compliance with articles 13 and 14 of EU Regulation 679/2016 (hereinafter the "Regulation"), to the users (hereinafter: "Users" or "User") of the desktop version of the Ducati Case.it website (hereinafter: the "Site"), owned by DucatiCase.it, Data Controller of personal data (hereinafter: the "Controller"), and is intended to describe how the Site is managed with reference to the processing of personal data, as well as to allow Users of the Site to understand the purposes and methods of processing of personal data by the Controller in the event that they provide such data.',
    },
    {
      type: "p",
      text: "The services offered by the Controller are aimed at persons over 18 years of age. Should the Controller become aware of the processing of data of minors under 18 years of age without valid consent from parents or a legal guardian, it reserves the right to unilaterally discontinue the use of the service offered as well as to delete the data acquired.",
    },

    {
      type: "h2",
      text: "Principles applicable to the Processing of Personal Data",
    },
    {
      type: "p",
      text: "The Controller, pursuant to and for the purposes of the Regulation, makes it known that the aforementioned legislation provides for the protection of natural persons with regard to the processing of personal data, and that such processing will be based on the principles of fairness, lawfulness, transparency and protection of confidentiality and fundamental rights.",
    },

    { type: "h2", text: "Types of Users" },
    {
      type: "p",
      text: "In relation to the use of the Site, Users may access certain services (e.g. property search) anonymously.",
    },

    {
      type: "h2",
      text: "Purposes, legal basis of the Processing and Optional nature of the Provision of Data",
    },
    {
      type: "p",
      text: "The personal data provided by Users through the use of the Site will be processed with their consent, for the purposes described below.",
    },
    {
      type: "p",
      text: "This page describes how the site is managed with reference to the processing of the personal data of the users who consult it. Processing is always based on the principles of lawfulness and fairness in compliance with all current regulations.",
    },
    {
      type: "p",
      text: "This privacy policy is also provided as a Notice pursuant to art. 13 of Legislative Decree 196/03 (the Italian legislation on the processing of personal data in compliance with directive 95-46-EC) and in compliance with articles 13 and 14 of EU Regulation 679/2016 to those who interact with the web services of this site, for the purpose of the protection of personal data, accessible electronically from the address www.ducaticase.it corresponding to the home page of the official website of Ducati Case Srl. The Notice is provided only for the site mentioned above and not for other websites that may be consulted by the user via links. They are autonomous Data Controllers and therefore reference is made to the sites in question.",
    },
    {
      type: "p",
      text: "The Notice is also inspired by Recommendation no. 2/2001 which the European data protection authorities, gathered in the Group established by art. 29 of directive no. 95/46/EC, adopted on 17 May 2001 to identify certain minimum requirements for the online collection of personal data and, in particular, the methods, timing and nature of the information that Data Controllers must provide to users when they connect to web pages, regardless of the purposes of the connection.",
    },
    {
      type: "p",
      text: "The processing of the data freely provided by you will be carried out in compliance with the regulations in force. In particular, the processing will be based on the principles of fairness, lawfulness and transparency, relevance, completeness and non-excessiveness. The data will be collected and recorded for the purposes referred to in the following point and kept for a period strictly necessary for the purposes.",
    },
    {
      type: "p",
      text: "Types of data processed, methods of processing, purposes of processing, whether optional or not.",
    },

    { type: "h3", text: "Navigation data" },
    {
      type: "p",
      text: "The computer systems and software procedures used to operate this website acquire, during their normal operation, certain personal data whose transmission is implicit in the use of Internet communication protocols.",
    },
    {
      type: "p",
      text: "This information is not collected in order to be associated with identified data subjects, but by its very nature could, through processing and association with data held by third parties, allow users to be identified.",
    },
    {
      type: "p",
      text: "This category of data includes the IP addresses or domain names of the computers used by users who connect to the site, the addresses in URI (Uniform Resource Identifier) notation of the requested resources, the time of the request, the method used in submitting the request to the server, the size of the file obtained in response, the numerical code indicating the status of the response given by the server (successful, error, etc.) and other parameters relating to the operating system and IT environment of the user.",
    },
    {
      type: "p",
      text: "This data is used only for the purpose of obtaining anonymous statistical information on the use of the site and to check its correct functioning, and is deleted immediately after processing. The data could be used to ascertain liability in the event of hypothetical computer crimes against the site.",
    },

    { type: "h3", text: "Data provided voluntarily by the user" },
    {
      type: "p",
      text: "The optional, explicit and voluntary sending of e-mail to the addresses indicated on this site entails the subsequent acquisition of the sender's address and of the personal data necessary to respond to the requests and/or provide the services requested, as well as of any other personal data included in the message (and its attachments) or in the relevant forms.",
    },
    {
      type: "p",
      text: "The e-mails received are stored indefinitely on a server protected by appropriate security measures. The data subject may exercise all the rights provided for by art. 7 of Legislative Decree 196/2003 and in compliance with articles 13 and 14 of EU Regulation 679/2016, in particular they may know which of their data are present in the archive and obtain their deletion, by writing to the Data Processor at the e-mail address privacy@ducaticase.it.",
    },
    {
      type: "p",
      text: "The data will therefore be processed by computer and electronic means, in order to respond to requests and/or provide the requested service. The provision of data is always optional and failure to provide it only entails the impossibility of following up on requests.",
    },
    {
      type: "p",
      text: "Your data may be communicated by us (with this term meaning making it known to one or more specific parties) to parties who may access the data by virtue of a provision of law, regulation or Community legislation, within the limits set by such rules, as well as to parties who need to access your data for purposes ancillary to the relationship between you and us, within the limits strictly necessary to carry out the ancillary tasks.",
    },

    { type: "h3", text: "Cookies" },
    {
      type: "p",
      text: "No personal data of users is acquired by the site. Cookies are not used for the transmission of personal information, nor are so-called persistent cookies of any kind used, i.e. systems for tracking users.",
    },
    {
      type: "p",
      text: "The use of so-called session cookies (which are not stored persistently on the user's computer and disappear when the browser is closed) is strictly limited to the transmission of session identifiers (consisting of random numbers generated by the server) necessary to allow safe and efficient exploration of the site.",
    },
    {
      type: "p",
      text: "The so-called session cookies used on this site avoid the use of other IT techniques that are potentially prejudicial to the confidentiality of users' browsing and do not allow the acquisition of the user's personal identification data.",
    },

    {
      type: "h3",
      text: "Place of data processing and scope of communication or dissemination",
    },
    {
      type: "p",
      text: "The data connected to the web services of this site are processed by the Provider, within the limits strictly indispensable to provide the hosting service, and at the premises of our organisation only by technical staff in charge of processing, or by any persons in charge of occasional maintenance operations. No data deriving from the web service is communicated or disseminated. The personal data provided voluntarily by users via email or by filling in specific forms are used only for the purpose of performing the requested service and are communicated to third parties only where this is necessary for that purpose.",
    },
    {
      type: "p",
      text: "In order to provide certain services such as, for example, receiving information on new listings or forwarding documentation, it is necessary for the User to provide them directly by e-mail or by telephone. The necessary data are limited to the provision of:",
    },
    {
      type: "ul",
      items: ["Name", "Surname", "Email Address", "Telephone number"],
    },

    { type: "h2", text: "Methods of Processing and Storage of Personal Data" },
    {
      type: "p",
      text: "The Controller ensures that personal data are processed in full compliance with the Regulation, by means of manual, computer or electronic systems. Processing may also be carried out through automated tools designed to store, manage and transmit the data.",
    },
    {
      type: "p",
      text: "The data collected and processed will be protected by physical and logical methods such as to minimise the risks of unauthorised access, dissemination, loss and destruction of the data, pursuant to articles 25 and 32 of the Regulation.",
    },
    {
      type: "p",
      text: "The processing of the data will last no longer than necessary to satisfy the purposes for which they were collected, such as the storage of search criteria, notification, the publication of listings and contact with professional operators.",
    },
    {
      type: "p",
      text: "Pursuant to art. 7 paragraph 3 of the Regulation, the data subject has the right to obtain the withdrawal of consent to processing at any time.",
    },
    {
      type: "p",
      text: "Should the Controller not receive a request for deletion, the personal data will be kept for a term not exceeding 10 (ten) years, starting from the date of the User's last access to the Site.",
    },

    { type: "h2", text: "Recipients of Personal Data" },
    {
      type: "p",
      text: "The personal data collected may be processed by parties or categories of parties who act as Data Processors pursuant to art. 28 of the Regulation or who are authorised to process the data pursuant to art. 29 of the Regulation.",
    },
    {
      type: "p",
      text: "Furthermore, for certain services, the data may be communicated to companies that collaborate with or use the services of the Controller (for example, the individual proposers for information on properties; banks or credit intermediaries for the provision of mortgages and loans and other financial services connected to the purchase and sale of a property), with the sole intention of providing the services requested by the User. In these cases the companies are autonomous controllers, therefore the Controller is not responsible for the processing of data by them. The Controller is furthermore not responsible for the content and compliance with data protection legislation of sites not managed by the Controller.",
    },
    {
      type: "p",
      text: "Outside the above cases, personal data will not be communicated except to parties, bodies and Authorities to whom communication is mandatory by virtue of provisions of law or regulation.",
    },

    {
      type: "h2",
      text: "Transfer of Data to a Third Country or an International Organisation",
    },
    {
      type: "p",
      text: "The personal data collected may be transferred outside the national territory, solely and exclusively for the execution of the requested services and in compliance with the specific provisions set out in the Regulation.",
    },
    {
      type: "p",
      text: "Some personal data may be shared with recipients located outside the European Economic Area. The Controller ensures that the processing of personal data by these recipients takes place in compliance with the Regulation.",
    },

    { type: "h2", text: "Rights of the Data Subject" },
    {
      type: "p",
      text: "Pursuant to articles 15 to 22 of the Regulation, the User, as data subject, has the right to exercise specific rights relating to their Personal Data. In particular, the Data Subject has the right to obtain:",
    },
    {
      type: "ul",
      items: [
        "confirmation as to whether or not personal data concerning them exists, even if not yet recorded, in a concise, transparent, intelligible and easily accessible form, using clear and plain language;",
        {
          text: "the indication of:",
          items: [
            "a. the origin of the personal data;",
            "b. the purposes and methods of processing;",
            "c. the legitimate interests pursued by the Controller or by third parties;",
            "d. the recipients or categories of recipients of the personal data;",
            "e. the Controller's possible intention to transfer personal data to a third country or an international organisation;",
            "f. the retention period of the personal data;",
            "g. the logic applied, as well as the significance and the envisaged consequences of such processing for the data subject, in the case of processing carried out with the aid of electronic instruments within an automated process of collection and/or profiling;",
            "h. the identifying details of the Controller, of the Processors, of any designated Representative and of the Data Protection Officer (so-called DPO);",
            "i. the parties and categories of parties to whom the personal data may be communicated or who may become aware of it as a designated representative in the territory of the State, as processors or persons in charge;",
          ],
        },
        "the possibility of lodging a complaint with a supervisory Authority;",
        "the updating, rectification or, where there is an interest, the integration of the data;",
        "the erasure, transformation into anonymous form or blocking of data processed in violation of the law, including data whose retention is not necessary in relation to the purposes for which the data were collected or subsequently processed;",
        "the restriction of processing;",
        "the portability of the personal data concerning them to another Data Controller;",
        "the withdrawal of the processing;",
        "the attestation that the operations referred to in letters a) and b) have been brought to the attention, also as regards their content, of those to whom the data have been communicated or disseminated, except in the case where this fulfilment proves impossible or involves a use of means manifestly disproportionate to the protected right;",
        "the objection, in whole or in part, on legitimate grounds, to the processing of personal data concerning them, even if relevant to the purpose of the collection.",
      ],
    },

    { type: "h2", text: "Data Controller and Data Protection Officer" },
    {
      type: "p",
      text: "To exercise the rights referred to in the previous point, the data subject may contact the Controller and/or the Data Protection Officer at any time for any communications regarding the processing of their Personal Data, or to know the updated list of any Data Processors appointed by the Company, by sending a communication to the contacts set out below:",
    },
    { type: "h3", text: "The Data Controller" },
    {
      type: "address",
      lines: ["Ducati Case Srl", "Via Vittorio Veneto, 24", "20124 MILANO"],
    },
    { type: "h3", text: "The Data Protection Officer (so-called DPO)" },
    { type: "address", lines: ["Ducati Case Srl", "info@ducaticase.it"] },

    { type: "h2", text: "Amendments" },
    {
      type: "p",
      text: "This notice may be subject to amendments. Should substantial changes be made to the use of the User's data by Ducati Case srl, the latter will notify the User by publishing them with the utmost prominence on its own pages.",
    },
  ],
}

export const privacyPolicyContent: Record<AppLocale, LegalDoc> = { it, en }
