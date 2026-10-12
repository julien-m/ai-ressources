# Conventions

- Si le repo a un dossier `.conventions/`, lis `.conventions/index.md` avant de coder ou de concevoir, puis seulement les fichiers sources du sous-domaine concerne (lignes `→`, prefixe de dossier valable pour toute la ligne), en appliquant les exclusions `⊘`. Pour un sujet hors index, consulte `~/projects/ai-ressources/index.yaml`.
- Un sous-agent qui code ou concoit recoit le contenu de ces conventions dans son brief.
- Si `.conventions/` manque alors que le projet contient du code ou du design, ou s'il est a l'ancien format (sans `manifest.yaml`, avec des fichiers compiles comme `design.md`), propose une fois `/conventions-init` ou `/conventions-refresh --full`, sans bloquer.
- Conventions transverses : avant de creer, renommer ou supprimer un fichier, lis `~/projects/ai-ressources/conventions/naming.md` ; en cas de conflit entre conventions, `~/projects/ai-ressources/conventions/authority.md` ; pour un diagramme, un flow ou des criteres d'acceptation, `~/projects/ai-ressources/conventions/diagrams.md`.
