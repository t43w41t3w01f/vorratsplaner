"use strict";
/* ---------- BBK-Grundlagen (pro Person, pro Tag) ---------- */
const WATER_DAY = 2; // Liter
const FOOD = [
  // form: Trockenware/Pulver zählt mit Faktor (Gewicht im zubereiteten Zustand, Richtwerte)
  {k:'getreide', n:'Getreide, Brot, Nudeln, Reis, Kartoffeln', d:0.35, how:'trocken verpackt',
   ex:'Nudeln, Reis, Haferflocken, Knäckebrot, Zwieback, Kartoffelpüree-Pulver'},
  {k:'gemuese',  n:'Gemüse, Hülsenfrüchte', d:0.40, how:'Dose, Glas oder getrocknet',
   ex:'Dosengemüse, Rotkohl oder Gurken im Glas, Bohnen und Linsen (Dose oder getrocknet), Tomatenmark',
   form:{label:'getrocknet (Linsen, Bohnen, Erbsen)', f:2.5}},
  {k:'obst',     n:'Obst, Nüsse', d:0.25, how:'Dose, Glas oder getrocknet',
   ex:'Dosenobst, Apfelmus im Glas, Trockenobst, Nüsse',
   form:{label:'getrocknet (Trockenobst)', f:3}},
  {k:'milch',    n:'Milch, Milchprodukte', d:0.26, how:'haltbar oder als Pulver',
   ex:'H-Milch, Milchpulver, Kondensmilch, Hartkäse am Stück',
   form:{label:'Pulver (Milchpulver)', f:8}},
  {k:'fleisch',  n:'Fisch, Fleisch, Eier', d:0.15, how:'Dose oder Pulver',
   ex:'Thunfisch und Fleisch in der Dose, Dauerwurst, Volleipulver',
   form:{label:'Pulver (Volleipulver)', f:4}},
  {k:'fett',     n:'Fette, Öle', d:0.0357, how:'',
   ex:'Rapsöl, Olivenöl, Ghee'},
];
const FOOD_DAY = FOOD.reduce((s,g)=>s+g.d,0);
// Checklisten: [Schlüssel, Name, Menge, pro Person?]
const CHECK = {
  hilfe:   {n:'Erste Hilfe', items:[['verband','DIN-Verbandskasten',1],['pflaster','Pflaster-Set',1],['desinf','Wund- und Hautdesinfektion',1],['thermo','Fieberthermometer',1],['pinzette','Splitterpinzette',1]]},
  medizin: {n:'Medikamente', items:[['eigene','Persönliche Medikamente (Packung)',1,true],['schmerz','Schmerzmittel',1],['durchfall','Mittel gegen Durchfall',1],['erkaelt','Mittel gegen Erkältung',1],['salbe','Salbe für Stiche und Sonnenbrand',1]]},
  hygiene: {n:'Hygiene', items:[['seife','Seife',1,true],['zahnb','Zahnbürste',1,true],['paste','Zahnpasta',1],['klo','Toilettenpapier (Rollen)',4,true],['muell','Müllbeutel (Rolle)',1],['handdes','Handdesinfektion',1]]},
  licht:   {n:'Licht & Strom', items:[['lampe','Taschenlampe',1],['batt','Ersatzbatterien (Pack)',2],['radio','Radio mit Kurbel oder Batterie',1],['kerzen','Kerzen',6],['feuer','Feuerzeug oder Streichhölzer',2],['powerbank','Powerbank',1]]},
  waerme:  {n:'Wärme & Kochen', items:[['decke','Warme Decke oder Schlafsack',1,true],['kocher','Campingkocher',1],['kartusche','Gaskartuschen',3]]},
  // pp:'k' = pro Kleinkind, 5. Feld true = pro Tag. Mengen sind eigene Richtwerte
  // Haustiere: pp 'pf' = Trockenfutter kg (Summe aller Tiere pro Tag × Tage), 'pl' = Katzenstreu, 'pn' = pro Tier, 'pd' = pro Hund
  tiere:   {n:'Haustiere', only:'pets', items:[['tfutter','Tierfutter, trocken oder Dose (kg)',1,'pf'],['streu','Katzenstreu (kg)',1,'pl'],
    ['napf','Ersatznapf und Wasser für unterwegs',1,'pn'],['tbox','Transportbox, Leine oder Geschirr',1,'pn'],['kotb','Kotbeutel (Rolle)',1,'pd'],
    ['tmed','Medikamente und Heimtierausweis des Tiers',1,'pn']]},
  klein:   {n:'Kleinkind', only:'kids1', items:[['windeln','Windeln (Stück)',6,'k',true],['feucht','Feuchttücher (Packung, je 5 Tage)',0.2,'k',true],
    ['brei','Kleinkindnahrung: Gläschen oder Brei',1,'k',true],['mpulver','Milchpulver oder H-Milch für Kleinkinder (Packung)',1,'k'],
    ['becher','Trinkbecher oder Flasche',1,'k'],['kfieber','Fieber- und Schmerzmittel für Kinder',1],['wund','Wundschutzcreme',1],['spiel','Beschäftigung (Buch, Kuscheltier, Spiel)',1,'k']]},
  doku:    {n:'Dokumente & Geld', items:[['mappe','Dokumentenmappe (Originale)',1],['kopien','Kopien wichtiger Dokumente',1],['bargeld','Bargeld in kleinen Scheinen',1]]},
};
// Dokumente nach BBK-Ratgeber. p = pro Person, h = einmal für den Haushalt
const DOCS = {
  orig:{n:'Dokumentenmappe', sub:'Originale oder beglaubigte Kopien', view:'docs-orig', items:[
    ['geburt','Geburtsurkunde','p'],['zeugnis','Zeugnisse und Qualifikationsnachweise','p'],['verfuegung','Patientenverfügung und Vollmacht','p'],
    ['familie','Familienstammbuch, Heirats- und Sterbeurkunden','h'],['konto','Sparbücher und Kontoverträge','h'],['wertpapier','Aktien und Wertpapiere','h'],
    ['versich','Versicherungspolicen','h'],['einkommen','Renten-, Einkommens- und Steuerbescheide','h'],['vertrag','Verträge (Miete, Leasing, Kauf)','h'],['testament','Testament','h']]},
  copy:{n:'Kopien wichtiger Dokumente', sub:'Eine Kopie reicht', view:'docs-copy', items:[
    ['ausweis','Personalausweis','p'],['pass','Reisepass','p'],['fuehrer','Führerschein','p'],['impf','Impfpass','p'],
    ['kfz','Fahrzeugpapiere','h'],['grundbuch','Grundbuchauszug','h'],['melde','Meldebescheinigung','h'],['beitrag','Belege über Versicherungs- und Rentenbeiträge','h']]},
};
const DERIVED = {mappe:'orig', kopien:'copy'};
// Nahrung nach DGE-Richtwerten: Kinder 4–9 Jahre ca. 70 %, Kleinkinder 1–3 Jahre ca. 50 % eines Erwachsenen. Wasser und Checklisten zählen voll.
const EAT_KIDS4 = 0.7, EAT_KIDS1 = 0.5;
const kids4 = () => S.kids4||0, kids1 = () => S.kids1||0;
const adults = () => S.persons - kids4() - kids1();
const eatUnits = () => adults() + kids4()*EAT_KIDS4 + kids1()*EAT_KIDS1;
// Haustiere: Richtwerte pro Tier und Tag (eigene Annahmen, keine amtlichen Werte)
const PETS = [
  {k:'dogS', n:'Hund klein (bis 10 kg)', water:0.5, food:0.15},
  {k:'dogM', n:'Hund mittel (10–25 kg)', water:1, food:0.3},
  {k:'dogL', n:'Hund groß (über 25 kg)', water:2, food:0.5},
  {k:'cat',  n:'Katze', water:0.25, food:0.06, litter:0.15},
  {k:'small',n:'Kleintier (Kaninchen, Meerschweinchen)', water:0.1, food:0.1},
];
const petN = k => (S.pets&&S.pets[k])||0;
const petCount = () => PETS.reduce((a,x)=>a+petN(x.k),0);
const dogCount = () => petN('dogS')+petN('dogM')+petN('dogL');
const petWater = () => PETS.reduce((a,x)=>a+petN(x.k)*x.water,0);
const petFood  = () => PETS.reduce((a,x)=>a+petN(x.k)*x.food,0);
const petLitter= () => PETS.reduce((a,x)=>a+petN(x.k)*(x.litter||0),0);
function activeChecks(){ return Object.entries(CHECK).filter(([k,v])=>!v.only || (v.only==='kids1' && kids1()>0) || (v.only==='pets' && petCount()>0)); }
function needOf(item, p, T){ const [,, q, pp, perDay]=item;
  if(pp==='pf') return Math.ceil(petFood()*T); if(pp==='pl') return Math.ceil(petLitter()*T);
  if(pp==='pn') return q*petCount(); if(pp==='pd') return q*dogCount();
  const mult = pp==='k' ? kids1() : (pp ? p : 1); return Math.ceil(q*mult*(perDay?T:1)); }
function needText(item){ const [,, q, pp, perDay]=item;
  if(pp==='pf') return `${fmt(petFood(),2)} kg pro Tag für alle Tiere`; if(pp==='pl') return `${fmt(petLitter(),2)} kg pro Tag`;
  if(pp==='pn') return `${q} pro Tier`; if(pp==='pd') return `${q} pro Hund`;
  return pp==='k' ? `${fmt(q,2)} pro Kleinkind${perDay?' und Tag':''}` : pp ? `${q} pro Person` : ''; }
const APP_VERSION = '1.15';
const BACKUP_DAYS = 7, BACKUP_CHANGES = 10; // Erinnerung nach 7 Tagen oder 10 Änderungen
const CASH_PER_PERSON = 100; // Orientierung: NL/AT-Behörden ca. 70–100 € pro Person für 72 Stunden; BBK nennt keinen Betrag
const ICONS = {
  wasser:'<path d="M12 3c-3 4.2-6 7.6-6 11a6 6 0 0 0 12 0c0-3.4-3-6.8-6-11z"/>',
  nahrung:'<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 11.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
  hilfe:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M12 10.5v6M9 13.5h6"/>',
  medizin:'<rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.5 8.3l5 7.4"/>',
  hygiene:'<path d="M8.5 10h7v10a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z"/><path d="M12 10V6h3M10 6h2M8.5 14h7"/>',
  licht:'<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  waerme:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.6 1 2.6 2 3 0-3 .5-5.5.5-8z"/>',
  doku:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 10h18"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  klein:'<path d="M9 3h6M10 3v3M14 3v3"/><rect x="7" y="6" width="10" height="15" rx="3"/><path d="M7 11h10M10 15h4"/>',
  rotate:'<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/>',
  calc:'<circle cx="12" cy="13" r="8"/><path d="M12 13l4-3M12 5v2M4 13h2M18 13h2"/>',
  tiere:'<circle cx="6" cy="10" r="2"/><circle cx="10" cy="6" r="2"/><circle cx="14" cy="6" r="2"/><circle cx="18" cy="10" r="2"/><path d="M12 12c-3 0-5 3.5-5 6 0 1.5 1.2 2 2.5 2s1.6-.7 2.5-.7 1.2.7 2.5.7 2.5-.5 2.5-2c0-2.5-2-6-5-6z"/>',
  sos:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>',
  phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  shelf:'<path d="M3 4h18M3 12h18M3 20h18M5 4v16M19 4v16"/><rect x="7" y="7" width="4" height="5"/><rect x="13" y="9" width="4" height="3"/><rect x="8" y="15" width="7" height="5"/>',
  print:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
};
const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const MONTHS = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

/* ---------- Notfall-Wissen (eigene Texte nach Empfehlungen von BBK, BfR, BfS, Polizei, DWD; Stand Oktober 2026) ---------- */
const GIFT = [
  {lands:['Baden-Württemberg'], ort:'Freiburg', tel:'0761 19240'},
  {lands:['Bayern'], ort:'München', tel:'089 19240'},
  {lands:['Berlin','Brandenburg'], ort:'Berlin', tel:'030 19240'},
  {lands:['Bremen','Hamburg','Niedersachsen','Schleswig-Holstein'], ort:'Göttingen (GIZ-Nord)', tel:'0551 19240'},
  {lands:['Hessen','Rheinland-Pfalz','Saarland'], ort:'Mainz', tel:'06131 19240'},
  {lands:['Nordrhein-Westfalen'], ort:'Bonn', tel:'0228 19240'},
  {lands:['Mecklenburg-Vorpommern','Sachsen','Sachsen-Anhalt','Thüringen'], ort:'Erfurt', tel:'0361 730730'},
];
const LAENDER = GIFT.flatMap(g=>g.lands).sort((a,b)=>a.localeCompare(b,'de'));
const giftFor = land => GIFT.find(g=>g.lands.includes(land));

const NUMMERN = [
  ['112','Feuerwehr und Rettungsdienst','europaweit, kostenlos, auch ohne Guthaben'],
  ['110','Polizei',''],
  ['116117','Ärztlicher Bereitschaftsdienst','wenn es kein Notfall ist, die Praxis aber zu hat'],
  ['08001110111','Telefonseelsorge','kostenlos, rund um die Uhr, auch 0800 111 0 222'],
  ['115','Behördennummer','Fragen an Ämter, nicht überall erreichbar'],
];

