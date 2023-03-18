# ReservierungsMaster21

## Teamvorstellung

* Maik Löwen (Teamleiter)
* Marc Cremer
* Christoph Josef Müller
* Adrian Nierstenhöfer
* Edgar Kinetz

---

## Projektvorstellung

Seit Ausbruch der Corona Pandemie leidet insbesondere die Gastronomie an den von Bund und Ländern beschlossenen Auflagen. Bereits seit 6 Monaten ist den Kunden der Verzehr vor Ort untersagt. Lediglich die Lieferung und Abholung mitnahmefähiger Speisen für den Verzehr zu Hause bleiben weiterhin bestehen. Das Geschäftsmodell vieler Gastronomen ist jedoch nicht auf den To-Go Betrieb ausgelegt. Diese sind darauf angewiesen, ihre Kunden vor Ort zu bedienen. Im Zuge dessen sehen sich viele ihrer Existenz bedroht, sollten nicht in absehbarer Zeit Öffnungsperspektiven vorliegen.

Mit unserer Applikation möchten wir einen Beitrag zur schrittweisen Wiedereröffnung der Gastronomie leisten. Wir verfolgen das Ziel, den Gastronomen eine digitale Anwendung zur Verfügung zu stellen, welche ihnen helfen soll, abhängig vom Inzidenzwert, auf getroffenen Maßnahmen und Regeln angemessen zu reagieren und Corona konform umzusetzen. De Facto sollen somit grundsätzliche Schließungen vermieden werden. Die Kunden können Reservierungen, Umbuchungen und Stornierungen vornehmen. Die Anwendung informiert über aktuelle Verordnungen und die entsprechenden Auswirkungen auf die Reservierung. Sollte der Inzidenzwert beispielsweise über 100 liegen, können Kunden nur einen Tisch im Außenbereich reservieren. Zudem werden die Kunden hinsichtlich der Kontaktnachverfolgung gebeten, ein Kontaktformular auszufüllen, um mögliche Infektionsketten schnell zu durchbrechen. Kunden die sich am selben Tag wie die infizierte Person im Restaurant aufgehalten haben, werden von unserer Applikation automatisch informiert und gebeten, sich in Quarantäne zu begeben und den Anweisungen des Robert Koch Instituts (RKI) Folge zu leisten. Diese Informationen können dann an die zuständigen Gesundheitsämter übermittelt werden. Zum gegenwärtigen Zeitpunkt ist dem Einzelhandel untersagt, Kunden zu empfangen, die keinen negativen Corona-Selbsttest (der nicht älter als 24 Stunden ist) oder Impfnachweis vorweisen können. Sollte diese Regelung analog für die Gastronomie übernommen werden, bietet unsere Applikation die Möglichkeit, den erforderlichen Nachweis als PDF hochzuladen. In diesem Zusammenhang wirken wir der Bürokratie entgegen, da Kunden ihre Kundendaten im Vorjahr teilweise auf Papier festhalten mussten und von den Mitarbeitern an das Gesundheitsamt übermittelt wurden.

Für die Realisierung unserer Idee benötigen wir einerseits die Kundendaten und zum anderen den aktuellen Inzidenzwert, der sich stätig ändert. Beides wird von uns gemockt, sprich die Daten werden von uns simuliert bzw. der Inzidenzwert per Zufall generiert, um eine gewisse Dynamik simulieren zu können. Künftig können wir uns auch vorstellen, die Daten zur Infektionslage von dem Robert Koch Institut (RKI) einzuholen, indem wir unsere Anwendung an eine API des RKI anbinden, um mit einer echten Datenbasis zu arbeiten. Dieses Feature sehen wir aber derzeit als “nice to have“ an und beschränken uns vorerst auf die von uns genierten Daten.

---

## ERM-Diagramm

![ERM-Diagramm_08052021.png](./static/ERM-Diagramm_08052021.png)

---

## Use Case

![Usecase-diagramm](https://github.com/marccremer/DB2/blob/main/docs/ERM%20Diagramm2_30052021.png?raw=true)

### Benutzergruppen

#### __Kunde__

Der Kunde ist der Hauptnutzer der Applikation.
Er kann Reservierungen und Stornierungen vornehmen.
#### __Admin__

Der Admin ist der Administrator der Applikationen.
Er kann Stornierungen vornehmen und den Inzidenzwert eintragen.

---

## Funktionen und Prozeduren

```sql
-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spiel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Spiel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToUser_AB_unique" ON "_ItemToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToUser_B_index" ON "_ItemToUser"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToUser" ADD CONSTRAINT "_ItemToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;


```

---

## Trigger

    * Automatische Stornierung der Reservierung bei Überschreitung der Inzidenz 
    * Automatische Änderung des Datensatzes anzahlTische in Raum, wenn Insert bei Tisch 
    * Automatische Reduzierung der Plätze am Tisch, wenn die Inzidenz eine bestimmte Zielmarke erreicht hat 

  INSERT MORE TRIGGERS HEREE

---

## Views

    * Kunden zum aktuellen Zeitpunkt im Restaurant

---
