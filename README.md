# Vorratsplaner

**Notvorrat planen nach BBK-Empfehlung – offline, ohne Konto, ohne Werbung.**

Der Vorratsplaner zeigt dir auf einen Blick, wie viele Tage dein Notvorrat reicht und was dir noch fehlt. Grundlage sind die Empfehlungen des Bundesamts für Bevölkerungsschutz und Katastrophenhilfe (BBK).

## Funktionen

- **Reicht für:** Personen im Haushalt und Ziel-Tage einstellen, die App berechnet die Reichweite und nennt den Engpass, z. B. „Engpass: Wasser“.
- **Noch kaufen:** Fehlmengen als Einkaufsliste, Wasser direkt in Kisten umgerechnet. Drucken, als PDF speichern oder kopieren.
- **Mein Vorrat:** Lebensmittel nach BBK-Gruppen eintragen, Wasser in Litern, Ausrüstung als Checkliste.
- **Haltbarkeit im Blick:** Warnung bei bald ablaufenden Artikeln. Abgelaufenes zählt nicht mehr zum Vorrat.
- **Dokumentenmappe:** Checkliste pro Person für Originale und Kopien, dazu ein Bargeld-Richtwert.
- **Offline und privat:** Alle Daten bleiben auf deinem Gerät. Sicherung per Export und Import.

## Installieren

Seite in Chrome öffnen → Menü ⋮ → **App installieren** (iPhone: Safari → Teilen → **Zum Home-Bildschirm**).

## Kurzbeschreibung (80 Zeichen, z. B. für Play Store)

Notvorrat nach BBK planen: Reichweite in Tagen, Einkaufsliste, MHD-Warnung.

## Hinweis

Die Mengen sind Richtwerte nach BBK. Keine Gewähr, dass ein Vorrat im Notfall ausreicht.

## Technik

HTML, CSS und JavaScript ohne Build-Schritt. Speicherung in IndexedDB, Offline-Betrieb über Service Worker. Bei Änderungen in `sw.js` die `VERSION` erhöhen, damit installierte Apps das Update laden.
