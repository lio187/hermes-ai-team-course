---
name: operator-team-workflow
description: Zet een bewezen vijf-agentenrun om in een herhaalbare workflow met expliciete handoffs en reviewgates.
---

# Operator Team Workflow

## Input

- Eén concrete opdracht
- Doelgroep en gewenste uitkomst
- Beschikbare context en bronnen
- Randvoorwaarden
- Een toetsbare definitie van “klaar”

## Uitvoering

1. Orchestrator maakt taken voor Researcher, Strategist, Builder en Reviewer.
2. Iedere taak bevat scope, input, outputbestand, afhankelijkheden en completion condition.
3. Research moet klaar zijn voordat Strategie start.
4. Strategie moet gekozen zijn voordat Builder start.
5. Reviewer werkt onafhankelijk nadat Builder klaar is.
6. Bij `CHANGES_REQUESTED` gaat alleen de benodigde correctie terug naar Builder.
7. Orchestrator geeft de eindsamenvatting met bewijs, open risico's en volgende actie.

## Completion contract

De workflow is pas klaar wanneer:

- alle outputs bestaan;
- geen taak geblokkeerd of stilgevallen is;
- Reviewer `APPROVED` geeft;
- de oorspronkelijke succesregel aantoonbaar gehaald is; en
- externe acties nog steeds achter een menselijke greenlight staan.