// gear: Schlüssel aus den Checklisten, die für die Lage wichtig sind
const WISSEN = [
 {sec:'Grundlagen'},
 {id:'notruf', t:'Notruf richtig absetzen', tags:'112 110 anrufen w-fragen',
  now:['Ruhig bleiben, 112 wählen (Feuerwehr, Rettungsdienst) oder 110 (Polizei).',
       '<b>Wo</b> ist es passiert? Ort, Straße, Hausnummer, Stockwerk.',
       '<b>Was</b> ist passiert? Brand, Unfall, Erkrankung.',
       '<b>Wie viele</b> Verletzte oder Betroffene?',
       '<b>Welche</b> Verletzungen oder Beschwerden?',
       '<b>Warten</b> auf Rückfragen. Erst auflegen, wenn die Leitstelle es sagt.'],
  more:[['Gut zu wissen',['112 funktioniert in ganz Europa, kostenlos und auch ohne Guthaben im Handy.',
       'Wer nicht sprechen oder hören kann, nutzt die offizielle Notruf-App „nora“ der Bundesländer. Sie muss vorher eingerichtet werden.',
       'Erste Hilfe lernt man im Kurs, nicht aus einer App. Ein Auffrischungskurs alle paar Jahre lohnt sich.']]]},
 {id:'warnung', t:'Warnungen erkennen', tags:'sirene cell broadcast nina katwarn radio',
  now:['<b>Sirene, 1 Minute auf- und abschwellender Heulton:</b> Warnung. Ins Haus gehen, Fenster und Türen schließen, Radio einschalten.',
       '<b>Sirene, 1 Minute Dauerton:</b> Entwarnung. Die Gefahr ist vorbei, weiter auf Durchsagen achten.',
       '<b>Handy schrillt laut mit Warntext (Cell Broadcast):</b> Text genau lesen und den Anweisungen folgen.',
       'Durchsagen von Feuerwehr- oder Polizeifahrzeugen befolgen.'],
  more:[['Warnung auf dem Handy',['Cell Broadcast kommt ohne App auf jedes eingeschaltete Handy mit Empfang, wenn die Software aktuell ist (Android ab 11, iOS ab 16.1).',
       'Entwarnungen kommen auf der niedrigsten Warnstufe. Diese Stufe in den Handy-Einstellungen eingeschaltet lassen.',
       'Warn-Apps wie NINA oder KATWARN zeigen zusätzlich Hinweise. Dafür den eigenen Ort abonnieren.',
       'Nicht jeder Ort hat Sirenen. Deshalb immer einen zweiten Warnweg nutzen.'],],
   ['Sonstiges',['Zwei kurze Dauertöne mit Unterbrechung sind ein Feuerwehralarm und nur für die Einsatzkräfte gedacht.']]]},
 {id:'info', t:'Informiert bleiben ohne Strom und Internet', tags:'radio kurbelradio ukw autoradio',
  gear:['radio','batt','powerbank'],
  now:['Batterie-, Kurbel- oder Solarradio einschalten und einen regionalen UKW-Sender suchen.',
       'Zur Not geht das Autoradio. Den Motor dabei nur im Freien laufen lassen.',
       'Akkus von Handy und Powerbank schonen: Helligkeit runter, Energiesparmodus, nur kurz einschalten.',
       'Nur offiziellen Quellen glauben: Behörden, Rundfunk, Warn-Apps. Gerüchte nicht weiterverbreiten.'],
  more:[['Wo es Informationen gibt',['Viele Städte und Gemeinden richten bei großen Lagen Notfall-Infopunkte ein (oft „Katastrophenschutz-Leuchttürme“ genannt), meist an Feuerwehrhäusern, Rathäusern oder Schulen.',
       'Wo diese Punkte bei dir sind, erfährst du vorab bei deiner Gemeinde. Am besten jetzt nachschauen und hier notieren.']]]},
 {id:'netz', t:'Telefon und Notruf funktionieren nicht', tags:'netzausfall handy kein empfang notruf ausgefallen',
  now:['Notruf 112 trotzdem versuchen, auch über ein anderes Netz oder Festnetz.',
       'Klappt es nicht: zum nächsten Feuerwehrhaus, zur Polizeiwache oder zu einem Notfall-Infopunkt gehen. Dort kann Hilfe gerufen werden.',
       'Bei Lebensgefahr Nachbarn um Hilfe bitten, jemand bleibt bei der verletzten Person.',
       'Radio hören, dort wird gesagt, wo Hilfe erreichbar ist.'],
  more:[['Vorher klären',['Mit der Familie einen Treffpunkt vereinbaren, falls niemand erreichbar ist.',
       'Wichtige Nummern auf Papier notieren, das Handy kann leer sein.']]]},

 {sec:'Ausfall der Versorgung'},
 {id:'strom', t:'Stromausfall', tags:'blackout licht kühlschrank heizung',
  gear:['lampe','batt','radio','kerzen','feuer','powerbank','kocher'],
  now:['Ruhe bewahren. Prüfen, ob nur die eigene Wohnung betroffen ist (Sicherungskasten, Nachbarn).',
       'Taschenlampe statt Kerze nehmen. Kerzen nie unbeaufsichtigt brennen lassen.',
       'Radio einschalten, um zu erfahren, wie groß und lang der Ausfall ist.',
       'Herd, Bügeleisen und andere Wärmegeräte ausschalten, damit nichts passiert, wenn der Strom zurückkommt. Eine Lampe angeschaltet lassen, dann merkst du es.',
       'Kühlschrank und Gefriertruhe geschlossen halten.',
       'Nach älteren oder kranken Nachbarn sehen.'],
  more:[['Was alles ausfallen kann',['Auch Gas- und Ölheizungen fallen aus, weil Pumpe und Steuerung Strom brauchen.',
       'Handynetz und Internet halten oft nur wenige Stunden durch.',
       'Geldautomaten, Kartenzahlung, Tankstellen und Supermarktkassen funktionieren nicht. Bargeld hilft.',
       'In höheren Etagen kann das Wasser ausbleiben, weil Pumpen stehen. Bei Ankündigung Wasser abfüllen.'],],
   ['Lebensmittel',['Erst den Kühlschrank leer essen, dann die Gefriertruhe, zuletzt den Vorrat.',
       'Eine volle, geschlossene Gefriertruhe hält meist etwa einen Tag kalt.',
       'Aufgetautes nicht wieder einfrieren, sondern bald verbrauchen.'],],
   ['Kochen und Wärme',['Campingkocher nur bei offenem Fenster oder draußen benutzen.',
       'Grill, Gasheizer und Notstromaggregat nie in Wohnung, Keller oder Garage betreiben: Lebensgefahr durch Kohlenmonoxid (siehe eigene Karte).']]]},
 {id:'wasser', t:'Kein Wasser oder Abkochgebot', tags:'trinkwasser abkochen wasserausfall keime',
  now:['Bei Ankündigung Wasser abfüllen: Badewanne, Eimer, Töpfe, Kanister. Auch für die Toilettenspülung.',
       'Trinkwasser aus dem Vorrat zuerst zum Trinken und Kochen verwenden.',
       '<b>Abkochgebot:</b> Wasser sprudelnd aufkochen und einige Minuten kochen lassen, dann abkühlen lassen.',
       'Abgekochtes Wasser in einem sauberen, geschlossenen Gefäß aufbewahren und innerhalb weniger Stunden verbrauchen, am besten gekühlt.'],
  more:[['Wichtig',['Abkochen tötet Keime, hilft aber nicht gegen Chemikalien. Bei chemischer Verunreinigung das Leitungswasser nach Anweisung der Behörde gar nicht verwenden.',
       'Abgekochtes oder abgepacktes Wasser auch zum Zähneputzen, Gemüsewaschen und für Babynahrung nehmen.',
       'Pro Person rechnet man mit 2 Litern am Tag zum Trinken und Kochen.']]]},
 {id:'hygiene', t:'Hygiene ohne fließendes Wasser', tags:'toilette notklo waschen müll',
  gear:['muell','handdes','klo'],
  now:['Hände trotzdem gründlich waschen, mit wenig Wasser und Seife oder mit Desinfektionsmittel.',
       '<b>Notfall-Toilette:</b> Toilette oder Eimer mit einem stabilen Müllbeutel auslegen, nach jeder Benutzung etwas Katzenstreu, Sägespäne oder Zeitungspapier darüber, Beutel gut verschließen.',
       'Volle Beutel kühl und abgedeckt außerhalb der Wohnung lagern.',
       'Einweggeschirr und Haushaltspapier statt Spülen und nasser Lappen.'],
  more:[['Vorrat dafür',['Müllbeutel, Feuchttücher, Händedesinfektion, Haushaltshandschuhe, Toilettenpapier, Einweggeschirr.']]]},
 {id:'heizung', t:'Heizung fällt aus', tags:'kälte wohnung heizen frieren',
  gear:['decke','kocher'],
  now:['In einen Raum zurückziehen, möglichst klein und auf der Sonnenseite. Türen zu den anderen Räumen schließen.',
       'Mehrere Schichten Kleidung, Mütze und Socken tragen, Decken und Schlafsäcke nutzen.',
       'Fenster abdichten, Vorhänge zuziehen, Rollläden nachts schließen.',
       'Warm essen und trinken, sich bewegen.',
       '<b>Nie</b> mit Grill, Gaskocher, Gasheizer oder offenem Feuer in geschlossenen Räumen heizen.'],
  more:[['Wer besonders gefährdet ist',['Babys, ältere und kranke Menschen kühlen schneller aus. Regelmäßig nach ihnen sehen.',
       'Wenn es in der Wohnung zu kalt wird, nach Wärmestuben fragen, die Gemeinden bei längeren Ausfällen einrichten.']]]},

 {sec:'Wetter und Natur'},
 {id:'unwetter', t:'Unwetter, Sturm und Gewitter', tags:'sturm orkan hagel blitz gewitter dwd',
  now:['Warnungen des Deutschen Wetterdienstes beachten (Warn-App, Radio).',
       'Draußen lose Gegenstände sichern oder reinholen, wenn noch Zeit ist.',
       'Drinnen bleiben, Fenster, Türen und Rollläden schließen. Abstand zu Fenstern halten.',
       'Empfindliche Geräte vom Netz trennen.',
       'Im Auto bleiben, wenn du unterwegs bist. Keine blanken Metallteile anfassen. Nicht unter Bäumen parken.'],
  more:[['Gewitter im Freien',['Gebäude oder Auto aufsuchen. Wälder, einzelne Bäume, Hügel und Wasser meiden.',
       'Wenn kein Schutz da ist: in eine Mulde hocken, Füße eng zusammen, nicht hinlegen.',
       'Mindestens 50 Meter Abstand zu Strommasten und Überlandleitungen. Keine Regenschirme, nicht an Zäune lehnen.'],],
   ['Hagel',['Ohne Schutz flach hinlegen und Kopf und Nacken mit den Händen schützen.'],],
   ['Danach',['Schäden vor dem Aufräumen fotografieren (Versicherung).',
       'Nicht unter beschädigte Bäume, Dächer oder Fassaden gehen. Heruntergefallene Stromleitungen nicht berühren, 112 rufen.',
       'Ausgelaufenes Heizöl oder andere Gefahrstoffe der Feuerwehr melden.']]]},
 {id:'hochwasser', t:'Hochwasser und Starkregen', tags:'überschwemmung flut keller pegel starkregen',
  gear:['radio','lampe'],
  now:['Pegel- und Warnmeldungen verfolgen (Warn-App, Radio, Hochwasserzentralen).',
       'Wertsachen, Dokumente und Medikamente nach oben bringen. Notgepäck bereitstellen.',
       '<b>Keller und Tiefgaragen nicht mehr betreten.</b> Lebensgefahr durch Ertrinken und Stromschlag.',
       'Strom in betroffenen Räumen abschalten (Sicherung raus), aber nur, wenn du dabei nicht im Wasser stehst.',
       'Nicht durch überflutete Straßen und Unterführungen fahren oder gehen. Schon 30 Zentimeter strömendes Wasser kann ein Auto mitreißen.',
       'Bei Aufforderung sofort evakuieren. Kinder, Kranke und Haustiere früh in Sicherheit bringen.'],
  more:[['Vorbereiten',['Sandsäcke, Bretter und Dichtmaterial besorgen, Rückstauklappen prüfen lassen.',
       'Heizöltank gegen Aufschwimmen sichern, Chemikalien hoch lagern.',
       'Auto rechtzeitig aus Garage und Tiefgarage auf höhere Flächen fahren.'],],
   ['Danach',['Erst abpumpen, wenn das Grundwasser gesunken ist, sonst kann das Gebäude Schaden nehmen.',
       'Schäden fotografieren, Räume schnell trocknen (Schimmel).',
       'Elektrik, Heizöltank und Statik prüfen lassen, bevor du sie wieder nutzt.',
       'Lebensmittel, die mit Hochwasser in Kontakt kamen, und Obst und Gemüse aus überfluteten Gärten nicht essen.']]]},
 {id:'hitze', t:'Hitze', tags:'hitzewelle sommer hitzschlag sonne',
  now:['Viel trinken, mindestens 1,5 bis 2 Liter am Tag: Wasser, Tee, Saftschorle. Kein Alkohol.',
       'Wohnung tagsüber abdunkeln, früh morgens und nachts lüften.',
       'Anstrengung in die kühlen Morgen- und Abendstunden legen. Mittagssonne meiden.',
       'Leichte, helle Kleidung, Kopfbedeckung, Sonnencreme.',
       'Nach älteren, alleinlebenden und kranken Menschen sehen. Kindern regelmäßig Getränke anbieten.',
       '<b>Nie</b> Kinder oder Tiere im Auto lassen, auch nicht kurz.'],
  more:[['Wenn es jemandem schlecht geht',['Bei Schwindel, Kopfschmerz, Übelkeit, Verwirrtheit oder heißer, trockener Haut: in den Schatten bringen, Kleidung lockern, kühlen, zu trinken geben, wenn die Person bei Bewusstsein ist.',
       'Bei Verwirrtheit oder Bewusstlosigkeit sofort 112 rufen.',
       'Wer regelmäßig Medikamente nimmt, sollte mit dem Arzt klären, ob bei Hitze etwas angepasst werden muss.']]]},
 {id:'kaelte', t:'Kälte, Schnee und Glatteis', tags:'winter frost schnee eis unterkühlung',
  gear:['decke'],
  now:['Wege nur wenn nötig, festes Schuhwerk, warm in Schichten anziehen.',
       'Autofahrten bei Glatteis vermeiden. Im Auto immer Decke, Getränk und geladenes Handy dabeihaben.',
       'Im liegengebliebenen Auto bleiben, Warnblinker an. Motor nur zeitweise laufen lassen und den Auspuff von Schnee freihalten (Kohlenmonoxid).',
       'Nach älteren Nachbarn sehen.'],
  more:[['Unterkühlung erkennen',['Starkes Zittern, Müdigkeit, Verwirrtheit, langsames Sprechen: Person langsam in die Wärme bringen, nasse Kleidung ausziehen, zudecken, warme süße Getränke geben, wenn sie wach ist. Bei Bewusstseinsstörung 112.',
       'Kein Alkohol, er macht nur scheinbar warm.'],],
   ['Am Haus',['Bei viel Schnee Dachlasten beachten, besonders bei Flachdächern und Hallen.',
       'Wasserleitungen in unbeheizten Räumen vor Frost schützen.']]]},
 {id:'waldbrand', t:'Waldbrand und Flächenbrand', tags:'feuer rauch wald vegetation',
  now:['Feuer oder Rauch sofort über 112 melden, mit möglichst genauem Ort.',
       'Bei Rauch in der Nähe: Fenster und Türen schließen, Lüftung aus.',
       'Aufforderungen zum Verlassen des Gebiets sofort folgen. Notgepäck mitnehmen.',
       'Im Wald: nicht gegen den Wind und nicht bergauf vor dem Feuer fliehen. Quer zur Windrichtung auf breite Wege, Felder oder schon verbrannte Flächen gehen.',
       'Zufahrtswege frei halten, nicht zum Schauen anhalten.'],
  more:[['Vorbeugen',['Bei Waldbrandgefahr kein Feuer, kein Grillen und nicht rauchen im und am Wald.',
       'Autos nicht auf trockenem Gras parken, heiße Teile können es entzünden.']]]},
 {id:'erdbeben', t:'Erdbeben', tags:'beben nachbeben',
  now:['Drinnen bleiben, nicht nach draußen rennen.',
       'Unter einen stabilen Tisch kriechen oder an eine tragende Innenwand, Kopf schützen. Weg von Fenstern, Regalen und Lampen.',
       'Draußen: Abstand zu Gebäuden, Mauern und Leitungen halten.',
       'Nach dem Beben: Gas und Wasser abdrehen, Strom aus, offene Flammen löschen. Bei Schäden das Haus mit Notgepäck verlassen.',
       'Mit Nachbeben rechnen. Beschädigte Gebäude erst nach Prüfung wieder betreten.'],
  more:[['Wo in Deutschland?',['Spürbare Beben sind in Deutschland selten, am ehesten im Oberrheingraben, in der Niederrheinischen Bucht, auf der Schwäbischen Alb und im Vogtland.']]]},

 {sec:'Feuer und Gefahrstoffe'},
 {id:'brand', t:'Brand in der Wohnung oder im Haus', tags:'feuer rauch rauchmelder fett löschen',
  now:['Ruhe bewahren, alle warnen und das Gebäude verlassen. Eigene Sicherheit geht vor.',
       '112 rufen.',
       'Türen hinter dir schließen, aber nicht abschließen. Keinen Aufzug benutzen.',
       'Verrauchte Räume nicht betreten. Ist der Flur voller Rauch: in der Wohnung bleiben, Tür schließen, Ritzen abdichten, am Fenster bemerkbar machen.',
       'Draußen prüfen, ob alle da sind, und es der Feuerwehr sagen.'],
  more:[['Kleine Brände löschen',['Nur, wenn es ohne Gefahr geht.',
       'Brennendes Fett oder Öl <b>nie mit Wasser</b> löschen. Deckel drauf, Herd aus.',
       'Von unten nach oben und von vorne nach hinten löschen.'],],
   ['Vorbeugen',['Rauchmelder in Schlafräumen, Kinderzimmern und Fluren, regelmäßig testen.',
       'Feuerlöscher oder Löschdecke griffbereit haben.']]]},
 {id:'co', t:'Kohlenmonoxid (CO)', tags:'vergiftung abgas grill gasheizer notstromaggregat co-melder',
  now:['CO ist unsichtbar und riecht nicht. Es entsteht bei jeder Verbrennung: Grill, Gasheizer, Gaskocher, Ofen, Notstromaggregat, Automotor.',
       '<b>Anzeichen:</b> Kopfschmerz, Schwindel, Übelkeit, Müdigkeit, Verwirrtheit, mehrere Personen gleichzeitig betroffen.',
       'Verdacht: sofort Fenster und Türen auf, Gerät ausschalten, raus an die frische Luft, 112 rufen.',
       'Bewusstlose nur retten, wenn du dich nicht selbst in Gefahr bringst.'],
  more:[['Vorbeugen',['Grill, Gasheizer und Notstromaggregat nie in Wohnung, Keller, Garage oder Zelt betreiben.',
       'Ein CO-Melder in Räumen mit Ofen, Gastherme oder Kamin warnt rechtzeitig.']]]},
 {id:'gefahrstoff', t:'Gefahrstoffe, Chemieunfall, Großbrand mit Rauch', tags:'chemie gas giftig rauchwolke cbrn',
  now:['Sofort ins nächste Gebäude gehen. Draußen quer zur Windrichtung, Mund und Nase bedecken.',
       'Fenster und Türen schließen, Lüftung, Klimaanlage und Dunstabzug ausschalten.',
       'In einen innenliegenden Raum ohne Fenster gehen, möglichst nicht in den Keller (Gase sind oft schwerer als Luft).',
       'Radio einschalten und den Durchsagen folgen. Nur im Notfall telefonieren, damit die Netze frei bleiben.',
       'Im Auto: Fenster zu, Lüftung aus, Radio hören.'],
  more:[['Wenn du Kontakt hattest',['Oberbekleidung und Schuhe ausziehen und in einem Beutel außerhalb der Wohnräume lagern.',
       'Hände, Gesicht, Haare, Nase und Ohren mit Wasser und Seife waschen.',
       'Bei Beschwerden 112 rufen oder den Giftnotruf deines Bundeslands.']]]},
 {id:'atom', t:'Unfall mit radioaktiven Stoffen', tags:'radioaktiv atom kernkraftwerk strahlung jod',
  now:['Ins Haus gehen und drinnen bleiben, Fenster und Türen schließen, Lüftung aus.',
       'Einen Raum in der Gebäudemitte oder einen Keller aufsuchen.',
       'Radio und Warn-App verfolgen und den Anweisungen der Behörden folgen.',
       '<b>Jodtabletten nur nach ausdrücklicher Aufforderung der Behörden einnehmen</b>, nicht vorsorglich auf eigene Faust.'],
  more:[['Zu Jodtabletten',['Sie schützen nur die Schilddrüse vor radioaktivem Jod und nur, wenn sie zum richtigen Zeitpunkt genommen werden.',
       'Menschen über 45 Jahre sollen sie nicht einnehmen, das Risiko von Nebenwirkungen ist größer als der Nutzen.',
       'Die Tabletten werden im Ernstfall von den Behörden verteilt. Hochdosiertes Jod ist kein Nahrungsergänzungsmittel.'],],
   ['Nach dem Aufenthalt draußen',['Kleidung wechseln und in einen Beutel geben, duschen, Haare waschen.',
       'Lebensmittel aus dem Garten erst nach Freigabe essen.']]]},

 {sec:'Sicherheitslagen'},
 {id:'evakuierung', t:'Evakuierung (z. B. Bombenentschärfung)', tags:'räumen verlassen notgepäck sammelstelle',
  gear:['mappe','bargeld'],
  now:['Den Anweisungen von Polizei und Feuerwehr folgen, ohne Umwege.',
       'Notgepäck, Dokumentenmappe, Medikamente, Handy und Ladegerät mitnehmen.',
       'Herd und Elektrogeräte ausschalten, Fenster schließen, Wohnung abschließen.',
       'Nachbarn Bescheid geben, besonders älteren oder kranken Menschen. Haustiere mitnehmen.',
       'Zur angegebenen Sammelstelle gehen oder bei Freunden und Verwandten außerhalb unterkommen und dich dort abmelden, wenn darum gebeten wird.'],
  more:[['Notgepäck pro Person',['Ein Rucksack: Erste-Hilfe-Set, persönliche Medikamente, Dokumententasche, Verpflegung und Wasser für zwei Tage, Radio, Taschenlampe, Decke oder Schlafsack, Wechselkleidung, Hygieneartikel, Bargeld.',
       'Kindern einen Zettel mit Name, Anschrift und Telefonnummer mitgeben.']]]},
 {id:'amok', t:'Amok, Terror, bewaffneter Angriff', tags:'angriff waffe gewalt flüchten verstecken',
  now:['<b>Flüchten:</b> Den Gefahrenbereich sofort verlassen, andere mitnehmen. Hinter stabilen Mauern Deckung suchen.',
       '<b>Verstecken:</b> Geht Flucht nicht, in einem Raum einschließen, Tür verbarrikadieren. Licht aus, Handy lautlos, leise sein, auf den Boden legen, weg von Türen und Fenstern.',
       '<b>Alarmieren:</b> Sobald du sicher bist, 110 anrufen.',
       '<b>Wenn die Polizei kommt:</b> ruhig bleiben, Hände sichtbar über den Kopf, keine schnellen Bewegungen, Anweisungen befolgen.'],
  more:[['Danach',['Keine Fotos oder Videos von Opfern oder Einsatzkräften verbreiten.',
       'Hilfe für belastete Menschen: Telefonseelsorge 0800 111 0 111, kostenlos und rund um die Uhr.']]]},
 {id:'luftalarm', t:'Warnung vor Angriffen aus der Luft', tags:'luftalarm krieg bombe rakete schutzraum',
  now:['Sofort Schutz in einem Gebäude suchen.',
       'Möglichst in einen Raum ohne Fenster, am besten in den Keller. Ohne Keller: innenliegender Flur, Treppenhaus oder Bad.',
       '<b>Zwei-Wände-Regel:</b> Zwischen dir und draußen sollten mindestens zwei Wände liegen.',
       'Abstand zu Fenstern, Türen und Glas halten. Keine Aufzüge benutzen.',
       'Radio und Warn-App verfolgen und erst nach Entwarnung den Schutzraum verlassen.'],
  more:[['Gut zu wissen',['Ein flächendeckendes öffentliches Bunkersystem gibt es in Deutschland nicht. Der beste Schutz ist meist das eigene Haus mit Keller oder innenliegendem Raum.',
       'Vorsorge wie bei allen Lagen: Vorrat, Dokumente griffbereit, Radio, geladene Akkus.']]]},

 {sec:'Gesundheit und Belastung'},
 {id:'pandemie', t:'Ansteckende Krankheiten, Pandemie', tags:'seuche quarantäne infektion virus',
  gear:['handdes','schmerz','thermo'],
  now:['Hände oft und gründlich waschen, in die Armbeuge husten und niesen.',
       'Abstand halten, Menschenmengen meiden, Maske tragen, wenn empfohlen.',
       'Bei Krankheitszeichen zu Hause bleiben und bei Bedarf die Praxis oder 116117 anrufen, nicht unangemeldet hingehen.',
       'Den Anweisungen des Gesundheitsamts folgen.'],
  more:[['Vorrat für Quarantäne',['Lebensmittel und Getränke für mindestens 10 bis 14 Tage, wichtige Medikamente, Fieberthermometer, Schmerz- und Fiebermittel.',
       'Absprechen, wer für wen einkaufen kann.']]]},
 {id:'psyche', t:'Angst und seelische Belastung', tags:'stress panik angst kinder seelsorge',
  now:['Ruhig und langsam atmen, auf das Ausatmen konzentrieren.',
       'Mit anderen sprechen, nicht allein bleiben. Feste Abläufe helfen, auch in der Krise.',
       'Kindern ehrlich und altersgerecht erklären, was los ist. Nachrichten nicht ständig laufen lassen.',
       'Hilfe annehmen: Telefonseelsorge 0800 111 0 111 oder 0800 111 0 222, kostenlos und rund um die Uhr.'],
  more:[]},
];

