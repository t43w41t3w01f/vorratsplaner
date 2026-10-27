# Versionen

Alle Änderungen am Hamsterplan (bis Version 1.17 „Vorratsplaner“), neueste zuerst. Dieselben Einträge stehen in der App unter „Was ist neu?“.

## 1.21 – 27. Oktober 2026
Sicherheitsprüfung in 5 Durchläufen. Rücksprungpunkt: Zweig `stand-v1.20`.
- **Behoben (mittel):** Statusmeldungen (`UI.msg`) wurden ungefiltert angezeigt. Ein Artikel- oder Medikamentenname aus einer manipulierten Sicherungsdatei konnte so HTML einschleusen, z. B. einen gefälschten Link. Skripte hat die CSP schon vorher blockiert. Jetzt werden alle Meldungen und Fehlertexte maskiert.
- **Behoben (gering):** Formularwerte (Menge, Anzahl) maskiert; Eingaben werden beim Speichern geprüft und gekürzt (Name 80, Person 40, Medikament 60 Zeichen); unsichtbare Steuer- und Richtungszeichen (z. B. U+202E) werden entfernt.
- **Behoben (gering):** Geräte-Einstellungen (META) aus dem Speicher werden beim Start geprüft; `__proto__` als Kalender-Rhythmus abgefangen.
- **Behoben (gering):** Unbekannte Ansicht führt zur Startseite statt zu einem Absturz.
- **Gehärtet:** CSP ohne `data:`/`blob:` für Bilder, zusätzlich `frame-src 'none'` und `media-src 'none'`.
- Geprüft ohne Befund: Import (Größe, Verschachtelung, 2000-Einträge-Grenze), Prototype Pollution, externe Links (`noopener`), Service Worker (nur eigene, gültige Antworten), Repository (keine Geheimnisse, keine privaten E-Mail-Adressen).

## 1.20 – 27. Oktober 2026
Babys unter 1 Jahr. Rücksprungpunkt: Zweig `stand-v1.19`.
- **Zähler „Babys unter 1 Jahr“**: zählen als Person, essen aber nichts aus dem Vorrat. Wasser 1 l pro Baby und Tag (Zubereitung, eigener Richtwert).
- **Bereich „Baby“** mit „Entfällt“ je Punkt: Säuglingsmilch-Pulver (Packung je ca. 5 Tage), trinkfertige Notreserve, Fläschchen, Sauger, Flaschenbürste, Thermoskanne, Beikost (2 Portionen pro Tag), Windeln (8 pro Tag), Feuchttücher, Wundschutzcreme, Wechselkleidung, Schlafsack/Mütze/Decke, Babytrage, Nasentropfen, Elektrolytlösung, Schnuller. Alle Mengen eigene Richtwerte.
- Hinweise: Stillen, Pulvermilch nur mit abgekochtem oder geeignetem Wasser, trinkfertige Säuglingsmilch, Wärme. Zusätzlich in der Karte „Stromausfall“.
- U-Hefte in der Dokumentenmappe (bei Kindern im Haushalt).
- Kästchen „Pflege oder Hilfe im Alltag“ grün umrandet wie die Haustiere.
- Zähler (+/−) werden bei großer Schrift auf schmalen Bildschirmen nicht mehr abgeschnitten.

## 1.19 – 27. Oktober 2026
Medikamente, Pflege, Schutz vor Datenverlust. Rücksprungpunkt: Zweig `stand-v1.18`.
- **Meine Medikamente** (für alle): Name, für wen, Menge pro Tag, pro Woche oder bei Bedarf, Vorrat, Kühlpflicht. Der Vorrat zieht sich täglich selbst ab. Anzeige „reicht X Tage, bis …“, Hinweis „Rezept rechtzeitig holen“, Eintrag in Einkaufsliste und Ausdruck. Keine Einnahme-Erinnerung, keine Dosierungsvorgaben.
- Der Punkt „Persönliche Medikamente (Packung)“ in der Checkliste entfällt, die Medikamentenliste ersetzt ihn.
- **Kästchen „Pflege oder Hilfe im Alltag“**: Bereich „Pflege & Hilfsmittel“ mit „Entfällt“ je Punkt, Inkontinenzmaterial 4 Stück pro Tag (eigener Richtwert), Hinweis zu Strom und Hausnotruf (Startseite einmalig, Karte „Stromausfall“), Pflegegrad-Bescheid und Medikationspläne in der Dokumentenmappe. Mengen für Essen und Wasser unverändert.
- **Schutz vor Datenverlust**: erste Sicherungs-Erinnerung nach 5 Einträgen, Knopf „An mich selbst schicken“, Sicherungsstatus auf der Startseite, Sicherung hat Vorrang vor dem Kalender-Hinweis, „Sicherung einspielen“ im ersten Schritt des Einstiegs.
- Sicherheit: Hinweistexte in der Einkaufsliste werden jetzt ebenfalls maskiert (Namen aus der Dokumentenmappe).
- Datenschutzseite: Medikamente sind Gesundheitsdaten, bleiben auf dem Gerät und stehen in der Sicherungsdatei.

