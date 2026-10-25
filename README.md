# Vorratsplaner

**Notvorrat planen nach BBK-Empfehlung – offline, ohne Konto, ohne Werbung.**

👉 **App öffnen:** https://t43w41t3w01f.github.io/vorratsplaner/

Aktuelle Version: **1.10** · [Alle Änderungen](CHANGELOG.md) · [Ideen und Planung](IDEEN.md)

Der Vorratsplaner zeigt dir auf einen Blick, wie viele Tage dein Notvorrat reicht und was dir noch fehlt. Grundlage sind die Empfehlungen des Bundesamts für Bevölkerungsschutz und Katastrophenhilfe (BBK): 10 Tage, 2 Liter Getränke und ca. 2.200 kcal pro Person und Tag.

## Funktionen

### Berechnung
- Personen im Haushalt und Ziel-Tage (1–90) einstellen, Standard sind 10 Tage nach BBK.
- **Haushalt mit Kindern:** Erwachsene und Kinder ab 10, Kinder 4–9 Jahre (Nahrung ca. 70 %) und Kleinkinder 1–3 Jahre (ca. 50 %) nach DGE-Richtwerten. Wasser und Checklisten zählen für alle voll.
- **Reicht für:** Reichweite in Tagen und der Engpass, z. B. „Engpass: Wasser“.
- **Noch kaufen:** Einkaufsliste mit allen Fehlmengen. Wasser wird in Kisten umgerechnet, zu jeder Lebensmittelgruppe gibt es lange haltbare Beispiele. Drucken, als PDF speichern oder kopieren.

### Mein Vorrat
- **Wasser** in Litern, **Lebensmittel** nach den sechs BBK-Gruppen.
- Nur lange Haltbares: Jede Gruppe zeigt, was gemeint ist (Dose, Glas, getrocknet), mit passenden Beispielen.
- **Trockenware und Pulver** werden umgerechnet, z. B. getrocknete Linsen ×2,5, Milchpulver ×8.
- **Hinweis bei kurzem Haltbarkeitsdatum** (unter 3 Monaten) beim Eintragen.
- **Checklisten** für Erste Hilfe, Medikamente, Hygiene, Licht & Strom, Wärme & Kochen.
- **Kleinkind-Kachel** mit Windeln, Feuchttüchern, Kleinkindnahrung und Zubehör, erscheint nur mit Kleinkindern im Haushalt.
- **Dokumentenmappe** und Kopien als Checkliste pro Person, **Bargeld-Richtwert** 100 € pro Person.
- **Vorrat drucken:** kompletter Bestand als Ausdruck oder PDF, mit Kästchen zum Abhaken.

### Haltbarkeit im Blick
- Warnung auf der Startseite, wenn etwas abläuft. Abgelaufenes zählt nicht mehr zum Vorrat.
- **Verbrauchsliste:** Was in den nächsten 2 Monaten abläuft. „Ersetzt – neues Datum“ nach dem Neukauf, „Aufgebraucht“ entfernt den Artikel.

### Sicherung
- **Sicherung als Datei**, gespeichert oder direkt geteilt an Google Drive, Mail oder Messenger.
- **Erinnerung** nach 7 Tagen oder 10 Änderungen.
- **Wiederherstellen** aus der Sicherungsdatei.
- **Automatische Zwischenstände** der letzten 7 Tage auf dem Gerät.

### Erinnerung im Kalender
- Serientermin „Vorratscheck“ im Google Kalender oder als Termindatei für andere Kalender, wöchentlich, monatlich oder alle 3 Monate.
- Die App fragt beim Anlegen des eigenen Vorrats, einrichtbar auch in den Einstellungen.

### Privat und offline
- Alle Daten bleiben auf deinem Gerät, es gibt kein Konto und keine Werbung.
- Nach dem ersten Öffnen läuft die App komplett ohne Internet.
- Nach einem Update weist die Startseite auf die Neuerungen hin („Was ist neu?“).

## Installieren

- **Android:** Link in Chrome öffnen → Menü ⋮ → **App installieren**
- **iPhone:** Link in Safari öffnen → Teilen → **Zum Home-Bildschirm**

Beim ersten Öffnen siehst du Beispieldaten. Über „Eigenen Vorrat anlegen“ startest du mit deinem eigenen.

> **Tipp:** Die Daten liegen nur im Browser. Mach regelmäßig eine Sicherung (Einstellungen → Sicherung), sonst ist der Vorrat weg, wenn Browserdaten gelöscht werden oder du das Handy wechselst.

## Hinweis

Die Mengen sind Richtwerte nach BBK. Keine Gewähr, dass ein Vorrat im Notfall ausreicht. Privates Projekt.

## Technik

HTML, CSS und JavaScript ohne Build-Schritt. Speicherung in IndexedDB, Offline-Betrieb über einen Service Worker, Hosting über GitHub Pages.

| Datei | Inhalt |
|---|---|
| `index.html` | Die App |
| `versionen.html` | Versionsseite in der App |
| `datenschutz.html` | Datenschutzhinweise |
| `sw.js` | Offline-Cache |
| `CHANGELOG.md` | Versionsgeschichte |
| `IDEEN.md` | Ideen-Liste zum Abhaken |