/* ---------- Beispieldaten ---------- */
function demoState(){
  const it = (cat,group,name,size,unit,count,mhd)=>({id:uid(),cat,group,name,size,unit,count,mhd,demo:true});
  return {persons:2, days:10, demo:true, checks:{verband:1,thermo:1,schmerz:1,seife:2,zahnb:2,paste:1,klo:4,lampe:1,batt:1,kerzen:6,feuer:1,decke:2},
    names:[], cash:{have:150,target:null},
    docs:{'orig|h|versich':1,'orig|h|konto':1,'orig|p0|geburt':1,'orig|p1|geburt':1,'copy|p0|ausweis':1,'copy|p1|ausweis':1,'copy|p1|fuehrer':'na','copy|h|grundbuch':'na'},
    items:[
      it('wasser',null,'Mineralwasser 1,5 l',1.5,'l',12,'2027-08'),
      it('nahrung','getreide','Ravioli Dose',800,'g',4,'2028-03'),
      it('nahrung','getreide','Nudeln',500,'g',4,'2027-11'),
      it('nahrung','getreide','Reis',1,'kg',2,'2028-01'),
      it('nahrung','getreide','Knäckebrot',250,'g',2, ym(1)),
      it('nahrung','getreide','Zwieback',225,'g',1, ym(-2)),
      it('nahrung','gemuese','Kidneybohnen Dose',400,'g',6,'2029-03'),
      it('nahrung','gemuese','Erbsen und Möhren Dose',400,'g',4,'2028-06'),
      it('nahrung','obst','Pfirsiche Dose',820,'g',2,'2028-02'),
      it('nahrung','obst','Nussmischung',200,'g',2,'2027-04'),
      it('nahrung','milch','H-Milch',1,'l',6,'2027-02'),
      it('nahrung','fleisch','Thunfisch Dose',150,'g',6,'2029-10'),
      it('nahrung','fett','Rapsöl',500,'ml',1,'2027-09'),
    ]};
}
function emptyState(){ return {land:S?S.land||null:null, persons:S?S.persons:2, kids4:S?S.kids4||0:0, kids1:S?S.kids1||0:0, pets:S?S.pets||{}:{}, petsOn:S?!!S.petsOn:false, days:S?S.days:10, demo:false, checks:{}, items:[], docs:{}, names:S?S.names:[], cash:{have:0,target:null}}; }

/* ---------- Helfer ---------- */
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,7); }
const NOW = new Date(); const CUR = NOW.getFullYear()*12+NOW.getMonth();
function ym(offset){ const i=CUR+offset; return `${Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`; }
function mhdIdx(m){ if(!m) return null; const [y,mo]=m.split('-').map(Number); return y*12+mo-1; }
function mhdState(m){ const i=mhdIdx(m); if(i===null) return 'none'; if(i<CUR) return 'expired'; if(i-CUR<=2) return 'soon'; return 'ok'; }
function mhdText(m){ if(!m || !/^\d{4}-\d{2}$/.test(m)) return 'ohne MHD'; const [y,mo]=m.split('-').map(Number); return `${(MONTHS[mo-1]||'').slice(0,3)} ${y}`; }
const fmt = (n,d=1)=> Number(n).toLocaleString('de-DE',{maximumFractionDigits:d});
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base = it => (it.unit==='g'||it.unit==='ml') ? it.size/1000 : it.size;
// Faktor für Trockenware/Pulver (nur Nahrung, nur Gruppen mit form)
const factor = it => { if(it.cat!=='nahrung'||!it.dry) return 1; const g=FOOD.find(x=>x.k===it.group); return g&&g.form?g.form.f:1; };
const amount = it => base(it)*it.count*factor(it);
const SHORT_MONTHS = 3; // MHD unter 3 Monaten: Hinweis beim Eintragen
const sizeText = it => `${fmt(it.size,2)} ${it.unit}`;
const status = r => r>=1 ? 'ok' : r>=.5 ? 'warn' : 'bad';
const parseNum = v => parseFloat(String(v).replace(',','.'));
function personName(i){ return (S.names&&S.names[i]||'').trim() || `Person ${i+1}`; }
function cashTarget(){ return S.cash&&S.cash.target>0 ? S.cash.target : S.persons*CASH_PER_PERSON; }
// Stand einer Dokumentenliste: offene Punkte über alle Personen und den Haushalt
function docStatus(kind){
  const d=DOCS[kind]; let total=0, done=0; const open=[];
  const scopes=[...Array(S.persons).keys()].map(i=>'p'+i).concat('h');
  scopes.forEach(sc=>d.items.forEach(([k,n,t])=>{ if((t==='p')!==(sc!=='h')) return;
    total++; const v=(S.docs||{})[`${kind}|${sc}|${k}`]; if(v) done++; else open.push(sc==='h'?n:`${n} (${personName(+sc.slice(1))})`); }));
  return {total,done,open};
}
// Menge "vorhanden" – bei Mappe, Kopien und Bargeld aus den Unterlisten abgeleitet
function have(key){
  if(DERIVED[key]){ const st=docStatus(DERIVED[key]); return st.total&&st.done===st.total?1:0; }
  if(key==='bargeld') return (S.cash?.have||0)>=cashTarget()?1:0;
  return S.checks[key]||0;
}