## 1.18 – 27. Oktober 2026
Neuer Name und eigene Adresse. Rücksprungpunkt: Zweig `stand-v1.17`.
- **Neuer Name „Hamsterplan“** statt „Vorratsplaner“ (bisheriger Projektname).
- **Eigene Adresse hamsterplan.de** (bei INWX, zeigt auf GitHub Pages). Die alte github.io-Adresse leitet weiter.
- **Hamster-Maskottchen** als App-Symbol (alle Größen, auch für Android-Formen) und auf Startseite und Einstieg, Motto „Vorrat wie ein Hamster: Stück für Stück“.
- Umzug von der alten Adresse: Flugmodus an, alte App öffnen (läuft aus dem Gerätespeicher), Sicherung als Datei speichern, in hamsterplan.de wiederherstellen.
- Sicherungsdateien heißen jetzt `hamsterplan-sicherung-….json`, alte Sicherungen lassen sich weiter einspielen.

## 1.17 – 26. Oktober 2026
Einfach für alle (Paket 2). Rücksprungpunkt: Zweig `stand-v1.16`.
- **Zielmarken** auf der Startseite: 3 Tage (Grundschutz), 10 Tage (empfohlen), eigenes Ziel. Mit konkreter Angabe, was bis zum nächsten Ziel fehlt, und einmaligem Glückwunsch beim Erreichen.
- **App weiterempfehlen:** Teilen mit Text und Link (Startseite und Einstellungen), Ersatz per WhatsApp-Link oder Kopieren.

## 1.16 – 26. Oktober 2026
Einfach für alle (Paket 1). Rücksprungpunkt: Zweig `stand-v1.15`.
- **Einstieg in 3 Schritten** (Haushalt, Haustiere, Bundesland) statt Beispieldaten beim ersten Öffnen.
- **Schnellauswahl** mit 28 fertigen Produkten beim Eintragen, Anzahl mit + und −, Datum optional. Freies Formular weiterhin verfügbar.
- **Installationshilfe** auf der Startseite (Knopf unter Android/Chrome, Anleitung für iPhone und andere Browser).
- **Große Schrift** als Schalter, allgemein größere Texte, Knöpfe mindestens 48 px.
- **Alltagssprache:** „Haltbar bis“, „Am meisten fehlt“, „Bereich“.
- **Berechnung aufgeräumt:** Haushalt als Zusammenfassung mit „Ändern“.

## 1.15 – 26. Oktober 2026
- **Sicherheit:** Sicherungsdateien und gespeicherte Daten werden streng geprüft (nur bekannte Felder und gültige Werte). Manipulierte Dateien können keinen Schadcode ausführen und die App nicht abstürzen lassen.
- Content Security Policy: Die App führt nur eigene Skripte aus (Code nach `app.js` ausgelagert).
- Offline-Cache: nach 3 s ohne Netz aus dem Gerätespeicher, nur gültige Antworten werden gespeichert, nur eigene Dateien.
- Barrierefreiheit: Kontraste auf mindestens 4,5:1 angehoben, lange Überschriften brechen um, fehlende Beschriftungen ergänzt.
- Datenschutzseite: Hinweis zur Google-Kalender-Funktion.

## 1.14 – 26. Oktober 2026
- **Haustiere deutlicher:** Kästchen „Haustiere im Haushalt“ statt Aufklapp-Pfeil. Haken setzen zeigt die Tier-Zähler, Haken entfernen setzt die Tiere auf null.

## 1.13 – 26. Oktober 2026
- **Haustiere im Haushalt:** kleine, mittlere und große Hunde, Katzen und Kleintiere unter „Berechnung“.
- Trinkwasser der Tiere zählt beim Wasser und in der Reichweite mit.
- **Neue Kachel „Haustiere“** (nur mit Tieren): Futter und Katzenstreu nach Tagen, Napf, Transportbox oder Leine, Kotbeutel, Medikamente und Heimtierausweis.

## 1.12 – 26. Oktober 2026
- **Absender:** „Entwickelt von Sascha L. · © 2026“ unten in der App, auf der Versions- und der Datenschutzseite.

## 1.11 – 26. Oktober 2026
- **Notfall-Wissen:** dritter Knopf auf der Startseite, 23 Anleitungen für ganz Deutschland, offline lesbar.
- Themen: Notruf, Warnungen und Sirenen, Informiert bleiben, Telefonausfall, Stromausfall, Wasser und Abkochgebot, Hygiene ohne Wasser, Heizungsausfall, Unwetter, Hochwasser, Hitze, Kälte, Waldbrand, Erdbeben, Wohnungsbrand, Kohlenmonoxid, Gefahrstoffe, radioaktive Stoffe, Evakuierung, Amok und Terror, Luftalarm, Pandemie, seelische Belastung.
- Karten mit „Sofort tun“ und Hintergründen, Abgleich mit der Ausrüstung im Vorrat.
- Notrufnummern zum Antippen, Giftnotruf je Bundesland (Quelle: BfR).
- Suche, Drucken und PDF.

