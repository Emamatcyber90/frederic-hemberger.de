---
layout: post.hbs
title:  Einführung in Node.js
date: 2011-08-16
update: 2014-01-06
---

Node.js wird gerne als "serverseitiges JavaScript" bezeichnet, allerdings ist das technisch nicht so ganz korrekt: Node.js ist eine eventbasierte JavaScript-Laufzeitumgebung auf Basis von Googles V8-Engine (die auch die JavaScript-Basis für Google Chrome bildet). Was bedeutet das genau?

Normalerweise wird in den meisten Programmiersprachen Programmcode sequenziell abgearbeitet, das heißt eine neue Anweisung im Code wird erst dann begonnen, wenn die vorausgegangene Anweisung vollständig abgearbeitet ist. Wenn hingegen Vorgänge nebenläufig durchgeführt werden sollen, greifen Programmiersprachen wie z.B. Java auf sogenannte Threads zurück: Die nebenläufige Aufgabe wird angestoßen und durch einen separaten Prozess ausgeführt, während der vorhergehende Code weiterläuft. Das Problem dabei: Jeder zusätzliche Thread verbraucht sowohl CPU-Zeit als auch Speicherplatz im RAM, was bei vielen gleichzeitigen Threads zu Performance- und Skalierungsproblemen führen kann.

Node.js hingegen arbeitet mit einem einzigen Thread und verarbeitet den Code eventbasiert. Was das bedeutet, kennt man teilweise schon aus dem normalen clientseitigen JavaScript, wenn es z.B. um DOM-Events geht. Hier ein Beispiel in jQuery:

``` javascript
$('button').click(function(){
    alert('Hallo Welt!');
});
```

Die Aktion wird im Vorfeld definiert, was daraufhin aber geschehen soll kommt erst dann zum Tragen, wenn das Ereignis tatsächlich ausgelöst wird.


## Was hat diese Arbeitsweise für Vorteile in Node.js?
Wie bereits zu Anfang erwähnt, wird in vielen Sprachen die weitere Ausführung von Code geblockt, bis eine Anweisung verarbeitet wurde. Dies betrifft nicht nur einfache Operationen, sondern auch z.B. Zugriffe auf das Dateisystem, Datenbankanfragen, Web-Services, etc. All diese Operationen blockieren die weitere Verarbeitung.

Auf den ersten Blick scheint das nicht weiter problematisch zu sein. Wenn man sich das aber mal in Rechenzyklen vorstellt, bekommt dieses Vorgehen schon ganz andere Dimensionen. Ich glaube, Ryan Dahl (der Entwickler von Node.js) hat dafür einmal folgendes Beispiel genutzt:

> Man stelle sich vor, ein ausgeführtes Programm, ist eine Person, die bei sich im Büro am Schreibtisch arbeitet. Benötigt das Programm Informationen aus dem Level2-Cache, entspricht das in etwa dem Öffnen der Schreibtischschublade in dem die Informationen liegen. Für Daten aus dem RAM muss man schon von seinem Platz aufstehen, zur gegenüberliegenden Seite des Büros laufen und die Informationen dort aus einem großen Aktenschrank rausholen und sich wieder an seinen Platz begeben.
>
> Greift man hingegen auf Daten von der Festplatte zu, steht man auf, verlässt das Büro und das Gebäude, setzt sich in ein Taxi, fährt zum Flughafen, nimmt die nächste Maschine nach Tokio, holt dort die Informationen ab und fliegt wieder zurück.

In all dieser Zeit bleibt die eigentliche Arbeit liegen, da immer noch auf die Information aus Tokio gewartet wird. Da man grade unterwegs ist, die Daten zu beschaffen, kann man auch in der Zwischenzeit keine anderen Arbeiten erledigen (z.B. Anrufe im Büro annehmen).