/* ---------- Speicher: IndexedDB, sonst nur im Arbeitsspeicher ---------- */
const DB = {
  db:null,
  open(){ return new Promise(res=>{ try{ const r=indexedDB.open('vorratsplaner',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>{this.db=r.result;res(true)}; r.onerror=()=>res(false);}catch(e){res(false)} }); },
  get(key='state'){ return new Promise(res=>{ if(!this.db) return res(null); try{ const r=this.db.transaction('kv').objectStore('kv').get(key);
    r.onsuccess=()=>res(r.result||null); r.onerror=()=>res(null);}catch(e){res(null)} }); },
  put(v,key='state'){ if(!this.db) return; try{ this.db.transaction('kv','readwrite').objectStore('kv').put(v,key); }catch(e){} },
};
// Sicherungs-Status und automatische Tages-Zwischenstände (nur auf diesem Gerät)
let META = {lastBackup:null, changes:0, snoozeUntil:0, cal:null, calFreq:'monthly'};
let SNAPS = [];
const today = () => new Date().toISOString().slice(0,10);
function snapshot(){
  if(S.demo || !S.items.length && !Object.keys(S.checks||{}).length) return;
  const data=JSON.parse(JSON.stringify(S)), d=today();
  SNAPS = SNAPS.filter(x=>x.day!==d); SNAPS.unshift({day:d, at:Date.now(), data});
  SNAPS = SNAPS.slice(0,7); DB.put(SNAPS,'snaps');
}
let saveT; function save(){ clearTimeout(saveT);
  if(!S.demo){ META.changes=(META.changes||0)+1; DB.put(META,'meta'); }
  saveT=setTimeout(()=>{ DB.put(JSON.parse(JSON.stringify(S))); snapshot(); },250); }
/* ---------- Kalender-Erinnerung (Serientermin „Vorratscheck“) ---------- */
const CAL_FREQ = {weekly:{n:'Wöchentlich', adj:'Wöchentlicher', rule:'FREQ=WEEKLY'}, monthly:{n:'Monatlich', adj:'Monatlicher', rule:'FREQ=MONTHLY'}, quarterly:{n:'Alle 3 Monate', adj:'Vierteljährlicher', rule:'FREQ=MONTHLY;INTERVAL=3'}};
const APP_URL = 'https://t43w41t3w01f.github.io/vorratsplaner/';
function nextSaturday10(){ const d=new Date(); d.setHours(10,0,0,0); const add=(6-d.getDay()+7)%7||7; d.setDate(d.getDate()+add); return d; }
function calStamp(d){ const z=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}T${z(d.getHours())}${z(d.getMinutes())}00`; }
function calTexts(freq){ return {title:'Vorratscheck', details:`${CAL_FREQ[freq].adj} Vorratscheck: Vorratsplaner öffnen, Verbrauchsliste ansehen, fehlende Dinge einkaufen, Sicherung machen.\n${APP_URL}`}; }
function googleCalUrl(freq){
  const st=nextSaturday10(), en=new Date(st.getTime()+15*60000), t=calTexts(freq);
  const q=new URLSearchParams({action:'TEMPLATE', text:t.title, details:t.details, dates:`${calStamp(st)}/${calStamp(en)}`, ctz:'Europe/Berlin', recur:'RRULE:'+CAL_FREQ[freq].rule});
  return 'https://calendar.google.com/calendar/render?'+q.toString();
}
function icsDownload(freq){
  const st=nextSaturday10(), en=new Date(st.getTime()+15*60000), t=calTexts(freq);
  const esc2=x=>x.replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Vorratsplaner//DE','CALSCALE:GREGORIAN','BEGIN:VEVENT',
    `UID:vorratscheck-${Date.now()}@vorratsplaner`, `DTSTAMP:${calStamp(new Date())}`, `DTSTART:${calStamp(st)}`, `DTEND:${calStamp(en)}`,
    `RRULE:${CAL_FREQ[freq].rule}`, `SUMMARY:${esc2(t.title)}`, `DESCRIPTION:${esc2(t.details)}`, `URL:${APP_URL}`,
    'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:Vorratscheck','TRIGGER:-PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  try{ const url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); const a=document.createElement('a'); a.href=url; a.download='vorratscheck.ics';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000); return true; }catch(e){ return false; }
}
function calChooser(ctx){
  const f=META.calFreq||'monthly';
  return `<div class="chips" role="radiogroup" aria-label="Wie oft?">${Object.entries(CAL_FREQ).map(([k,v])=>`<button class="chip" role="radio" data-act="calFreq" data-f="${k}" aria-pressed="${k===f}" aria-checked="${k===f}">${v.n}</button>`).join('')}</div>
    <div class="row"><a class="primary small btnlink" href="${googleCalUrl(f)}" target="_blank" rel="noopener" data-act="calGoogle">Im Google Kalender eintragen</a>
      <button class="secondary small" data-act="calIcs">Anderer Kalender</button></div>
    <p class="hint" style="margin:0">Der Termin startet am nächsten Samstag um 10 Uhr, Uhrzeit und Tag kannst du im Kalender ändern. „Anderer Kalender“ lädt eine Termindatei, z. B. für Samsung oder iPhone.</p>`;
}
function calPrompt(){
  return `<div class="band info"><div style="display:flex;flex-direction:column;gap:10px">
    <div><b>Regelmäßig nachsehen?</b><div class="small">Ein Vorrat hilft nur, wenn er aktuell ist. Leg dir einen Serientermin „Vorratscheck“ im Kalender an, dann erinnert dich dein Handy zuverlässig.</div></div>
    ${calChooser('prompt')}
    <div class="row"><button class="linkbtn small" data-act="calLater">Später</button><button class="linkbtn small" data-act="calNever">Nein danke</button></div></div></div>`;
}
function calDue(){ return !S.demo && (META.cal==='ask' || (META.cal==='later' && !UI.calLaterShown)); }

function daysSince(ts){ return ts ? Math.floor((Date.now()-ts)/864e5) : null; }
function backupDue(){
  if(S.demo || !S.items.length) return false;
  if(Date.now() < (META.snoozeUntil||0)) return false;
  const d=daysSince(META.lastBackup);
  return d===null || d>=BACKUP_DAYS || (META.changes||0)>=BACKUP_CHANGES;
}
function backupData(){ return JSON.stringify({app:'vorratsplaner', version:1, savedAt:new Date().toISOString(), ...S}, null, 1); }
function backupName(){ return `vorratsplaner-sicherung-${today()}.json`; }
function markBackedUp(){ META.lastBackup=Date.now(); META.changes=0; META.snoozeUntil=0; DB.put(META,'meta'); }
function canShareFile(){ try{ return !!(navigator.canShare && navigator.canShare({files:[new File(['x'],'t.json',{type:'application/json'})]})); }catch(e){ return false; } }
async function doBackup(mode){
  const text=backupData();
  if(mode==='share'){
    try{ await navigator.share({files:[new File([text],backupName(),{type:'application/json'})], title:'Vorratsplaner-Sicherung'}); markBackedUp(); UI.msg='Sicherung geteilt.'; }
    catch(e){ if(e&&e.name==='AbortError') UI.msg='Teilen abgebrochen.'; else UI.msg='Teilen nicht möglich. Nutze „Als Datei speichern“.'; }
    return;
  }
  try{ const url=URL.createObjectURL(new Blob([text],{type:'application/json'})); const a=document.createElement('a');
    a.href=url; a.download=backupName(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),4000);
    markBackedUp(); UI.msg=`Gespeichert als ${backupName()} (Ordner „Downloads“).`;
  }catch(e){ UI.msg='Speichern nicht möglich. Nutze „Als Text kopieren“.'; }
}
/* ---------- Datenprüfung: nur bekannte Felder, nur gültige Werte (Schutz vor manipulierten Sicherungen) ---------- */
const int = (v,min,max,def) => { const n=Math.round(Number(v)); return Number.isFinite(n) ? Math.min(max,Math.max(min,n)) : def; };
const num = (v,min,max,def) => { const n=Number(v); return Number.isFinite(n) && n>=min && n<=max ? n : def; };
const str = (v,max) => typeof v==='string' ? v.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,max) : '';
function cleanItem(it){
  if(!it || typeof it!=='object') return null;
  const cat = it.cat==='wasser'||it.cat==='nahrung' ? it.cat : null; if(!cat) return null;
  const group = cat==='nahrung' ? (FOOD.some(g=>g.k===it.group) ? it.group : null) : null;
  if(cat==='nahrung' && !group) return null;
  const name = str(it.name,80); if(!name) return null;
  const unit = ['g','kg','ml','l'].includes(it.unit) ? it.unit : null; if(!unit) return null;
  const size = num(it.size,0.001,100000,null); if(size===null) return null;
  const mhd = typeof it.mhd==='string' && /^(19|20|21)\d\d-(0[1-9]|1[0-2])$/.test(it.mhd) ? it.mhd : null;
  const out = {id: typeof it.id==='string' && /^[a-z0-9]{4,40}$/.test(it.id) ? it.id : uid(), cat, group, name, size, unit, count:int(it.count,0,9999,1), mhd};
  if(it.dry===true && FOOD.find(g=>g.k===group)?.form) out.dry=true;
  if(it.demo===true) out.demo=true;
  return out;
}
function cleanState(d){
  if(!d || typeof d!=='object' || !Array.isArray(d.items)) throw new Error('ungültig');
  const persons=int(d.persons,1,20,2), kids4=int(d.kids4,0,19,0), kids1=int(d.kids1,0,19,0);
  const k4=Math.min(kids4,persons-1), k1=Math.min(kids1,persons-1-k4);
  const known=new Set(); Object.values(CHECK).forEach(v=>v.items.forEach(it=>known.add(it[0])));
  const checks={}; if(d.checks&&typeof d.checks==='object') for(const k of Object.keys(d.checks)) if(known.has(k)) checks[k]=int(d.checks[k],0,9999,0);
  const docs={}; if(d.docs&&typeof d.docs==='object') for(const k of Object.keys(d.docs)) if(/^(orig|copy)\|(p\d{1,2}|h)\|[a-z]{2,20}$/.test(k) && (d.docs[k]===1||d.docs[k]==='na')) docs[k]=d.docs[k];
  const pets={}; if(d.pets&&typeof d.pets==='object') PETS.forEach(x=>{ const n=int(d.pets[x.k],0,20,0); if(n) pets[x.k]=n; });
  const items=d.items.slice(0,2000).map(cleanItem).filter(Boolean);
  const seen=new Set(); items.forEach(it=>{ if(seen.has(it.id)) it.id=uid(); seen.add(it.id); });
  return {land: LAENDER.includes(d.land) ? d.land : null, persons, kids4:k4, kids1:k1, pets, petsOn: d.petsOn===true || Object.keys(pets).length>0,
    days:int(d.days,1,90,10), demo: d.demo===true, checks, items, docs,
    names: Array.isArray(d.names) ? d.names.slice(0,20).map(n=>str(n,40)) : [],
    cash: {have: num(d.cash?.have,0,1e6,0), target: num(d.cash?.target,1,1e6,null)}};
}
function parseBackup(text){
  if(typeof text!=='string' || text.length>5e6) throw new Error('zu groß');
  const d=cleanState(JSON.parse(text)); d.demo=false; d.items.forEach(i=>delete i.demo);
  return d;
}
function restore(data, msg){
  if(!S.demo){ const d=today(); SNAPS=SNAPS.filter(x=>x.day!==d+'-vorher'); SNAPS.unshift({day:d+'-vorher', at:Date.now(), data:JSON.parse(JSON.stringify(S))}); SNAPS=SNAPS.slice(0,8); DB.put(SNAPS,'snaps'); }
  S=data; save(); markBackedUp(); UI.pending=null; UI.msg=msg; UI.view='home';
}
function summary(d){ const n=d.items.length; return `${n} ${n===1?'Artikel':'Artikel'}, ${d.persons} ${d.persons===1?'Person':'Personen'}`; }

/* ---------- Zustand ---------- */
let S = null;
let UI = {view:'home', back:'vorrat', tab:'reach', sheet:null, confirmReset:false, msg:''};
// Drucken klappt in der installierten App, nicht in der eingebetteten Vorschau
const CAN_PRINT = (()=>{ try{ return window.self===window.top; }catch(e){ return false; } })();

/* ---------- Berechnung ---------- */
function calc(){
  const p=S.persons, T=S.days;
  let water=0; const food={}; FOOD.forEach(g=>food[g.k]=0);
  const expired=[], soon=[];
  S.items.forEach(it=>{
    const st=mhdState(it.mhd);
    if(st==='expired'){ expired.push(it); return; }
    if(st==='soon') soon.push(it);
    const a=amount(it);
    if(it.cat==='wasser') water+=a; else if(food[it.group]!==undefined) food[it.group]+=a;
  });
  const foodTotal=Object.values(food).reduce((a,b)=>a+b,0);
  const eat=eatUnits();
  const wDay=p*WATER_DAY+petWater();
  const waterReach=water/wDay, foodReach=foodTotal/(eat*FOOD_DAY);
  const reach=Math.floor(Math.min(waterReach,foodReach)+1e-9);
  const checks={};
  for(const [k,c] of activeChecks()){
    let need=0, got=0;
    c.items.forEach(it=>{ const key=it[0], n=needOf(it,p,T); need+=n; got+=Math.min(have(key),n); });
    checks[k]={need,have:got,ratio:need?got/need:1};
  }
  return {p,T,water,food,foodTotal,waterReach,foodReach,reach,
    bottleneck: waterReach<=foodReach?'Wasser':'Nahrung', expired, soon, checks,
    waterNeed:wDay*T, petWaterNeed:petWater()*T, foodNeed:eat*FOOD_DAY*T, eat};
}

/* ---------- Ansichten ---------- */
const root=document.getElementById('app');
function render(){
  const c=calc();
  if(UI.view==='home') root.innerHTML=viewHome(c);
  else if(UI.view==='vorrat') root.innerHTML=viewVorrat(c);
  else if(UI.view==='calc') root.innerHTML=viewCalc(c);
  else if(UI.view==='wasser'||UI.view==='nahrung') root.innerHTML=viewStock(c);
  else if(UI.view==='settings') root.innerHTML=viewSettings();
  else if(UI.view==='rotation') root.innerHTML=viewRotation(c);
  else if(UI.view==='wissen') root.innerHTML=viewWissen();
  else if(UI.view==='docs-orig') root.innerHTML=viewDocs('orig');
  else if(UI.view==='docs-copy') root.innerHTML=viewDocs('copy');
  else if(UI.view==='cash') root.innerHTML=viewCash();
  else root.innerHTML=viewCheck(c);
  root.insertAdjacentHTML('beforeend', `<footer>Richtwerte nach Empfehlung des Bundesamts für Bevölkerungsschutz (BBK): 10 Tage, 2 Liter Getränke und ca. 2.200 kcal pro Person und Tag. Keine Garantie für die Versorgung im Notfall.<br><a href="versionen.html" style="color:inherit">Version ${APP_VERSION} – Was ist neu?</a> · <a href="datenschutz.html" style="color:inherit">Datenschutz</a><span class="brand">Entwickelt von Sascha L. · © 2026</span></footer>`);
  if(UI.sheet) root.insertAdjacentHTML('beforeend', viewSheet());
}

function bar(r){ return `<div class="bar" role="presentation"><i class="s-${status(r)}" style="width:${Math.min(r,1)*100}%"></i></div>`; }

function viewHome(c){
  const nItems=S.items.length, nParts=Object.values(S.checks).reduce((a,b)=>a+b,0)+Object.values(S.docs||{}).filter(v=>v===1).length;
  return `<div class="topbar"><h1>Vorratsplaner</h1><button class="iconbtn" data-act="go" data-v="settings" aria-label="Einstellungen">${icon('gear')}</button></div>
  ${S.demo?`<div class="band info"><div><b>Du siehst Beispieldaten.</b><span class="small">So sieht ein halb gefüllter Vorrat für 2 Personen aus. </span><button class="linkbtn small" data-act="startOwn">Eigenen Vorrat anlegen</button></div></div>`:''}
  ${expiryBand(c)}
  ${calDue()?calPrompt():(backupDue()?backupBand():'')}
  ${UI.view==='home'&&UI.msg?`<div class="small t-ok" role="status" style="font-weight:700">${UI.msg}</div>`:''}
  <p class="lead">Plane deinen Notvorrat nach den Empfehlungen des Bundesamts für Bevölkerungsschutz.</p>
  <div class="choices">
    <button class="choice" data-act="go" data-v="vorrat"><span class="choice-ico">${icon('shelf')}</span>
      <span class="choice-txt"><span class="ct">Mein Vorrat</span><span class="small muted">Artikel eintragen, Mengen und Haltbarkeit ändern</span>
      <span class="small num choice-fact">${nItems} Lebensmittel und Wasser · ${nParts} Ausrüstungsteile</span></span></button>
    <button class="choice" data-act="go" data-v="calc"><span class="choice-ico">${icon('calc')}</span>
      <span class="choice-txt"><span class="ct">Berechnung</span><span class="small muted">Wie lange reicht es? Was muss ich noch kaufen?</span>
      <span class="small num choice-fact t-${status(c.reach/c.T)}">Reicht ${c.reach} von ${c.T} Tagen · ${c.p} ${c.p===1?'Person':'Personen'}</span></span></button>
    <button class="choice sos" data-act="go" data-v="wissen"><span class="choice-ico">${icon('sos')}</span>
      <span class="choice-txt"><span class="ct">Notfall-Wissen</span><span class="small muted">Was tun bei Stromausfall, Hochwasser, Brand und anderen Krisen</span>
      <span class="small choice-fact">Funktioniert auch ohne Internet</span></span></button>
  </div>
  <a class="whatsnew" href="versionen.html" data-act="seenVersion">${META.seenVersion!==APP_VERSION?`<span class="newdot">Neu: Version ${APP_VERSION}</span> `:''}Was kann die App alles? Unter <b>„Was ist neu?“</b> stehen alle Funktionen und Änderungen der Versionen. ›</a>`;
}

function viewVorrat(c){
  const nW=S.items.filter(i=>i.cat==='wasser').length, nF=S.items.filter(i=>i.cat==='nahrung').length;
  const warn=cat=>{ const n=S.items.filter(i=>i.cat===cat&&mhdState(i.mhd)!=='ok'&&mhdState(i.mhd)!=='none').length; return n?`<span class="small t-warn" style="font-weight:700">${n} mit MHD-Hinweis</span>`:`<span class="small muted">MHD in Ordnung</span>`; };
  const t=(k,name,val,extra)=>`<button class="tile" data-act="go" data-v="${k}"><div class="head">${icon(k)}<span class="name">${name}</span></div><span class="val num">${val}</span>${extra}</button>`;
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="home" aria-label="Zurück zur Startseite">${icon('back')}</button><h1 style="flex:1">Mein Vorrat</h1></div>
  ${expiryBand(c)}
  <button class="choice rot-entry" data-act="go" data-v="rotation"><span class="choice-ico">${icon('rotate')}</span>
    <span class="choice-txt"><span class="ct" style="font-size:1.35rem">Verbrauchsliste</span>
    <span class="small muted">Was bald abläuft: jetzt essen, neu kaufen, Datum aktualisieren</span>
    <span class="small num choice-fact ${rotItems().length?'t-warn':'t-ok'}">${rotItems().length?`${rotItems().length} ${rotItems().length===1?'Artikel':'Artikel'} in den nächsten 2 Monaten oder abgelaufen`:'Nichts läuft in den nächsten 2 Monaten ab'}</span></span></button>
  <p class="small muted" style="margin:0">Tippe auf eine Kategorie, um Artikel einzutragen oder Mengen zu ändern.</p>
  <div class="grid">
    ${t('wasser','Wasser',`${fmt(c.water)} l in ${nW} ${nW===1?'Eintrag':'Einträgen'}`,warn('wasser'))}
    ${t('nahrung','Nahrung',`${fmt(c.foodTotal)} kg in ${nF} ${nF===1?'Eintrag':'Einträgen'}`,warn('nahrung'))}
    ${activeChecks().map(([k,v])=>t(k,v.n,`${c.checks[k].have} von ${c.checks[k].need} Teilen`,bar(c.checks[k].ratio))).join('')}
  </div>
  <div class="row">${CAN_PRINT?`<button class="primary" data-act="printInv">${icon('print')} Vorrat drucken</button>`:''}<button class="secondary" data-act="go" data-v="calc">Zur Berechnung</button></div>
  ${CAN_PRINT?`<p class="hint" style="margin:0">Druckt den kompletten Vorrat mit Mengen, Haltbarkeit und Checklisten, auch als PDF. Tipp: ausgedruckt zum Vorrat legen, das funktioniert auch ohne Strom.</p>`:''}`;
}

