# ScrollyTellingBuilder

Eine interaktive Web-Plattform fuer handprogrammierte medizinische Scrollytelling-Storys.

## Wichtige Aenderungen

- **Editorfreier Branch:** Story-Sektionen werden direkt im Code aufgebaut und koennen pro Abschnitt individuell programmiert werden.
- **Konsolidierte Architektur:** Die Story nutzt weiter dieselbe Scroll- und Three.js-Logik, aber ohne Editor-Sidebar, Inline-Editing, lokale Editor-Stores oder Upload-Panels.
- **Dissection-Statistiken:** Die Aortendissektions-Grafiken sind als Story-Elemente integriert und koennen spaeter einzeln umgebaut werden.

## Hauptfunktionen

- **Handprogrammierte Story-Sektionen:** Inhalte, Statistikgrafiken und Layouts leben direkt in den Story-Modulen.
- **3D-Integration:** Dynamische Three.js-Visualisierung mit sektionaler Steuerung ueber Konfiguration.
- **Datenvisualisierung:** Integrierte D3.js-/SVG-faehige Story-Grafiken.
- **Responsive Design:** Optimiert fuer Desktop und mobile Endgeraete.

## Projektstruktur

```
/
+-- css/                  # Basis-, Navigations-, Dashboard- und Scrollytelling-Styles
+-- js/
¦   +-- modules/
¦   ¦   +-- core/         # Engine, Loader, Konfiguration
¦   ¦   +-- effects/      # 3D-Effekte und Flow-Systeme
¦   ¦   +-- ui/           # Chart-Management und Theme-System
¦   ¦   +-- storyContent.js
¦   ¦   +-- storyRenderer.js
¦   ¦   +-- scrollytelling.js
¦   +-- scrollytelling.js # Entry-Wrapper
+-- vendor/               # Externe Bibliotheken, z.B. Three.js
+-- *.html                # Entry-Points
```

## Setup

1. Projekt ueber einen lokalen Webserver ausfuehren, z.B. `python -m http.server 8124 --bind 127.0.0.1`.
2. `scrollytelling-dissection.html` oder `scrollytelling-aneurysm.html` oeffnen.
3. Inhalte und Sektionen in `js/modules/storyContent.js` und `js/modules/storyRenderer.js` anpassen.

## Hilfe

Fuer neue Charts erweitern Sie `js/modules/ui/ChartManager.js`. Fuer allgemeine Anpassungen sind `css/scrollytelling.css` und die Story-Module der zentrale Anlaufpunkt.