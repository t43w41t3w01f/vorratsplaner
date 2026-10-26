# Arbeitsregeln für dieses Repository

Bei **jeder** veröffentlichten Änderung an der App gemeinsam aktualisieren:

1. `app.js` – `APP_VERSION` hochzählen.
2. `sw.js` – `VERSION` hochzählen (sonst laden installierte Apps das Update nicht zuverlässig).
3. `versionen.html` – neuen Eintrag oben, Tag „Aktuell“ verschieben.
4. `CHANGELOG.md` – derselbe Eintrag.
5. `README.md` – „Aktuelle Version“ und die Funktionsliste anpassen.
6. `IDEEN.md` – umgesetzte Ideen mit `[x]` und Version abhaken, neue offene Punkte ergänzen.

Sicherheit:
- Jede Ausgabe von Nutzerdaten ins HTML über `esc()`.
- Neue Datenfelder immer in `cleanState()` / `cleanItem()` in `app.js` aufnehmen, sonst gehen sie beim Laden verloren.
- Kein Inline-JavaScript in HTML (CSP `script-src 'self'`), alle Skripte in `app.js`.
- Neue Dateien in `sw.js` (`FILES`) eintragen.

Weitere Regeln:
- Rein statisch, offline-fähig, keine externen Abrufe (keine Webfonts, keine APIs). Der Abruf von warnung.bund.de wurde getestet und blockiert (CORS), daher verworfen.
- Kein Impressum: privates Projekt, keine Werbung.
- Texte auf Deutsch, für Laien verständlich.
- Mengen nach BBK; eigene Richtwerte im Code und in der App als solche kennzeichnen.
