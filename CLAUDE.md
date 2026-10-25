# Arbeitsregeln für dieses Repository

Bei **jeder** veröffentlichten Änderung an der App gemeinsam aktualisieren:

1. `index.html` – `APP_VERSION` hochzählen.
2. `sw.js` – `VERSION` hochzählen (sonst laden installierte Apps das Update nicht zuverlässig).
3. `versionen.html` – neuen Eintrag oben, Tag „Aktuell“ verschieben.
4. `CHANGELOG.md` – derselbe Eintrag.
5. `README.md` – „Aktuelle Version“ und die Funktionsliste anpassen.
6. `IDEEN.md` – umgesetzte Ideen mit `[x]` und Version abhaken, neue offene Punkte ergänzen.

Weitere Regeln:
- Rein statisch, offline-fähig, keine externen Abrufe (keine Webfonts, keine APIs). Der Abruf von warnung.bund.de wurde getestet und blockiert (CORS), daher verworfen.
- Kein Impressum: privates Projekt, keine Werbung.
- Texte auf Deutsch, für Laien verständlich.
- Mengen nach BBK; eigene Richtwerte im Code und in der App als solche kennzeichnen.
