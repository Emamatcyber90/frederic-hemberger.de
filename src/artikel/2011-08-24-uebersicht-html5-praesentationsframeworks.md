---
layout: post.hbs
title: Übersicht HTML5-Präsentationsframeworks
intro: >
    Neben PowerPoint und Keynote gibt es immer mehr Präsentationswerkzeuge, die auf HTML und CSS setzen und so außerordentlich flexibel in der Gestaltung sind. Ein Grund – grade für Web-Worker – sich einen kurzen Überblick zu verschaffen
date: 2011-08-24
update: 2012-06-05
---

## deck.js
Das Framework [deck.js](http://imakewebthings.github.com/deck.js/) von Caleb Troughton ist quasi "the new kid in town". Was mir auf den ersten Blick gut gefällt ist der modulare Aufbau: Themes, Transitions und Erweiterungen wie eine Slideübersicht, sichtbare Slidenummern, etc. können alle nach eigenem Belieben zusammengestöpselt werden.

Das birgt natürlich auch die Gefahr, dass man sich statt am den Inhalt einer Präsentation zu sehr auf das Feintuning von Plug-Ins und Effekten konzentriert. Es ist auf jeden Fall ein interessantes Framework, die Modularität erlaubt das Abstimmen auf die eigenen Bedürfnisse, wenn man sich ein wenig Zeit nimmt, in die Details einzusteigen.


## impress.js
In eine ähnliche Kerbe schlägt [impress.js](http://bartaz.github.com/impress.js/) das optisch wirklich äußerst beeindruckend ist. Es orientiert sich im Wesentlichen an dem Präsentationsservice [prezi.com](http://prezi.com), bedient sich dabei aber ausschließlich CSS3 Transformationen und Transitions von modernen Browsern. So lassen sich auf einer beliebig großen Präsentationsoberfläche Position, Rotation und Größe der einzelnen Objekte festlegen. Unterstützt der Browser aber keine 3D Transitions, wird lediglich der Inhalt unterinander aufgelistet – er ist zwar so noch zugänglich, aber eben keine Slideshow mehr.

Momentan muss man die Werte leider für jedes Slide von Hand angeben, was die ganze Sache noch ein wenig mühselig macht. Aber da das Framework noch sehr jung ist, wird sich da sicherlich noch was tun.


## CSSS
Das [CSS-based SlideShow System](https://github.com/LeaVerou/CSSS) von Lea Verou setzt – wie der Name schon sagt – den Schwerpunkt bei der Umsetzung auf CSS, lediglich die Komponenten, die sich darüber nicht abbilden lassen, werden durch JavaScript unterstützt. Die Struktur der Folien bleibt dadurch schlank und das [Ergebnis](http://leaverou.me/csss/sample-slideshow.html) kann sich sehen lassen.


## Pik6
Eigentlich nur als selbstgebautes Hilfsmittel für seine HTML5-Erklärbär World Domination Tour gedacht, verfolgt [Peter Kröner](http://peterkroener.de) mit [Pik6](https://github.com/SirPepe/Pik6) einen sehr interessanten Ansatz: Durch die Verwendung von WebWorkern können mehrere Browserfenster mit der Präsentation synchron laufen. Das ermöglicht z.B. die Darstellung auf einem Projektor, während in einem anderen Fenster der Präsentationsmodus läuft, der auch separate Notizen für den Vortragenden ermöglicht. Ebenso können sich mehrere Clients die Präsentation gleichzeitig ansehen, etwa zusätzlich zur Projektion auf dem eigenen Laptop.

Praktisch für Entwickler: Automatisches Syntax-Highlighting von Quellcode ist schon direkt mit an Board.


## Reveal.js (aka CSS 3D Slideshow)

Wem Präsentationen in 2D zu langweilig sind, der sollte zu [Reveal.js](http://lab.hakim.se/reveal-js) von Hakim el Hattab greifen. Basierend auf seinem CSS-Experiment [CSS 3D Slideshow](http://hakim.se/experiments/css/slideshow/), kann man schnell gut aussehende Präsentationen erstellen, benötigt aber auch hier zur Darstellung einen aktuellen Browser, der CSS 3D Transitions und Transformationen unterstützt. Reveal.js hat aber einen netten Fallback für Browser, die keine 3D Transitions unterstützen: Dann wird dann einfach ein Fade-Effekt eingesetzt und die Slideshow bleibt weiterhin benutzbar. Die anderen [Experimente](http://hakim.se/experiments) auf seiner Seite können sich ebenfalls sehen lassen.


## HTML5 Slides
Google stellt mit seinen [HTML5 Slides](http://code.google.com/p/html5slides/) ebenfalls ein weitverbreitetes HTML-Präsentationsframework. Der Code ist dank HTML5 schön übersichtlich strukturiert, `<article>` Tags bilden die einzelnen Slides, die gängigen Präsentationselemente (einzeln eingeblendete Listenpunkte, Bilder in unterschiedlichen Größen, Codebeispiele mit Syntax-Highlighting, etc.) sind über Slide-Klassen bereits definiert.

Layouts für 4:3-Darstellung und Widescreen lassen sich über die jeweilige Klasse für die ganze Präsentation setzen … hier fehlt mir persönlich noch ein Automatismus, damit sich die Slides besser auf die Fullscreen-Darstellung anpassen.


## Weitere Frameworks
- [S5](http://meyerweb.com/eric/tools/s5/) – Eines der ersten Frameworks für HTML-Präsentation von CSS Godfather Eric Meyer
- [slides](https://github.com/briancavalier/slides) – Eine schlichte und elegante Lösung von Brian Cavalier
- [Shower](https://github.com/pepelsbey/shower) von Vadim Makeev (Opera) bietet unter anderem eine schöne Slide-Übersicht


## Fazit
Für welches Framework man sich letzten Endes entscheidet bleibt eine Frage des Geschmacks. Es wird auf jeden Fall deutlich, dass aktuelle Web-Techniken in vielen Bereichen ein hervorragender Ersatz für klassische Präsentationssoftware sein können.

---
*Update (5.01.2012)*: impress.js als neues Framework hinzugefügt.<br>
*Update (5.06.2012)*: Danke an [Francesco](http://twitter.com/isellsoap) für den Hinweis auf das Fallbackverhalten bei Reveal.js und impress.js