function viewCalc(c){
  const T=c.T;
  const ringR=58, circ=2*Math.PI*ringR, prog=Math.min(c.reach/T,1);
  const verdict = c.reach>=T ? `<span class="t-ok"><b>Ziel erreicht</b></span> – nach BBK-Empfehlung reicht dein Vorrat für ${T} Tage.`
    : `Für dein Ziel fehlen noch ${T-c.reach} Tage. <b>Engpass: ${c.bottleneck}</b>.`;
  const tiles = [
    tile('wasser','Wasser', `${fmt(c.water)} von ${fmt(c.waterNeed)} l`, c.water/c.waterNeed, `reicht ${Math.floor(c.waterReach)} Tage`),
    tile('nahrung','Nahrung', `${fmt(c.foodTotal)} von ${fmt(c.foodNeed)} kg`, c.foodTotal/c.foodNeed, `reicht ${Math.floor(c.foodReach)} Tage`),
    ...activeChecks().map(([k,v])=>tile(k,v.n, `${c.checks[k].have} von ${c.checks[k].need} Teilen`, c.checks[k].ratio, c.checks[k].ratio>=1?'vollständig':'unvollständig')),
  ].join('');
  return `
  <div class="topbar"><button class="iconbtn" data-act="go" data-v="home" aria-label="Zurück zur Startseite">${icon('back')}</button><h1 style="flex:1">Berechnung</h1></div>
  ${expiryBand(c)}
  <section class="panel" aria-label="Haushalt und Ziel">
    <div class="label">Personen im Haushalt <span class="num" style="letter-spacing:0">(${c.p})</span></div>
    ${[['adults','Erwachsene und Kinder ab 10 Jahren',adults()],['kids4','Kinder 4–9 Jahre',kids4()],['kids1','Kleinkinder 1–3 Jahre',kids1()]].map(([k,n,v])=>`
    <div class="spread"><span>${n}</span>
      <div class="stepper"><button data-act="pers" data-k="${k}" data-d="-1" aria-label="${n}: eins weniger">−</button><span class="num">${v}</span><button data-act="pers" data-k="${k}" data-d="1" aria-label="${n}: eins mehr">+</button></div></div>`).join('')}
    <p class="hint" style="margin:0">Kinder essen weniger: 1–3 Jahre zählen etwa halb, 4–9 Jahre etwa 70 %. Ab 10 Jahren rechnet die App wie bei Erwachsenen. Wasser, Hygiene und Dokumente zählen für alle voll. Richtwerte nach DGE.${kids1()?' Für Kleinkinder gibt es eine eigene Kachel „Kleinkind“ mit Windeln und Kleinkindnahrung.':''} Säuglingsnahrung für Babys unter 1 Jahr bitte gesondert planen.</p>
    <label class="check petcheck"><input type="checkbox" id="pets-on" ${S.petsOn||petCount()?'checked':''}> <span><b>Haustiere im Haushalt</b>${petCount()?` <span class="num">(${petCount()})</span>`:''}<br><span class="hint">Haken setzen, um Hund, Katze oder Kleintier einzutragen.</span></span></label>
    ${S.petsOn||petCount()?`<div class="petbox">
      ${PETS.map(x=>`<div class="spread"><span>${x.n}</span><div class="stepper"><button data-act="pet" data-k="${x.k}" data-d="-1" aria-label="${x.n}: eins weniger">−</button><span class="num">${petN(x.k)}</span><button data-act="pet" data-k="${x.k}" data-d="1" aria-label="${x.n}: eins mehr">+</button></div></div>`).join('')}
      <p class="hint" style="margin:0">Haustiere bekommen eigenes Wasser (zählt beim Wasser mit) und eine eigene Kachel „Haustiere“ mit Futter, Streu und Zubehör. Pro Tag gerechnet: kleiner Hund 0,5 l und 150 g, mittlerer 1 l und 300 g, großer 2 l und 500 g, Katze 0,25 l und 60 g, Kleintier 0,1 l und 100 g. Das sind grobe Richtwerte, die Packung oder der Tierarzt wissen es genauer.</p></div>`:''}
    <div class="spread"><label class="label" for="days">Ziel: so lange ohne Einkaufen</label><span class="display num" style="font-size:1.6rem;white-space:nowrap" id="dl">${T} Tage</span></div>
    <input type="range" id="days" min="1" max="90" value="${T}" aria-describedby="dl">
    <div class="chips">${[3,10,30,90].map(d=>`<button class="chip" data-act="days" data-d="${d}" aria-pressed="${d===T}">${d} Tage${d===10?' (BBK)':''}</button>`).join('')}</div>
  </section>
  <div class="tabs" role="tablist">
    <button role="tab" aria-selected="${UI.tab==='reach'}" data-act="tab" data-v="reach">Reicht für</button>
    <button role="tab" aria-selected="${UI.tab==='buy'}" data-act="tab" data-v="buy">Noch kaufen</button>
  </div>
  ${UI.tab==='reach' ? `
  <section class="panel">
    <div class="hero">
      <div class="ring"><svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="${ringR}" fill="none" stroke="var(--track)" stroke-width="12"/>
        <circle cx="70" cy="70" r="${ringR}" fill="none" stroke="var(--${status(prog)==='ok'?'ok':status(prog)==='warn'?'warn':'bad'})" stroke-width="12" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-prog)}"/></svg>
        <div class="center"><div><div class="big num">${c.reach}</div><div class="small muted">${c.reach===1?'Tag':'Tage'}</div></div></div></div>
      <div><div class="label">Dein Vorrat reicht für</div><p class="verdict" style="margin:6px 0 0">${verdict}</p>
        <p class="small muted" style="margin:6px 0 0">Gezählt werden Wasser und Nahrung. Der kleinere Wert bestimmt die Tage.</p></div>
    </div>
  </section>
  <div class="grid">${tiles}</div>` : viewBuy(c)}`;
}

function tile(k,name,val,r,sub){
  return `<button class="tile" data-act="go" data-v="${k}"><div class="head">${icon(k)}<span class="name">${name}</span></div>
    <span class="val num">${val}</span>${bar(r)}<span class="small t-${status(r)}" style="font-weight:700">${sub}</span></button>`;
}

