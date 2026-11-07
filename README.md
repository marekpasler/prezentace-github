# GitHub & GitHub Pages – prezentace

Prezentace na seminář programování (15–20 min). Sama běží na GitHub Pages: https://marekpasler.github.io/prezentace-github/

- Na školním PC s vypnutými animacemi ve Windows otevři https://marekpasler.github.io/prezentace-github/?motion (jinak prohlížeč animace vypne).
- Ovládání: → / mezerník / klik / klikátko (PageDown) = další krok, ← = zpět, F = celá obrazovka, B = záznam dema, H = nápověda.
- Scénář a co říkat: [SCRIPT.md](SCRIPT.md). Pravidla designu: [CLAUDE.md](CLAUDE.md).
- Data (`data/`) jsou snímek skutečného `git log` plesového webu: `node tools/extract-data.mjs ../plesoktava` (jen čte, nic v něm nemění).
- Offline: celá složka funguje bez internetu (GSAP i písma jsou ve `vendor/`). Otevři přes lokální server, např. `npx http-server .`
- Záložní video dema ulož jako `assets/demo.mp4`.
