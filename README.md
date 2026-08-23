# Hermes AI Team — Course Files

De praktische bestanden uit de Nederlandse Hermes-cursus: van een lege installatie naar vijf gespecialiseerde AI-operators, herbruikbare skills, een second brain, deep research, websites en Mission Control.

> Deze repository bevat bewust **niet** de Static Ad Engine.

## Wat zit erin?

- Vijf veilige voorbeeldprofielen: Orchestrator, Researcher, Strategist, Builder en Reviewer
- Intelligence Radar voor een eerste volledige teamrun
- Operator Team Workflow om een geslaagde run herbruikbaar te maken
- Hermes Mission Control Builder
- Obsidian/second-brain-workflow
- YouTube-video naar skill/agent
- Brandkit-workflow
- Paper MCP-designworkflow
- Hermes- en website-SOP
- Invulbare Soul.md- en second-brain-prompts

## Snel starten

1. Installeer en open Hermes.
2. Maak eerst een aparte OpenRouter API-key aan.
3. Clone deze repository:

   ```bash
   git clone https://github.com/novusordos666/hermes-ai-team-course.git
   cd hermes-ai-team-course
   ```

4. Installeer de cursusskills:

   ```bash
   ./install.sh
   ```

5. Kopieer de gewenste voorbeelden uit `profiles/` naar nieuwe Hermes-profielen. Neem nooit tokens, sessie-ID's of persoonlijke configuratie over.
6. Vul `templates/SOUL.template.md` en `templates/second-brain-prompt.md` in met je eigen bedrijfscontext.

## Aanbevolen volgorde

1. `sops/hermes-sop.md`
2. `templates/SOUL.template.md`
3. `skills/intelligence-radar/`
4. `profiles/`
5. `skills/operator-team-workflow/`
6. `skills/obsidian/`
7. `skills/youtube-content/`
8. `skills/brandkit/`
9. `sops/website-sop.md`
10. `skills/paper-mcp-design-workflows/`
11. `skills/hermes-mission-control-builder/`

## Veiligheid

- Commit nooit `.env`, API-keys, Telegram-tokens, authbestanden, sessies of persoonlijke Hermes-config.
- Gebruik afzonderlijke keys per project en trek een key direct in als die zichtbaar is geweest.
- Laat de Reviewer altijd controleren voordat je publiceert, verstuurt, koopt, verwijdert of productieconfiguratie wijzigt.
- De meegeleverde profielen zijn generieke templates; ze bevatten geen privédata uit de opnameomgeving.

## Uitsluiting

De Static Ad Engine, bijbehorende prompts, scripts, templates en afgeleide bestanden zijn expliciet uitgesloten van deze repository.