function gearChips(keys){
  if(!keys||!keys.length) return '';
  const all={}; Object.values(CHECK).forEach(v=>v.items.forEach(it=>all[it[0]]=it));
  return `<div class="gear"><span class="small muted">Aus deinem Vorrat:</span> ${keys.filter(k=>all[k]).map(k=>{ const ok=have(k)>0;
    return `<span class="gchip ${ok?'ok':'no'}">${ok?'✓':'✗'} ${esc(all[k][1].replace(/ \(.*\)$/,''))}</span>`; }).join('')}</div>`;
}
function wissenCard(w, forPrint){
  const steps=`<ol class="steps">${w.now.map(x=>`<li>${x}</li>`).join('')}</ol>`;
  const more=(w.more||[]).map(([h,list])=>`<div class="wmore"><div class="label">${h}</div><ul>${list.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('');
  if(forPrint) return `<section class="pw"><h3>${w.t}</h3>${steps}${more}</section>`;
  return `<details class="wcard" id="w-${w.id}" data-search="${esc((w.t+' '+(w.tags||'')+' '+w.now.join(' ')).toLowerCase().replace(/<[^>]+>/g,''))}">
    <summary><span>${w.t}</span><span class="chev" aria-hidden="true">›</span></summary>
    <div class="wbody"><div class="label">Sofort tun</div>${steps}${gearChips(w.gear)}${more}</div></details>`;
}
function notrufBar(){
  const g=S.land?giftFor(S.land):null;
  return `<section class="panel notruf"><div class="label">Notrufnummern</div>
    <div class="nlist">${NUMMERN.map(([n,name,sub])=>`<a class="nrow" href="tel:${n}"><span class="nnum num">${n==='08001110111'?'0800 111 0 111':n}</span><span><b>${name}</b>${sub?`<br><span class="small muted">${sub}</span>`:''}</span></a>`).join('')}
    ${g?`<a class="nrow" href="tel:${g.tel.replace(/\s/g,'')}"><span class="nnum num">${g.tel}</span><span><b>Giftnotruf ${g.ort}</b><br><span class="small muted">für ${g.lands.join(', ')}</span></span></a>`:''}</div>
    <div class="field"><label for="land">Dein Bundesland (für den Giftnotruf)</label>
      <select id="land"><option value="">– bitte wählen –</option>${LAENDER.map(l=>`<option ${l===S.land?'selected':''}>${l}</option>`).join('')}</select></div></section>`;
}
function viewWissen(){
  let body='';
  WISSEN.forEach(w=>{ body += w.sec ? `<h2 class="wsec">${w.sec}</h2>` : wissenCard(w); });
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="home" aria-label="Zurück zur Startseite">${icon('back')}</button><h1 style="flex:1">Notfall-Wissen</h1></div>
  <p class="small muted" style="margin:0">Kurze Anleitungen für Krisen in Deutschland, gespeichert auf deinem Gerät und auch ohne Internet lesbar. Im Ernstfall gelten immer zuerst die Anweisungen von Behörden, Feuerwehr und Polizei.</p>
  ${notrufBar()}
  <div class="field"><label for="wsearch" class="label">Suchen</label><input id="wsearch" type="search" placeholder="z. B. Strom, Wasser, Sirene, Brand" autocomplete="off"></div>
  <div id="wlist">${body}</div>
  <p class="small muted" id="wnone" hidden>Nichts gefunden. Versuche ein anderes Wort.</p>
  <div class="row">${CAN_PRINT?`<button class="primary" data-act="printWissen">${icon('print')} Notfall-Wissen drucken</button>`:''}</div>
  <p class="hint" style="margin:0">Eigene Zusammenfassung nach Empfehlungen von Bundesamt für Bevölkerungsschutz (BBK), Bundesinstitut für Risikobewertung (Giftnotrufe), Verbraucherzentrale (Jodtabletten), Polizei und Deutschem Wetterdienst. Ersetzt keinen Erste-Hilfe-Kurs. Stand: Oktober 2026.</p>`;
}
function printWissen(){
  const g=S.land?giftFor(S.land):null;
  document.getElementById('printout').innerHTML=`<h1>Notfall-Wissen</h1>
    <div class="meta">Vorratsplaner ${APP_VERSION} · Stand Oktober 2026 · Im Ernstfall gelten zuerst die Anweisungen der Behörden.</div>
    <div class="sum" style="grid-template-columns:repeat(3,1fr)">${NUMMERN.slice(0,3).map(([n,name])=>`<div>${name}<b>${n}</b></div>`).join('')}</div>
    <p class="meta">${g?`<b>Giftnotruf ${g.ort}: ${g.tel}</b> · `:''}Telefonseelsorge: 0800 111 0 111 · Notfall-Infopunkt in meiner Nähe: ______________________________</p>
    ${WISSEN.map(w=>w.sec?`<h2>${w.sec}</h2>`:wissenCard(w,true)).join('')}
    <p class="meta" style="margin-top:12pt">Eigene Zusammenfassung nach Empfehlungen von BBK, BfR, Verbraucherzentrale, Polizei und DWD. Ersetzt keinen Erste-Hilfe-Kurs.</p>`;
  document.body.classList.add('pinv');
  const done=()=>{ document.body.classList.remove('pinv'); window.removeEventListener('afterprint',done); };
  window.addEventListener('afterprint',done);
  setTimeout(()=>window.print(),50);
}

function printInventory(){
  const c=calc(), d=new Date();
  const mhdCell=it=>{ const st=mhdState(it.mhd); return `<td class="n${st==='expired'||st==='soon'?' exp':''}">${it.mhd?mhdText(it.mhd):'–'}${st==='expired'?' (abgelaufen)':st==='soon'?' (bald)':''}</td>`; };
  const tot=it=>{ const b=amount(it), u=(it.unit==='g'||it.unit==='kg'?'kg':'l'); return fmt(b, b<10?2:1)+' '+u+(factor(it)>1?` <span class="meta">(${it.group==='milch'||it.group==='fleisch'?'Pulver':'getrocknet'} ×${fmt(factor(it))})</span>`:''); };
  const table=items=>items.length?`<table class="t6"><thead><tr><th></th><th>Artikel</th><th class="n">Je Stück</th><th class="n">Anzahl</th><th class="n">Gesamt</th><th class="n">MHD</th></tr></thead><tbody>
    ${items.map(it=>`<tr><td><span class="box"></span></td><td>${esc(it.name)}</td><td class="n">${sizeText(it)}</td><td class="n">${it.count}</td><td class="n">${tot(it)}</td>${mhdCell(it)}</tr>`).join('')}</tbody></table>`
    :'<p class="meta">Keine Einträge.</p>';
  const water=S.items.filter(i=>i.cat==='wasser');
  const food=FOOD.map(g=>{ const items=S.items.filter(i=>i.cat==='nahrung'&&i.group===g.k); const need=g.d*c.eat*c.T;
    return `<h3>${g.n} <span class="meta">– vorhanden ${fmt(c.food[g.k],2)} kg von ${fmt(need,2)} kg</span></h3>${table(items)}`; }).join('');
  const checks=activeChecks().map(([k,v])=>`<section><h3>${v.n} <span class="meta">– ${c.checks[k].have} von ${c.checks[k].need}</span></h3>
    <table class="t4"><thead><tr><th></th><th>Gegenstand</th><th class="n">Soll</th><th class="n">Vorhanden</th></tr></thead><tbody>
    ${v.items.map(it=>{ const [key,name]=it, need=needOf(it,c.p,c.T);
      let hv; if(DERIVED[key]){ const st=docStatus(DERIVED[key]); hv=`${st.done} von ${st.total} Dokumenten`; }
      else if(key==='bargeld') hv=`${fmt(S.cash?.have||0,0)} € von ${fmt(cashTarget(),0)} €`; else hv=String(S.checks[key]||0);
      return `<tr><td><span class="box"></span></td><td>${name}</td><td class="n">${DERIVED[key]||key==='bargeld'?'':need}</td><td class="n">${hv}</td></tr>`; }).join('')}</tbody></table></section>`).join('');
  const docs=['orig','copy'].map(kind=>{ const st=docStatus(kind); return st.open.length?`<p class="meta"><b>${DOCS[kind].n} – noch offen:</b> ${esc(st.open.join(', '))}</p>`:''; }).join('');
  const L=buyLines(c); const buyN=L.water.length+L.food.length+L.checks.reduce((a,[,r])=>a+r.length,0);
  document.getElementById('printout').innerHTML=`
    <h1>Notvorrat – Bestandsliste</h1>
    <div class="meta">Stand ${d.toLocaleDateString('de-DE')} · ${c.p} ${c.p===1?'Person':'Personen'}${kids4()||kids1()?` (davon ${[kids4()?kids4()+' Kind'+(kids4()>1?'er':'')+' 4–9':'',kids1()?kids1()+' Kleinkind'+(kids1()>1?'er':''):''].filter(Boolean).join(', ')})`:''}${petCount()?` · ${petCount()} ${petCount()===1?'Haustier':'Haustiere'}`:''} · Ziel ${c.T} Tage · Vorratsplaner ${APP_VERSION}</div>
    <div class="sum"><div>Reicht für<b>${c.reach} ${c.reach===1?'Tag':'Tage'}</b></div><div>Wasser<b>${fmt(c.water)} / ${fmt(c.waterNeed)} l</b></div>
      <div>Nahrung<b>${fmt(c.foodTotal)} / ${fmt(c.foodNeed)} kg</b></div><div>Noch kaufen<b>${buyN} Posten</b></div></div>
    ${c.expired.length||c.soon.length?`<p class="exp">Abgelaufen: ${c.expired.map(i=>esc(i.name)).join(', ')||'–'} · Läuft bald ab: ${c.soon.map(i=>esc(i.name)).join(', ')||'–'}</p>`:''}
    <section><h2>Wasser</h2>${table(water)}</section>
    <h2>Nahrung</h2>${food}
    <h2>Ausrüstung und Dokumente</h2>${checks}${docs}
    <p class="meta" style="margin-top:12pt">Richtwerte nach BBK: 2 Liter Getränke und ca. 2.200 kcal pro Person und Tag. Abgelaufene Artikel sind in den Summen nicht enthalten. Kästchen zum Abhaken bei der Kontrolle.</p>`;
  document.body.classList.add('pinv');
  const done=()=>{ document.body.classList.remove('pinv'); window.removeEventListener('afterprint',done); };
  window.addEventListener('afterprint',done);
  setTimeout(()=>window.print(),50);
}

function rotItems(){
  return S.items.filter(i=>{ const st=mhdState(i.mhd); return st==='expired'||st==='soon'; })
    .sort((a,b)=>mhdIdx(a.mhd)-mhdIdx(b.mhd));
}
function viewRotation(c){
  const items=rotItems();
  const years=[]; for(let y=NOW.getFullYear();y<=NOW.getFullYear()+10;y++) years.push(y);
  const back=UI.back||'vorrat';
  const row=it=>{ const st=mhdState(it.mhd), left=mhdIdx(it.mhd)-CUR;
    const when = st==='expired' ? `<span class="pill expired">abgelaufen ${mhdText(it.mhd)}</span>` : `<span class="pill soon">${left===0?'läuft diesen Monat ab':`noch ${left} ${left===1?'Monat':'Monate'}`} · ${mhdText(it.mhd)}</span>`;
    const cat = it.cat==='wasser'?'Wasser':(FOOD.find(g=>g.k===it.group)||{}).n||'';
    const editing = UI.rotEdit===it.id;
    return `<div class="rot">
      <div><div style="font-weight:700">${esc(it.name)}</div><div class="meta" style="margin-top:3px">${when}<span class="num">${it.count} × ${sizeText(it)}</span>${it.demo?'<span class="pill demo">Beispiel</span>':''}</div>
        <div class="small muted" style="margin-top:2px">${esc(cat)}</div></div>
      ${editing?`<div class="rot-form"><span class="small" style="font-weight:700">Neues Haltbarkeitsdatum</span>
          <div class="two"><select id="rot-m" aria-label="Monat">${MONTHS.map((m,i)=>`<option value="${i+1}" ${i===NOW.getMonth()?'selected':''}>${m}</option>`).join('')}</select>
          <select id="rot-y" aria-label="Jahr">${years.map(y=>`<option ${y===NOW.getFullYear()+1?'selected':''}>${y}</option>`).join('')}</select></div>
          <div class="row"><button class="primary small" data-act="rotSave" data-id="${it.id}">Speichern</button><button class="secondary small" data-act="rotCancel">Abbrechen</button></div></div>`
      :`<div class="row"><button class="primary small" data-act="rotEdit" data-id="${it.id}">Ersetzt – neues Datum</button><button class="secondary small" data-act="rotUsed" data-id="${it.id}">Aufgebraucht</button></div>`}
    </div>`; };
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="${back}" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">Verbrauchsliste</h1></div>
  <section class="panel"><p style="margin:0">So bleibt dein Vorrat frisch: Iss diese Artikel im Alltag auf und kauf sie neu. Trag danach das neue Haltbarkeitsdatum ein.</p>
    <p class="small muted" style="margin:0">„Aufgebraucht“ entfernt den Artikel. Er erscheint dann in der Einkaufsliste.</p></section>
  ${UI.msg?`<div class="small t-ok" role="status" style="font-weight:700">${UI.msg}</div>`:''}
  <section class="panel">${items.length?`<div class="rotlist">${items.map(row).join('')}</div>`
    :`<p class="done" style="margin:0">Nichts zu tun. In den nächsten 2 Monaten läuft nichts ab.</p>`}</section>`;
}

function expiryBand(c){
  if(!c.expired.length && !c.soon.length) return '';
  const parts=[];
  if(c.expired.length) parts.push(`<b>${c.expired.length} ${c.expired.length===1?'Artikel ist':'Artikel sind'} abgelaufen</b> und ${c.expired.length===1?'zählt':'zählen'} nicht mehr zum Vorrat: ${c.expired.map(i=>esc(i.name)).join(', ')}.`);
  if(c.soon.length) parts.push(`<b>${c.soon.length} ${c.soon.length===1?'Artikel läuft':'Artikel laufen'} bald ab.</b> Jetzt verbrauchen und neu kaufen: ${c.soon.map(i=>esc(i.name)).join(', ')}.`);
  return `<div class="band warn"><div style="display:flex;flex-direction:column;gap:6px">${parts.map(p=>`<div class="small">${p}</div>`).join('')}
    ${UI.view!=='rotation'?`<button class="secondary small" style="align-self:flex-start" data-act="go" data-v="rotation">Zur Verbrauchsliste</button>`:''}</div></div>`;
}

function buyLines(c){
  const out=[]; const T=c.T;
  const wMiss=c.waterNeed-c.water;
  const water = wMiss>0.05 ? [[`Wasser`, `${fmt(Math.ceil(wMiss*2)/2)} l`, `ca. ${Math.ceil(wMiss/9)} ${Math.ceil(wMiss/9)===1?'Kiste':'Kisten'} mit 6 × 1,5 l`]] : [];
  const food = FOOD.map(g=>{ const miss=g.d*c.eat*T-c.food[g.k]; return miss>0.01?[g.n, `${fmt(miss, miss<1?2:1)} kg`, `z. B. ${g.ex}`]:null; }).filter(Boolean);
  const checks = [];
  for(const [k,v] of activeChecks()){
    const rows=v.items.map(it=>{ const [key,name]=it;
      if(DERIVED[key]){ const st=docStatus(DERIVED[key]); return st.open.length?[name,`${st.open.length} offen`,st.open.join(', ')]:null; }
      if(key==='bargeld'){ const m=cashTarget()-(S.cash?.have||0); return m>0?[name,`${fmt(m,0)} €`,'kleine Scheine und Münzen']:null; }
      const miss=needOf(it,c.p,T)-(S.checks[key]||0); return miss>0?[name,`${miss} ×`]:null; }).filter(Boolean);
    if(rows.length) checks.push([v.n,rows]);
  }
  return {water,food,checks};
}
function viewBuy(c){
  const L=buyLines(c);
  const sec=(title,rows)=>`<div class="shop"><h2 style="font-size:1.15rem;margin-bottom:4px">${title}</h2>${rows.length?rows.map(r=>`<div class="line"><span>${esc(r[0])}${r[2]?`<br><span class="small muted">${r[2]}</span>`:''}</span><span class="num">${r[1]}</span></div>`).join(''):`<div class="done">Vollständig</div>`}</div>`;
  const empty=!L.water.length&&!L.food.length&&!L.checks.length;
  return `<section class="panel print-area">
    <div class="spread"><div><h2 class="print-only">Einkaufsliste Notvorrat</h2><div class="label">Einkaufsliste für ${c.T} Tage, ${c.p} ${c.p===1?'Person':'Personen'}</div></div></div>
    ${empty?'':`<div class="row no-print">${CAN_PRINT?`<button class="primary small" data-act="print">Drucken oder als PDF speichern</button>`:''}<button class="secondary small" data-act="copyList">Liste kopieren</button></div>
    ${CAN_PRINT?'':`<p class="hint no-print" style="margin:0">Drucken und PDF gibt es in der installierten App. In dieser Vorschau kannst du die Liste kopieren.</p>`}`}
    ${UI.msg?`<div class="small t-ok" role="status" style="font-weight:700">${UI.msg}</div>`:''}
    ${empty?`<p class="done">Alles da. Dein Vorrat erfüllt das Ziel.</p>`:
      sec('Wasser',L.water)+sec('Nahrung',L.food)+L.checks.map(([n,r])=>sec(n,r)).join('')}
    <p class="small muted" style="margin:0">Abgelaufene Artikel sind schon herausgerechnet. Richtwerte nach BBK.</p>
  </section>`;
}
function listText(c){
  const L=buyLines(c); const lines=[`Einkaufsliste Vorrat – ${c.T} Tage, ${c.p} ${c.p===1?'Person':'Personen'}`];
  if(L.water.length) lines.push('', 'WASSER', ...L.water.map(r=>`- ${r[0]}: ${r[1]} (${r[2]})`));
  if(L.food.length) lines.push('', 'NAHRUNG (lange haltbar: Dose, Glas, getrocknet)', ...L.food.map(r=>`- ${r[0]}: ${r[1]} (${r[2]})`));
  L.checks.forEach(([n,rows])=>lines.push('', n.toUpperCase(), ...rows.map(r=>`- ${r[0]}: ${r[1]}${r[2]?` (${r[2]})`:''}`)));
  return lines.join('\n');
}

function itemRow(it){
  const st=mhdState(it.mhd);
  const pill = st==='expired'?`<span class="pill expired">abgelaufen ${mhdText(it.mhd)}</span>`: st==='soon'?`<span class="pill soon">bald ab: ${mhdText(it.mhd)}</span>`:`<span class="pill">MHD ${mhdText(it.mhd)}</span>`;
  return `<div class="item"><div style="min-width:0"><div style="font-weight:700">${esc(it.name)}</div>
      <div class="meta"><span class="num">${sizeText(it)} je Stück</span>${factor(it)>1?`<span class="pill">${it.group==='milch'||it.group==='fleisch'?'Pulver':'getrocknet'}, zählt ×${fmt(factor(it))}</span>`:''}${pill}${it.demo?'<span class="pill demo">Beispiel</span>':''}</div></div>
    <div class="actions"><div class="stepper"><button data-act="count" data-id="${it.id}" data-d="-1" aria-label="Eins weniger">−</button><span class="num">${it.count}</span><button data-act="count" data-id="${it.id}" data-d="1" aria-label="Eins mehr">+</button></div>
      <button class="del" data-act="del" data-id="${it.id}" aria-label="${esc(it.name)} löschen">${icon('trash')}</button></div></div>`;
}

function viewStock(c){
  const isW=UI.view==='wasser';
  const head=`<div class="topbar"><button class="iconbtn" data-act="go" data-v="${UI.back}" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">${isW?'Wasser':'Nahrung'}</h1></div>`;
  if(isW){
    const items=S.items.filter(i=>i.cat==='wasser');
    return `${head}<section class="panel"><div class="spread"><span class="label">Bestand</span><span class="num"><b>${fmt(c.water)}</b> von ${fmt(c.waterNeed)} l</span></div>${bar(c.water/c.waterNeed)}
      <p class="small muted" style="margin:0">BBK: 2 Liter pro Person und Tag zum Trinken und Kochen.${petCount()?` Darin enthalten: ${fmt(c.petWaterNeed)} l für deine Haustiere.`:''}</p></section>
      <section class="panel"><div class="list">${items.length?items.map(itemRow).join(''):'<p class="muted">Noch kein Wasser eingetragen. Füge zum Beispiel eine Kiste Mineralwasser hinzu.</p>'}</div>
      <button class="primary" data-act="add" data-cat="wasser">Wasser hinzufügen</button></section>`;
  }
  const groups=FOOD.map(g=>{
    const items=S.items.filter(i=>i.cat==='nahrung'&&i.group===g.k);
    const need=g.d*c.eat*c.T, have=c.food[g.k];
    return `<section class="panel"><div class="spread"><div style="min-width:0"><h2 style="font-size:1.15rem">${g.n}</h2>${g.how?`<div class="small" style="font-weight:700;color:var(--olive)">${g.how}</div>`:''}</div><span class="num small"><b>${fmt(have,2)}</b> / ${fmt(need,2)} kg</span></div>${bar(need?have/need:1)}
      <div class="hint">Gut geeignet: ${g.ex}</div>
      <div class="list">${items.map(itemRow).join('')||'<p class="small muted" style="margin:0">Noch nichts eingetragen.</p>'}</div>
      <button class="secondary" data-act="add" data-cat="nahrung" data-group="${g.k}">Hinzufügen</button></section>`;
  }).join('');
  return `${head}<section class="panel"><div class="spread"><span class="label">Gesamt</span><span class="num"><b>${fmt(c.foodTotal)}</b> von ${fmt(c.foodNeed)} kg</span></div>${bar(c.foodTotal/c.foodNeed)}
    <p class="small muted" style="margin:0">Mengen nach der BBK-Beispielliste. Gemeint sind lange haltbare Lebensmittel, also Konserven, Gläser und Trockenware, kein Frischgemüse. Ein Mischgericht wie Ravioli trägst du bei seiner Hauptzutat ein.</p></section>${groups}`;
}

function subRow(key,name){
  const ok=have(key)>=1; let sub, view;
  if(DERIVED[key]){ const st=docStatus(DERIVED[key]); sub=`${st.done} von ${st.total} Dokumenten`; view=DOCS[DERIVED[key]].view; }
  else { sub=`${fmt(S.cash?.have||0,0)} € von ${fmt(cashTarget(),0)} €`; view='cash'; }
  return `<button class="item subitem" data-act="go" data-v="${view}"><div style="min-width:0"><div style="font-weight:700">${name}</div>
    <div class="meta"><span class="num">${sub}</span>${ok?'<span class="pill" style="border-color:var(--ok);color:var(--ok)">vollständig</span>':''}</div></div>
    <span class="open">Öffnen ›</span></button>`;
}

function viewDocs(kind){
  const d=DOCS[kind], st=docStatus(kind);
  const row=(sc,[k,n])=>{ const key=`${kind}|${sc}|${k}`, v=(S.docs||{})[key];
    return `<div class="item"><div style="min-width:0;font-weight:700">${n}</div><div class="actions">
      <button class="tick" data-act="doc" data-k="${key}" data-val="1" aria-pressed="${v===1}">${v===1?'✓ Vorhanden':'Vorhanden'}</button>
      <button class="na" data-act="doc" data-k="${key}" data-val="na" aria-pressed="${v==='na'}">Entfällt</button></div></div>`; };
  const section=(sc,title,extra)=>{ const items=d.items.filter(i=>(i[2]==='h')===(sc==='h'));
    const done=items.filter(i=>(S.docs||{})[`${kind}|${sc}|${i[0]}`]).length;
    return `<section class="panel"><div class="spread">${extra||`<h2 style="font-size:1.15rem">${title}</h2>`}<span class="num small"><b>${done}</b> von ${items.length}</span></div>${bar(done/items.length)}
      <div class="list">${items.map(i=>row(sc,i)).join('')}</div></section>`; };
  const persons=[...Array(S.persons).keys()].map(i=>section('p'+i,'',`<div class="field" style="flex:1;max-width:240px"><label for="name-${i}" class="label">Person ${i+1}</label><input id="name-${i}" data-name="${i}" value="${esc((S.names||[])[i]||'')}" placeholder="Name (optional)"></div>`)).join('');
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="doku" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">${d.n}</h1></div>
    <section class="panel"><div class="spread"><span class="label">${d.sub}</span><span class="num"><b>${st.done}</b> von ${st.total}</span></div>${bar(st.total?st.done/st.total:1)}
    <p class="small muted" style="margin:0">Hake ab, was in der Mappe liegt. „Entfällt“ für Dokumente, die es bei euch nicht gibt, z. B. Führerschein bei Kindern. Erst wenn alles erledigt ist, zählt die Mappe als vorhanden.</p></section>
    ${persons}${section('h','Für den ganzen Haushalt')}`;
}

function viewCash(){
  const t=cashTarget(), h=S.cash?.have||0, sug=S.persons*CASH_PER_PERSON;
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="doku" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">Bargeld</h1></div>
  <section class="panel"><div class="spread"><span class="label">Vorhanden</span><span class="num"><b>${fmt(h,0)} €</b> von ${fmt(t,0)} €</span></div>${bar(t?h/t:1)}
    <p style="margin:0">Bei Stromausfall funktionieren Kartenzahlung und Geldautomaten oft nicht. Halte deshalb Bargeld bereit: kleine Scheine (5, 10, 20 €) und Münzen, weil Händler im Notfall kaum wechseln können.</p>
    <p class="small muted" style="margin:0">Das BBK empfiehlt Bargeld, nennt aber keinen Betrag. Behörden in Österreich und den Niederlanden raten zu etwa 70 bis 100 € pro Person für die ersten 3 Tage. Dein Lebensmittelvorrat deckt den Rest. Unser Vorschlag: ${CASH_PER_PERSON} € pro Person, für ${S.persons} ${S.persons===1?'Person':'Personen'} also <b>${fmt(sug,0)} €</b>.</p></section>
  <section class="panel">
    <div class="field"><label for="cash-have">Wie viel Bargeld hast du zurückgelegt? (€)</label><input id="cash-have" inputmode="numeric" data-cash="have" value="${h||''}" placeholder="0"></div>
    <div class="field"><label for="cash-target">Dein Ziel (€)</label><input id="cash-target" inputmode="numeric" data-cash="target" value="${S.cash?.target||''}" placeholder="${fmt(sug,0)} (Vorschlag)">
      <span class="hint">Leer lassen, um den Vorschlag zu verwenden. Er passt sich an die Zahl der Personen an.</span></div>
  </section>`;
}

function viewCheck(c){
  const k=UI.view, v=CHECK[k];
  const rows=v.items.map(it=>{ const [key,name]=it;
    if(DERIVED[key]||key==='bargeld') return subRow(key,name);
    const need=needOf(it,c.p,c.T), have=S.checks[key]||0, nt=needText(it);
    return `<div class="item"><div style="min-width:0"><div style="font-weight:700">${name}</div>
      <div class="meta"><span class="num">Soll: ${need}${nt?` (${nt})`:''}</span>${have>=need?'<span class="pill" style="border-color:var(--ok);color:var(--ok)">vorhanden</span>':''}</div></div>
      <div class="stepper"><button data-act="check" data-k="${key}" data-d="-1" aria-label="Eins weniger">−</button><span class="num">${have}</span><button data-act="check" data-k="${key}" data-d="1" aria-label="Eins mehr">+</button></div></div>`; }).join('');
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="${UI.back}" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">${v.n}</h1></div>
    <section class="panel"><div class="spread"><span class="label">Vollständigkeit</span><span class="num"><b>${c.checks[k].have}</b> von ${c.checks[k].need}</span></div>${bar(c.checks[k].ratio)}
    <p class="small muted" style="margin:0">${k==='tiere'?`Für ${petCount()} ${petCount()===1?'Tier':'Tiere'} und ${c.T} Tage. Futter und Streu richten sich nach den Tagen, Wasser für die Tiere zählt beim Wasser mit. Richtwerte, passe sie an dein Tier an.`:k==='klein'?`Für ${kids1()} ${kids1()===1?'Kleinkind':'Kleinkinder'} und ${c.T} Tage. Windeln, Feuchttücher und Gläschen richten sich nach den Tagen. Die Mengen sind Richtwerte, passe sie an dein Kind an.`:'Diese Dinge brauchst du unabhängig von der Anzahl der Tage.'}</p></section>
    <section class="panel"><div class="list">${rows}</div></section>`;
}

function askCal(){ if(!META.cal || META.cal==='later'){ META.cal='ask'; DB.put(META,'meta'); } }
function backupBand(){
  const d=daysSince(META.lastBackup);
  const why = d===null ? 'Du hast noch keine Sicherung gemacht.' : `Letzte Sicherung vor ${d} ${d===1?'Tag':'Tagen'}, seitdem ${META.changes||0} Änderungen.`;
  return `<div class="band info backup"><div style="display:flex;flex-direction:column;gap:8px">
    <div><b>Vorrat sichern</b><div class="small">${why} Wenn Browserdaten gelöscht werden oder du das Handy wechselst, ist sonst alles weg.</div></div>
    <div class="row">${canShareFile()?`<button class="primary small" data-act="backup" data-mode="share">Sichern (Drive, Mail …)</button>`:''}
      <button class="${canShareFile()?'secondary':'primary'} small" data-act="backup" data-mode="file">Als Datei speichern</button>
      <button class="linkbtn small" data-act="snooze">Morgen erinnern</button></div></div></div>`;
}

function viewSettings(){
  return `<div class="topbar"><button class="iconbtn" data-act="go" data-v="home" aria-label="Zurück">${icon('back')}</button><h1 style="flex:1">Einstellungen</h1></div>
  <section class="panel"><h2>Erinnerung im Kalender</h2>
    <p class="small muted" style="margin:0">Serientermin „Vorratscheck“ in deinem Kalender. ${META.cal==='done'?`<b>Eingerichtet (${(CAL_FREQ[META.calFreq]||CAL_FREQ.monthly).n}).</b> Ändern oder löschen kannst du ihn im Kalender.`:'Noch nicht eingerichtet.'}</p>
    ${calChooser('settings')}
  </section>
  <section class="panel"><h2>Sicherung</h2>
    <p class="small muted" style="margin:0">Dein Vorrat liegt nur auf diesem Gerät. Sichere ihn regelmäßig als Datei, am besten in Google Drive oder per Mail an dich selbst. ${META.lastBackup?`Letzte Sicherung: ${new Date(META.lastBackup).toLocaleDateString('de-DE')}.`:'<b>Noch keine Sicherung.</b>'}</p>
    <div class="row">${canShareFile()?`<button class="primary" data-act="backup" data-mode="share">Sichern (Drive, Mail …)</button>`:''}
      <button class="${canShareFile()?'secondary':'primary'}" data-act="backup" data-mode="file">Als Datei speichern</button></div>
    ${UI.msg?`<div class="small t-ok" role="status" style="font-weight:700">${UI.msg}</div>`:''}
    <p class="hint" style="margin:0">Die App erinnert dich nach ${BACKUP_DAYS} Tagen oder ${BACKUP_CHANGES} Änderungen an eine neue Sicherung.</p>
  </section>
  <section class="panel"><h2>Wiederherstellen</h2>
    ${UI.pending?`<div class="band warn"><div style="display:flex;flex-direction:column;gap:8px"><div><b>${esc(UI.pending.label)}</b><div class="small">${esc(summary(UI.pending.data))}. Dein aktueller Stand wird dabei ersetzt. Er bleibt als Zwischenstand „vorher“ erhalten.</div></div>
      <div class="row"><button class="danger small" data-act="restoreYes">Wiederherstellen</button><button class="secondary small" data-act="restoreNo">Abbrechen</button></div></div></div>`:''}
    <label class="secondary filebtn" for="restore-file">Sicherungsdatei auswählen</label>
    <input type="file" id="restore-file" accept=".json,application/json" hidden>
    ${UI.impErr?`<div class="err">${UI.impErr}</div>`:''}
    <div><div class="label" style="margin-bottom:4px">Automatische Zwischenstände</div>
      <p class="hint" style="margin:0 0 6px">Die App merkt sich den Stand der letzten 7 Tage, z. B. falls du aus Versehen etwas löschst. Sie liegen auf diesem Gerät und ersetzen keine Sicherungsdatei.</p>
      ${SNAPS.length?`<div class="list">${SNAPS.map((x,i)=>`<div class="item"><div style="min-width:0"><div style="font-weight:700">${new Date(x.at).toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})} Uhr${x.day.endsWith('-vorher')?' (vor Wiederherstellung)':''}</div><div class="small muted">${esc(summary(x.data))}</div></div>
        <button class="secondary small" data-act="snapPick" data-i="${i}">Laden</button></div>`).join('')}</div>`:'<p class="small muted" style="margin:0">Noch keine Zwischenstände.</p>'}
    </div>
    <details><summary class="small">Als Text kopieren oder einfügen</summary>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
      <textarea id="exp" aria-label="Sicherung als Text" readonly>${esc(backupData())}</textarea><button class="secondary small" data-act="copyExport">Text kopieren</button>
      <textarea id="imp" aria-label="Gesicherten Text einfügen" placeholder="Gesicherten Text hier einfügen"></textarea><button class="secondary small" data-act="import">Text einspielen</button></div>
    </details>
  </section>
  <section class="panel"><h2>Neu anfangen</h2>
    ${UI.confirmReset?`<p style="margin:0"><b>Wirklich alle Artikel löschen?</b> Das lässt sich nicht rückgängig machen.</p><div class="row"><button class="danger" data-act="resetYes">Ja, alles löschen</button><button class="secondary" data-act="resetNo">Abbrechen</button></div>`
      :`<div class="row"><button class="secondary" data-act="reset">Alle Artikel löschen</button><button class="secondary" data-act="loadDemo">Beispieldaten laden</button></div>`}
  </section>`;
}

function dryHint(g){ return `Zählt ${fmt(g.form.f)}-fach, weil es zubereitet mehr wiegt.${g.k==='gemuese'||g.k==='milch'||g.k==='fleisch'?' Braucht zusätzlich Wasser zum Zubereiten.':''}`; }
function viewSheet(){
  const f=UI.sheet; const isW=f.cat==='wasser';
  const years=[]; for(let y=NOW.getFullYear()-1;y<=NOW.getFullYear()+10;y++) years.push(y);
  const units=isW?['l','ml']:['g','kg','ml','l'];
  return `<div class="overlay" data-act="closeBg"><form class="sheet" id="itemForm" role="dialog" aria-modal="true" aria-labelledby="sh">
    <h2 id="sh">${isW?'Wasser hinzufügen':'Lebensmittel hinzufügen'}</h2>
    <div class="field"><label for="f-name">Was ist es?</label><input id="f-name" value="${esc(f.name||'')}" placeholder="${isW?'z. B. Mineralwasser 1,5 l':'z. B. Ravioli Dose'}" autocomplete="off"></div>
    ${isW?'':(()=>{ const g=FOOD.find(x=>x.k===f.group)||FOOD[0]; return `<div class="field"><label for="f-group">Gruppe</label><select id="f-group">${FOOD.map(x=>`<option value="${x.k}" ${x.k===g.k?'selected':''}>${x.n}</option>`).join('')}</select>
      <span class="hint" id="f-ex">Lange haltbar, z. B. ${g.ex}. Mischgerichte zählst du bei der Hauptzutat.</span></div>
      <label class="check" id="f-dry-wrap" ${g.form?'':'hidden'}><input type="checkbox" id="f-dry" ${f.dry?'checked':''}> <span><b id="f-dry-label">${g.form?g.form.label:''}</b><br><span class="hint" id="f-dry-hint">${g.form?dryHint(g):''}</span></span></label>`; })()}
    <div class="two"><div class="field"><label for="f-size">Menge pro Stück</label><input id="f-size" inputmode="decimal" value="${f.size??(isW?'1,5':'')}" placeholder="${isW?'1,5':'400'}"></div>
      <div class="field"><label for="f-unit">Einheit</label><select id="f-unit">${units.map(u=>`<option ${u===(f.unit||(isW?'l':'g'))?'selected':''}>${u}</option>`).join('')}</select></div></div>
    <div class="field"><label for="f-count">Anzahl</label><input id="f-count" inputmode="numeric" value="${f.count??(isW?'6':'1')}"></div>
    <div class="field"><span style="font-weight:700;font-size:.9rem">Mindestens haltbar bis</span><div class="two">
      <select id="f-month" aria-label="Monat"><option value="">Monat</option>${MONTHS.map((m,i)=>`<option value="${i+1}" ${String(i+1)===String(f.m)?'selected':''}>${m}</option>`).join('')}</select>
      <select id="f-year" aria-label="Jahr"><option value="">Jahr</option>${years.map(y=>`<option ${String(y)===String(f.y)?'selected':''}>${y}</option>`).join('')}</select></div>
      <span class="hint">Steht auf der Packung. Du bekommst einen Hinweis, bevor es abläuft.</span></div>
    ${f.err?`<div class="err" role="alert">${f.err}</div>`:''}
    ${f.short?`<div class="band warn" role="alert"><div class="small"><b>${f.short==='expired'?'Dieses Datum liegt in der Vergangenheit.':'Kurz haltbar: läuft in weniger als 3 Monaten ab.'}</b> ${f.short==='expired'?'Abgelaufene Artikel zählen nicht zum Vorrat.':'Für den Notvorrat eignen sich Lebensmittel, die mindestens ein halbes Jahr halten, z. B. Konserven oder Trockenware.'} Du kannst trotzdem speichern.</div></div>`:''}
    <div class="row"><button type="submit" class="primary">${f.short?'Trotzdem speichern':'Speichern'}</button><button type="button" class="secondary" data-act="closeSheet">Abbrechen</button></div>
  </form></div>`;
}

/* ---------- Aktionen ---------- */
function setDays(d){ S.days=Math.max(1,Math.min(90,d)); save(); }
root.addEventListener('click', async e=>{
  const b=e.target.closest('[data-act]'); if(!b) return;
  const a=b.dataset.act;
  if(a==='closeBg' && e.target!==b) return;
  if(a!=='copyList'&&a!=='copyExport') UI.msg='';
  switch(a){
    case 'print': window.print(); return;
    case 'printInv': printInventory(); return;
    case 'printWissen': printWissen(); return;
    case 'go': if(UI.view==='vorrat'||UI.view==='calc'||(b.dataset.v==='rotation'&&UI.view==='home')) UI.back=UI.view; UI.rotEdit=null; UI.pending=null; UI.view=b.dataset.v; UI.confirmReset=false; UI.impErr=''; window.scrollTo(0,0); break;
    case 'tab': UI.tab=b.dataset.v; break;
    case 'days': setDays(+b.dataset.d); break;
    case 'pet': { S.pets=S.pets||{}; const k=b.dataset.k; S.pets[k]=Math.max(0,Math.min(20,petN(k)+ +b.dataset.d)); save(); break; }
    case 'pers': { const k=b.dataset.k, d=+b.dataset.d;
      if(k==='adults'){ if(adults()+d>=1 && S.persons+d<=20) S.persons+=d; }
      else { const cur=S[k]||0; if(cur+d>=0 && S.persons+d<=20 && (d>0 || cur>0)){ S[k]=cur+d; S.persons+=d; } }
      save(); break; }
    case 'startOwn': S=emptyState(); save(); askCal(); break;
    case 'count': { const it=S.items.find(i=>i.id===b.dataset.id); if(it){ it.count=Math.max(0,it.count+ +b.dataset.d); } save(); break; }
    case 'del': S.items=S.items.filter(i=>i.id!==b.dataset.id); save(); break;
    case 'doc': { S.docs=S.docs||{}; const k=b.dataset.k, v=b.dataset.val==='na'?'na':1; if(S.docs[k]===v) delete S.docs[k]; else S.docs[k]=v; save(); break; }
    case 'check': { const k=b.dataset.k; S.checks[k]=Math.max(0,(S.checks[k]||0)+ +b.dataset.d); save(); break; }
    case 'add': UI.sheet={cat:b.dataset.cat, group:b.dataset.group||'getreide'}; render(); setTimeout(()=>document.getElementById('f-name')?.focus(),30); return;
    case 'closeSheet': case 'closeBg': UI.sheet=null; break;
    case 'copyList': await copy(listText(calc()), 'Liste kopiert.', null); break;
    case 'copyExport': { await copy(document.getElementById('exp').value, 'Sicherung kopiert. Füge sie z. B. in eine Notiz ein.', 'exp'); if(UI.msg.startsWith('Sicherung kopiert')) markBackedUp(); break; }
    case 'backup': await doBackup(b.dataset.mode); break;
    case 'seenVersion': META.seenVersion=APP_VERSION; DB.put(META,'meta'); return;
    case 'calFreq': META.calFreq=b.dataset.f; DB.put(META,'meta'); break;
    case 'calGoogle': META.cal='done'; DB.put(META,'meta'); UI.msg='Google Kalender geöffnet: dort „Speichern“ tippen.'; setTimeout(render,50); return;
    case 'calIcs': if(icsDownload(META.calFreq||'monthly')){ META.cal='done'; DB.put(META,'meta'); UI.msg='Termindatei „vorratscheck.ics“ geladen: öffnen und im Kalender speichern.'; } else UI.msg='Termindatei konnte nicht erstellt werden.'; break;
    case 'calLater': META.cal='later'; UI.calLaterShown=true; DB.put(META,'meta'); break;
    case 'calNever': META.cal='never'; DB.put(META,'meta'); break;
    case 'snooze': META.snoozeUntil=Date.now()+864e5; DB.put(META,'meta'); break;
    case 'snapPick': { const x=SNAPS[+b.dataset.i]; if(x) UI.pending={label:'Zwischenstand vom '+new Date(x.at).toLocaleString('de-DE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+' Uhr laden?', data:JSON.parse(JSON.stringify(x.data))}; break; }
    case 'restoreYes': if(UI.pending) restore(UI.pending.data,'Wiederhergestellt.'); break;
    case 'restoreNo': UI.pending=null; break;
    case 'import': doImport(); break;
    case 'reset': UI.confirmReset=true; break;
    case 'resetNo': UI.confirmReset=false; break;
    case 'resetYes': { const wasDemo=S.demo; S=emptyState(); UI.confirmReset=false; save(); UI.msg='Alle Artikel gelöscht.'; if(wasDemo){ askCal(); UI.view='home'; UI.msg=''; } break; }
    case 'rotEdit': UI.rotEdit=b.dataset.id; break;
    case 'rotCancel': UI.rotEdit=null; break;
    case 'rotSave': { const it=S.items.find(i=>i.id===b.dataset.id); const m=document.getElementById('rot-m').value, y=document.getElementById('rot-y').value;
      if(it){ it.mhd=`${y}-${String(m).padStart(2,'0')}`; UI.msg=`${it.name}: neues Datum ${mhdText(it.mhd)} gespeichert.`; }
      UI.rotEdit=null; save(); break; }
    case 'rotUsed': { const it=S.items.find(i=>i.id===b.dataset.id); S.items=S.items.filter(i=>i.id!==b.dataset.id);
      if(it) UI.msg=`${it.name} entfernt. Steht jetzt in der Einkaufsliste, falls etwas fehlt.`; UI.rotEdit=null; save(); break; }
    case 'loadDemo': S=demoState(); save(); UI.view='home'; break;
  }
  render();
});
async function copy(text,ok,selId){
  try{ await navigator.clipboard.writeText(text); UI.msg=ok; }
  catch(err){ UI.msg = selId ? 'Kopieren nicht möglich. Text markieren und manuell kopieren.' : 'Kopieren nicht möglich.'; }
}
function doImport(){
  UI.impErr='';
  try{ const d=parseBackup(document.getElementById('imp').value); UI.pending={label:'Eingefügten Text einspielen?', data:d}; }
  catch(e){ UI.impErr='Der Text ist keine gültige Sicherung. Kopiere ihn vollständig aus „Text kopieren“.'; }
}
root.addEventListener('change', e=>{
  const t=e.target;
  if(t.id==='pets-on'){ if(t.checked){ S.petsOn=true; } else { S.petsOn=false; S.pets={}; } save(); const pos=window.scrollY; render(); window.scrollTo(0,pos); return; }
  if(t.id==='land'){ S.land=t.value||null; save(); const pos=window.scrollY; render(); window.scrollTo(0,pos); return; }
  if(t.id==='f-group'){ const g=FOOD.find(x=>x.k===t.value); if(!g) return;
    document.getElementById('f-ex').textContent=`Lange haltbar, z. B. ${g.ex}. Mischgerichte zählst du bei der Hauptzutat.`;
    const w=document.getElementById('f-dry-wrap'); w.hidden=!g.form;
    if(g.form){ document.getElementById('f-dry-label').textContent=g.form.label; document.getElementById('f-dry-hint').textContent=dryHint(g); }
    else document.getElementById('f-dry').checked=false;
    return; }
  if(t.id==='restore-file' && t.files && t.files[0]){ const f=t.files[0]; UI.impErr='';
    if(f.size>5e6){ UI.impErr='Die Datei ist zu groß für eine Vorratsplaner-Sicherung.'; render(); return; }
    f.text().then(txt=>{ try{ UI.pending={label:`Sicherung „${f.name}“ wiederherstellen?`, data:parseBackup(txt)}; }
      catch(err){ UI.impErr='Diese Datei ist keine Vorratsplaner-Sicherung.'; } render(); });
    return; }
  if(t.dataset.name!==undefined){ S.names=S.names||[]; S.names[+t.dataset.name]=t.value; save(); }
  if(t.dataset.cash){ S.cash=S.cash||{have:0,target:null}; const n=parseNum(t.value); S.cash[t.dataset.cash]= n>0?n:(t.dataset.cash==='have'?0:null); save(); const pos=window.scrollY; render(); window.scrollTo(0,pos); }
});
root.addEventListener('input', e=>{
  if(e.target.id==='wsearch'){ const q=e.target.value.trim().toLowerCase(); let n=0;
    document.querySelectorAll('#wlist .wcard').forEach(el=>{ const hit=!q||el.dataset.search.includes(q); el.hidden=!hit; if(hit) n++; if(q&&hit) el.open=true; });
    document.querySelectorAll('#wlist .wsec').forEach(h=>{ let x=h.nextElementSibling, any=false; while(x&&!x.classList.contains('wsec')){ if(!x.hidden) any=true; x=x.nextElementSibling; } h.hidden=!any; });
    document.getElementById('wnone').hidden=n>0; return; }
  if(e.target.id==='days'){ setDays(+e.target.value);
    const c=calc(); document.getElementById('dl').textContent=`${c.T} Tage`;
    clearTimeout(window._rt); window._rt=setTimeout(()=>{ const pos=window.scrollY; render(); window.scrollTo(0,pos); document.getElementById('days')?.focus(); },120);
  }
});
root.addEventListener('submit', e=>{
  e.preventDefault();
  const f=UI.sheet; const g=id=>document.getElementById(id)?.value;
  const name=(g('f-name')||'').trim(), size=parseNum(g('f-size')), count=parseInt(g('f-count'),10), m=g('f-month'), y=g('f-year');
  const dryEl=document.getElementById('f-dry');
  const grp=g('f-group')||f.group, gObj=FOOD.find(x=>x.k===grp);
  const dry=!!(dryEl&&dryEl.checked&&gObj&&gObj.form);
  // Hinweis kurz haltbar: neu prüfen, wenn sich das Datum geändert hat
  if(f.m!==m||f.y!==y) f.short=null;
  Object.assign(f,{name, size:g('f-size'), count:g('f-count'), unit:g('f-unit'), group:grp, dry, m, y}); f.err='';
  const mhd = m&&y ? `${y}-${String(m).padStart(2,'0')}` : null;
  const left = mhd ? mhdIdx(mhd)-CUR : null;
  if(!name) f.err='Bitte einen Namen eingeben.';
  else if(!(size>0)) f.err='Bitte die Menge pro Stück als Zahl eingeben, z. B. 400.';
  else if(!(count>=1)) f.err='Bitte die Anzahl eingeben, mindestens 1.';
  else if((m&&!y)||(!m&&y)) f.err='Bitte Monat und Jahr des MHD wählen oder beides leer lassen.';
  else if(left!==null && left<SHORT_MONTHS && !f.short){ f.short = left<0?'expired':'soon'; }
  else {
    S.items.push({id:uid(),cat:f.cat,group:f.cat==='nahrung'?f.group:null,name,size,unit:f.unit,count,mhd,...(dry?{dry:true}:{})});
    UI.sheet=null; save();
  }
  render();
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape'&&UI.sheet){ UI.sheet=null; render(); } });

/* ---------- Start ---------- */
(async()=>{
  try{ navigator.storage?.persist?.(); }catch(e){}
  const ok=await DB.open();
  const saved=ok?await DB.get():null;
  try{ S = saved ? cleanState(saved) : demoState(); }catch(e){ S = demoState(); }
  S.docs=S.docs||{}; S.names=S.names||[]; S.cash=S.cash||{have:0,target:null}; S.kids4=S.kids4||0; S.kids1=S.kids1||0; S.pets=S.pets||{};
  if(ok){ META=Object.assign(META, await DB.get('meta')||{}); SNAPS=(await DB.get('snaps')||[]).map(x=>{ try{ return {day:String(x.day).slice(0,20), at:Number(x.at)||Date.now(), data:cleanState(x.data)}; }catch(e){ return null; } }).filter(Boolean); }
  snapshot();
  render();
})();

if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
