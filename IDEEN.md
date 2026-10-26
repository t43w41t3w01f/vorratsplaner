# Ideen für den Vorratsplaner

Ideen-Sammlung zum Abhaken. Erledigte Punkte bekommen ein `[x]` und die Version, in der sie umgesetzt wurden.

## Umgesetzt

- [x] **Grundfunktionen**: Startseite, Berechnung nach BBK mit Reichweite und Einkaufsliste, Vorrat nach BBK-Gruppen, Checklisten, Dokumentenmappe, Bargeld, offline installierbar *(Version 1.0)*
- [x] **Versionsseite „Was ist neu?“** in der App *(Version 1.2)*
- [x] **Rotations-Liste „Verbrauchsliste“**: Was in den nächsten 2 Monaten abläuft, mit „Ersetzt – neues Datum“ und „Aufgebraucht“ *(Version 1.3)*
- [x] **Sicherung als Datei und Erinnerung**: Datei speichern oder teilen (Drive, Mail), Erinnerung nach 7 Tagen oder 10 Änderungen, Wiederherstellen aus Datei, automatische Zwischenstände der letzten 7 Tage *(Version 1.4)*
- [x] **Vorrat drucken**: kompletter Bestand als Ausdruck oder PDF, mit Haltbarkeit und Kästchen zum Abhaken *(Version 1.5)*
- [x] **Nur lange Haltbares**: Beispiele je Gruppe, Hinweis bei MHD unter 3 Monaten, Trockenware und Pulver mit Umrechnungsfaktor *(Version 1.6)*
- [x] **Vorratscheck-Erinnerung**: regelmäßige Erinnerung, den Vorrat zu prüfen, wöchentlich, monatlich oder alle 3 Monate *(Version 1.7)*
- [x] **Automatische Erinnerung im Kalender**: Serientermin „Vorratscheck“ per Google Kalender oder Termindatei, Abfrage beim Anlegen des eigenen Vorrats, auch in den Einstellungen *(Version 1.7)*
- [x] **Hinweis auf Neuerungen**: Text auf der Startseite verweist auf „Was ist neu?“, Markierung „Neu: Version …“ nach Updates *(Version 1.8)*
- [x] **Einkaufsliste aufgeräumt**: Zeilenumbruch bei langen Texten unter „Noch kaufen“ *(Version 1.9)*
- [x] **Haushaltsprofil Kinder**: Zähler für Kinder 4–9 (Nahrung ×0,7) und Kleinkinder 1–3 (×0,5) nach DGE, Kleinkind-Kachel mit Windeln und Kleinkindnahrung *(Version 1.10)*
- [x] **Notfall-Wissen offline**: 23 Karten für alle Krisenlagen in Deutschland, Notrufnummern, Giftnotruf je Bundesland, Suche, Druck *(Version 1.11)*
- [x] **Absender in der App**: „Entwickelt von Sascha L. · © 2026“ *(Version 1.12)*
- [x] **Haushaltsprofil Haustiere**: Hunde (klein, mittel, groß), Katzen, Kleintiere; Wasser zählt mit, eigene Kachel mit Futter und Zubehör *(Version 1.13)*
- [x] **Haustiere per Kästchen**: deutlich sichtbarer Haken statt Aufklapp-Pfeil *(Version 1.14)*

## Priorität hoch

- [ ] **Notfall-Modus „Es ist so weit“**: Umschalten auf Tageszähler, Wasserverbrauch pro Tag und Ess-Reihenfolge (erst Kühlschrank, dann Frisches, dann Konserven)
- [ ] **Haushaltsprofil Teil 3**: Senioren, Säuglinge unter 1 Jahr

## Weitere Ideen

- [ ] **Push-Benachrichtigung ohne Server** (Hintergrund-Abruf in Chrome): nur als Versuch, Chrome entscheidet selbst, ob und wie oft das läuft
- [ ] **Notfallplan der Familie**: Treffpunkt, wichtige Telefonnummern, wer holt die Kinder
- [ ] **Notgepäck-Checkliste** (Fluchtrucksack nach BBK), unabhängig von den Tagen
- [ ] **Lagerort pro Artikel** (z. B. „Keller, Regal 2“)
- [ ] **Wasser-Rechner Kochen**: Nudeln und Reis brauchen zusätzliches Wasser
- [ ] **Teilen im Haushalt**: Sicherung per QR-Code auf ein zweites Handy übertragen

## Offen

- [ ] **Haustier-Mengen prüfen** (Wasser und Futter pro Tier und Tag), bisher eigene Richtwerte
- [ ] **Notfall-Infopunkte der eigenen Gemeinde** eintragbar machen (Adresse des nächsten Leuchtturms)
- [ ] **Kleinkind-Mengen prüfen** (6 Windeln, 1 Gläschen pro Tag usw.), bisher eigene Richtwerte
- [ ] **Feedback per E-Mail**: Textfeld in der App öffnet die Mail-App mit fertigem Text und App-Version. *Wartet auf eine eigene E-Mail-Adresse.*
- [ ] **Besucherzähler** (z. B. GoatCounter, ohne Cookies und IP-Speicherung, nur für Sascha sichtbar). *Entscheidung offen*, bräuchte einen externen Dienst und einen Datenschutz-Hinweis
- [ ] **Umrechnungsfaktoren prüfen** (getrocknet ×2,5, Trockenobst ×3, Milchpulver ×8, Volleipulver ×4), bisher Richtwerte
- [ ] **Konserven: Gesamt- oder Abtropfgewicht?** BBK-Angabe unklar, derzeit Gesamtgewicht
- [ ] **Soll-Mengen der Checklisten festlegen** (Kerzen, Toilettenpapier, Batterien usw.), bisher Schätzwerte

## Bewusst verworfen

- Like-Knopf mit IP-Sperre: Die App kennt die IP nicht, ein Server müsste sie speichern. Außerdem unzuverlässig (gemeinsames WLAN, wechselnde Handy-IPs)
- Kalorienzählung und Nährwerte: viel Pflegeaufwand, kaum Mehrwert gegenüber den BBK-Gruppen
- Online-Funktionen (Sync, Konto): brechen das Offline-Prinzip, brauchen einen Server
- Amtliche Warnungen (NINA-Daten): getestet, der Warndienst blockiert den Abruf aus der App. Für Warnungen die Warn-App NINA nutzen
- Barcode-Scanner: braucht Kamera und Online-Datenbank, Eintippen ist fast genauso schnell