## 1.10 – 25. Oktober 2026
- **Haushalt mit Kindern:** Zähler für Erwachsene und Kinder ab 10, Kinder 4–9 Jahre und Kleinkinder 1–3 Jahre.
- Nahrung nach DGE-Richtwerten: Kinder 4–9 Jahre ca. 70 %, Kleinkinder ca. 50 %. Wasser, Hygiene, Dokumente und Bargeld zählen für alle voll.
- **Neue Kachel „Kleinkind“** (nur mit Kleinkindern): Windeln, Feuchttücher, Gläschen oder Brei nach Tagen, dazu Milchpulver, Trinkbecher, Kinder-Fiebermittel, Wundschutzcreme, Beschäftigung.
- Hinweis auf gesonderte Planung von Säuglingsnahrung (unter 1 Jahr).

## 1.9 – 25. Oktober 2026
- **Einkaufsliste aufgeräumt:** Lange Zeilen unter „Noch kaufen“ brechen sauber um und laufen nicht mehr über den Kasten hinaus, Mengen rechtsbündig.

## 1.8 – 25. Oktober 2026
- **Hinweis auf der Startseite:** Ein kurzer Text unter den beiden großen Knöpfen verweist auf „Was ist neu?“ mit allen Funktionen und Versionen.
- Nach einem Update zeigt die Startseite „Neu: Version …“, bis die Versionsseite einmal geöffnet wurde.

## 1.7 – 25. Oktober 2026
- **Erinnerung im Kalender:** Beim Anlegen des eigenen Vorrats fragt die App, ob ein Serientermin „Vorratscheck“ angelegt werden soll (wöchentlich, monatlich oder alle 3 Monate).
- Ein Tipp öffnet den fertigen Termin im Google Kalender, alternativ eine Termindatei für andere Kalender.
- „Später“ fragt beim nächsten Öffnen erneut, „Nein danke“ nie wieder. Auch in den Einstellungen einrichtbar.

## 1.6 – 25. Oktober 2026
- **Nur lange Haltbares:** Jede Lebensmittelgruppe zeigt, was gemeint ist (Dose, Glas, getrocknet), und nennt gut geeignete Beispiele. Die BBK-Mengen beziehen sich auf Konserven und Trockenware, nicht auf Frisches.
- **Hinweis bei kurzem Haltbarkeitsdatum:** Läuft ein Artikel in weniger als 3 Monaten ab, fragt die App vor dem Speichern nach.
- **Trockenware und Pulver richtig gezählt:** getrocknete Hülsenfrüchte ×2,5, Trockenobst ×3, Milchpulver ×8, Volleipulver ×4.
- Die Einkaufsliste nennt zu jeder fehlenden Gruppe lange haltbare Beispiele.

## 1.5 – 25. Oktober 2026
- **Vorrat drucken:** kompletter Bestand als Ausdruck oder PDF.
- Enthält Reichweite, Wasser, Nahrung nach BBK-Gruppen mit Mengen und Haltbarkeit, Ausrüstung, Dokumente und Bargeld.
- Abgelaufenes ist hervorgehoben, dazu Kästchen zum Abhaken.

## 1.4 – 25. Oktober 2026
- **Sicherung als Datei:** speichern oder teilen (Google Drive, Mail, Messenger).
- **Erinnerung** nach 7 Tagen oder 10 Änderungen, „Morgen erinnern“ verschiebt sie.
- **Wiederherstellen** aus der Sicherungsdatei mit Vorschau.
- **Automatische Zwischenstände** der letzten 7 Tage.

## 1.3 – 25. Oktober 2026
- **Verbrauchsliste:** Artikel, die in den nächsten 2 Monaten ablaufen, sortiert nach Datum.
- „Ersetzt – neues Datum“ und „Aufgebraucht“.

## 1.2 – 25. Oktober 2026
- Neue Versionsseite in der App („Was ist neu?“).

## 1.1 – 25. Oktober 2026
- Impressum entfernt (privates Projekt).

## 1.0 – 25. Oktober 2026
- Erste installierbare Version, offline und ohne Konto.
- Startseite mit „Mein Vorrat“ und „Berechnung“.
- Berechnung nach BBK: Personen, Ziel-Tage per Regler, Reichweite mit Engpass.
- Einkaufsliste mit Drucken, PDF und Kopieren.
- Lebensmittel nach BBK-Gruppen, Wasser, Haltbarkeits-Warnungen.
- Checklisten für Ausrüstung, Dokumentenmappe pro Person, Bargeld-Richtwert.
- Sicherung per Text.