Aus diesem Grund sind solche Operationen in Node.js grundsätzlich "nicht blockierend" und werden wie z.B. aus dem DOM bekannt eventbasiert ausgeführt. Das gilt für Zugriffe auf das Dateisystem, Datenbanken, Netzwerk-Verbindungen, etc. Und das ist eigentlich auch der Part, an den man sich als Node.js-Einsteiger ein wenig gewöhnen muss.

Solche Anweisungen wie

``` javascript
var myfile = fs.readFile('myfile.txt', 'utf8');
console.log(myfile);
console.log('Fertig!');
```

wird man so in der Regel in Node.js nicht finden, stattdessen werden Callback-Funktionen verwendet:

``` javascript
fs.readFile('myfile.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});
console.log('Fertig!');
```

Das bedeutet also in diesem Fall auch, dass wir auf der Konsole zuerst "Fertig!" sehen und dann erst den Inhalt der Datei. Dessen muss man sich bei der Entwicklung bewusst sein. Das wird vor allem dann schnell ein wenig wuselig, wenn man beispielsweise Kombination hat wie: 
Warte auf eine Datei, die per Webformular hochgeladen wird, lese diese Datei dann ein und schreibe deren Inhalt in eine Datenbank. Hier muss man also darauf achten, wann welche Daten tatsächlich zu Verfügung stehen, bevor man sie weiterverarbeiten kann.


## Und wofür kann ich Node.js verwenden?
Für die Auslieferung einfacher statischer Inhalte tut es nach wie vor ein gewöhnlicher Webserver, dafür wäre Node.js kein Gewinn, ebenso wie bei rechenlastigen Apps. Wo es allerdings seine Stärken ausspielen kann, sind die Bereiche, in denen seine eventbasierte Art zum Tragen kommt. Also bei Datenverarbeitung wie beispielsweise bei (JSON) APIs oder Streaming. So können z.B. mit Node.js Videofilme schon beim Hochladen auf einen Server in ein anderes Format transkodiert werden oder Clients über WebSockets (bzw. sockets.io) mit aktuellen Daten versorgt werden.

Aber auch für Kommandozeilenprogramme und Shellscripte lässt sich Node.js verwenden, etwa für Buildtools oder zur Datenverarbeitung.

Node.js selbst ist vom Umfang her sehr rudimentär, bringt aber alle grundlegenden Bausteine mit, aus denen man eine ganze Menge ausbauen kann, etwa: Events, Buffer, Streams, TLS/SSL, Dateisystem-Zugriff, DNS, UDP und HTTP. Es ist auch bewusst das Ziel der Entwickler, den eigentlichen Kern schlank zu halten und sich auf das Wesentliche zu konzentrieren.

Man kann also mit wenigen Zeilen Code von Hand seinen eigenen Webserver schreiben (quasi das "Hello World" in fast allen Node.js-Tutorials), für weiterführende Aufgaben ist das natürlich wenig praktikabel. Es gibt zum Glück eine sehr aktive Community, die Module für fast alle Themen zu Verfügung stellt, etwa für Datenbank-Anbindungen, API-Handler, Parser, Template-Engines und vieles vieles mehr, wie etwa das Web-Framework "Express", das quasi zum Standard geworden ist.

Am besten bekommt man ein Gefühl für Node.js, wenn man es direkt selber ausprobiert: Die Node.js-Website bietet einfache [Installer für Windows und Mac](http://nodejs.org/download/), Ubuntu-Nutzer installieren Node am besten über die [PPA von Chris Lea](https://launchpad.net/~chris-lea/+archive/node.js/), da dies immer up-to-date ist.


## Links:
- [Node.js](http://nodejs.org)
- [NPM](http://npmjs.org)
- [Felix's Node.js Guide](http://nodeguide.com/index.html)
- [Node Beginners Book](http://www.nodebeginner.org/)
- [Mastering Node.js (Free E-Book)](http://visionmedia.github.com/masteringnode/)
- [Express](http://expressjs.com)
