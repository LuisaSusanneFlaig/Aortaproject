# ScrollyTellingBuilder

![GitHub last commit](https://img.shields.io/github/last-commit/smokydangs/ScrollyTellingBuilder)
![GitHub license](https://img.shields.io/github/license/smokydangs/ScrollyTellingBuilder)
![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow)

Eine interaktive Web-Plattform zur Erstellung und Verwaltung von Scrollytelling-Storys, spezialisiert auf medizinische Bildungsanwendungen.

👉 **[Zum Projekt live](https://smokydangs.github.io/ScrollyTellingBuilder/index.html)**

---

## 📑 Inhaltsverzeichnis
1. [Wichtige Änderungen](#wichtige-änderungen)
2. [Hauptfunktionen](#hauptfunktionen)
3. [Projektstruktur](#projektstruktur)
4. [Setup & Anleitung](#setup--anleitung)
5. [Hilfe & Support](#hilfe--support)

---

## 🚀 Wichtige Änderungen (Stand Juni 2026)

- **Vollständig kundenspezifisch:** Der Editor unterstützt nun exklusiv eigene GLB-Modelle (Mesh und Pathlines) pro Sektion.
- **Konsolidierte Architektur:** Die Projektstruktur wurde bereinigt und vereinfacht.
- **Erweiterte 3D-Konfiguration:** Jede Sektion erlaubt nun detaillierte Einstellungen (Transformation, Farbe, Transparenz, Kopplung).
- **Daten-Management:** Neues Feature zum schnellen Bereinigen von Story-Inhalten.

## ✨ Hauptfunktionen

- **Interaktiver Story-Editor:** Intuitives Interface zur Verwaltung von Sektionen und Elementen.
- **3D-Integration:** Dynamische Three.js-Visualisierung mit präziser Steuerung.
- **Datenvisualisierung:** Integrierte D3.js-Engine für interaktive Diagramme.
- **Responsive Design:** Optimiert für Desktop und mobile Endgeräte.

## 📂 Projektstruktur

```
/
├── css/             # Stylesheets (Editor-UI, Basis-Design)
├── js/
│   ├── core/        # Engine, Loader, Konfiguration
│   ├── effects/     # 3D-Effekte (Flow-Systeme)
│   ├── ui/          # Editor-Panels, Chart-Management, Theme-System
│   ├── editor.js    # Editor-Initialisierung
│   ├── editorUI.js  # Editor-Orchestrator
│   └── scrollytelling.js # Haupt-App-Logik
├── vendor/          # Externe Bibliotheken (Three.js)
└── *.html           # Entry-Points
```

## 🛠 Setup & Anleitung

1. Repository klonen.
2. Projekt über einen lokalen Webserver ausführen (z.B. `npx serve .`).
3. **Asset-Workflow:**
    - Laden Sie GLB-Dateien direkt in der Sidebar der jeweiligen Sektion hoch (`mesh.glb` und `pathlines.glb`).
    - Nutzen Sie die "Transformations-Kopplung", um Mesh und Pathlines gemeinsam auszurichten.
    - Passen Sie Visualisierungen (Farbe/Transparenz) individuell pro Sektion an.

## 💡 Hilfe & Support

Für neue Charts erweitern Sie `js/ui/ChartManager.js`. Für allgemeine Anpassungen ist das CSS in `css/editor-ui.css` und `css/scrollytelling.css` der zentrale Anlaufpunkt.
