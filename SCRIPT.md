# Skript: GitHub & GitHub Pages

**Ovládání:** → nebo klik na klikátko = další krok, ← = zpět, B = záloha dema (video, které jsem si natočil). Na školním PC otevřít `https://marekpasler.github.io/prezentace-github/?motion` a dát celou obrazovku (F11). Cíl je 17 až 18 minut při tempu kolem 130 slov za minutu. Značky ve skriptu: [KLIK] = jeden stisk, [KLIK → další slide] = poslední stisk na slidu, [pauza 2 s] = počkat, závorky = co dělat, nahlas nečíst.

## 1. Úvod — 00:00

Ahoj, jsem Marek. Dneska mluvím o GitHubu a GitHub Pages. Nebudu z toho dělat teorii, budu ukazovat věci, které jsem sám dělal.
[KLIK]
(film běží 10 s, mlčím a nechám ho doběhnout)
Tohle, co jste právě viděli, se doopravdy stalo. Napsal jsem git push. Moje změna odjela z mého počítače na GitHub a odtamtud rovnou na web. A tohle je ten web: stránka našeho maturitního plesu, třídy 8.A8, téma Matrix. Běží zadarmo a nonstop a nasadil jsem ho jedním příkazem. Do konce prezentace budete vědět, jak na to. Já jsem to zjišťoval sám a trvalo mi to dlouho, vy to zvládnete za pár minut. Nejdřív ale potřebujete vědět, proč to vůbec existuje. Bez toho je ten příkaz jen kouzlo, které funguje, a vy nevíte proč.
[KLIK → další slide]

## 2. final_final.zip — 00:54

Kdo z vás má na disku něco takového? (zvednout ruku, počkat na ruce) Ať se nikdo nestydí. Taky jsem to měl.
[KLIK]
(čtyři soubory naskočí, poslední má červený rámeček)
Web.zip, web_final.zip, web_final2.zip a web_OPRAVDU_final.zip. Tohle vznikne, když na něčem pracuje víc lidí, nebo jeden člověk po nocích. Teď si představte pět lidí, každý má jinou verzi a každý si myslí, že jeho je ta správná. Kdo má tu poslední? Nikdo. A ten, kdo to pak slučuje ručně, nemá dobrou náladu. Nejhorší na tom je, že nikdo přesně neví, co která verze obsahuje. Není to jen o souborech. Je to hádání.
[KLIK → další slide]

## 3. Příběh GitHubu — 01:44

Krátká historie, ať víte, odkud to je.
[KLIK]
(film 28 s, šest kapitol po 4,5 s; každou větu začnu, až se kapitola ustálí)
Rok 2005. Git napsal Linus Torvalds, protože potřeboval nástroj pro vývoj jádra Linuxu.
2008. GitHub se otevřel veřejnosti. Git, ale v cloudu.
2018. Microsoft GitHub koupil za 7,5 miliardy dolarů, zaplatil v akciích.
2019. Přišly Actions. Po každém pushi se web sám sestaví a nasadí.
2021. Copilot, zatím jako technický náhled. AI, která doplňuje kód.
A 2025: podle zprávy Octoverse přes 180 milionů vývojářů. V průměru víc než jeden nový za sekundu.
[pauza 2 s]
Git vznikl pro jeden velký projekt, jádro Linuxu. Dneska ho používají všichni, kdo něco programují, včetně mě. Většina lidí si pod Gitem ve skutečnosti představí GitHub.
[KLIK → další slide]

## 4. Git vs GitHub — 02:29

Zjednodušeně: Git je foťák v tvém počítači a GitHub je album na internetu. Prázdné místo v albu vidíte na slidu.
[KLIK]
(snímek přeletí z Gitu do alba)
Přesněji: Git je program, který ukládá snímky projektu přímo do vaší složky. Tomu snímku se říká commit. GitHub je služba na serveru, kam ty repozitáře nahrajete. Přidává k tomu spolupráci, pull requesty a Pages. Git funguje i bez internetu, GitHub bez Gitu ne. Lidi často mluví o GitHubu jako o všem dohromady. Proto to rozlišuju hned na začátku, ať se to pak neplete.
[KLIK → další slide]

## 5. Jak jsem to dělal dřív — 03:07

Jak jsem to dělal dřív? Poslal jsem web mailem jako zip. Furt dokola.
[KLIK]
Pak přišel Google Disk. Už lepší.
[KLIK]
GitHub. Tady to začíná dávat smysl.
[KLIK]
A GitHub Pages, to je dnešní téma. Mozek na obrázku se rozsvítil úplně. Každý krok je pohodlnější než předchozí, a to je celý smysl. Mezi zipem a GitHub Pages je jen pár kroků, ne pět věcí k zapamatování.
[KLIK → další slide]

## 6. Repozitář — 03:36

Tohle je složka plesoktava. Vypadá jako každá jiná. Nahoře máte assets, CNAME, apple-touch-icon.png, event.ics, soubor google s příponou html, index.html a og-image.jpg.
[KLIK]
(rozbalit assets: fonts, img, vendor)
Uvnitř assets jsou fonty, obrázky a knihovny. Složka vendor obsahuje cizí kód, ten jsem nepsal.
[KLIK]
(rozbalit img: portrétové a plakátové soubory)
V img jsou portréty a plakáty. Jsou to jen soubory, nic víc. A teď to hlavní.
[KLIK]
(uvnitř se objeví .git: HEAD, objects/, refs/)
Uvnitř je skrytá složka .git. Tady je ta paměť. Jsou tam všechny verze souborů, všechny commity a názvy větví. Když ji smažete, přijdete o historii, takže ji nemažte. Jsou to obyčejné soubory v zvláštním formátu, který nemá smysl číst očima.
Zjednodušeně: .git je paměť projektu. Přesněji: je to databáze. Obsahuje objekty, tedy soubory, složky a commity, a reference, tedy názvy větví, které ukazují na konkrétní commit. Do té složky ručně nesahejte.
[KLIK → další slide]

## 7. Commit — 04:34

Commit je jako uložená pozice ve hře. Podívejte se na jeden řádek v index.html. Starý text zněl: Lístky prodáváme osobně ve škole, nebo se domluv s někým z 8.A8.
[KLIK]
(řádek se přepíše na nový text)
Nový text zní: ve škole (p02), nebo napiš na @8a8.gkolin. Řádek jsem změnil a uložil.
[KLIK]
(razítko: hash 9cc712d, zpráva prodej listku zahajen, 4.11.2026)
Commit dostane otisk, takzvaný hash, konkrétně 9cc712d. K tomu zprávu: prodej listku zahajen. Zprávu jsem napsal bez háčků a čárek. Byla to chyba, ale zpráva v historii zůstane. Podle hashe Git pozná, že je to právě tenhle snímek. Dva různé snímky nemají stejný otisk, aspoň ne prakticky.
[KLIK]
(diff obou řádků: starý text je pryč, nový je tam)
Git uloží snímek celého projektu. Diff si jen dopočítá.
Zjednodušeně: commit je snímek. Přesněji: je to snímek celého stromu souborů, odkaz na předchozí commit, jméno autora a zpráva. Identifikuje se SHA-1 hashem. SHA-256 je zatím experimentální.
[KLIK → další slide]

## 8. Undo pro celý projekt — 05:32

Každý z vás zná Ctrl+Z. Tady je to ve Wordu, vlevo. Já jsem to v jednom projektu zmáčkl tolikrát, že jsem přestal počítat.
[KLIK]
(počítadlo jde od nuly do tří set)
Nula, sto, tři sta. A pořád nevím, kde jsem byl.
[KLIK]
(vpravo: git revert HEAD)
V Gitu to je jinak. Napíšete git revert HEAD. Jeden příkaz, který vytvoří nový commit s opačnou změnou. Historie zůstane celá. Nic se neztratí, ani ta špatná změna. Právě proto je to nejbezpečnější způsob, jak vrátit chybu na hlavní větvi.
Zjednodušeně: revert je undo. Přesněji: revert nepřepisuje historii, vytvoří nový commit, který změnu vrátí. Git reset je jiný příkaz a historii přepisuje, proto je na sdílené větvi nebezpečný.
[KLIK → další slide]

## 9. Historie webu — 06:18

Tady je moje historie za třicet dní. Čtyřicet dva commitů od 7. 10. do 6. 11. 2026. Časová osa je skutečná. Nic jsem si nevymyslel. Stačí spustit git log a uvidíte totéž, jen ten výpis bude delší. Tohle není reklama na commity. Je to jen záznam toho, co se stalo.
[KLIK]
Sedmého října v 21:10 jsem dal první commit. Celý web, 618 řádků.
[KLIK]
Třináctého října mezi 13:59 a 14:02 jsem dělal Create, Delete, Create CNAME. Tři a půl minuty boje s vlastní doménou. Smazal jsem soubor a vytvořil ho znovu, protože jsem nevěděl, co dělám.
[KLIK]
Čtrnáctého října v 23:05 oprava v noci. Patička stránky týden ukazovala rok 2027. Opravil jsem to na 2026. Za chybu se nestydím, ale v historii zůstane.
[KLIK → další slide]

## 10. Co uvidí učitel, když otevře můj repozitář — 07:14

Tohle je git log z večera 14. 10. Commity od 21:07 do 23:05. Podívejte se, většina se jmenuje Update index.html. Pane učiteli, vy to asi viděl jako první.
[KLIK]
(zvýraznit řádek 23:05)
Tady je ten 23:05, ten s patičkou. Zpráva nic neříká. Není to katastrofa, jen to vypadá špatně, a v repozitáři to zůstane.
[KLIK]
(terminál: git log --oneline --grep="Update index.html" | wc -l, výsledek 19)
Spočítal jsem to takhle: git log, oneline, grep na Update index.html a wc -l. Výsledek je 19. Devatenáct ze čtyřiceti dvou commitů se jmenuje stejně. Zprávy commitů jsou veřejné a zůstanou. Pište je tak, aby je pochopil i někdo, kdo na projektu nikdy nebyl. Je to jako pověsit deník na nástěnku ve škole. Já jsem ho tam pověsil sám.
[KLIK → další slide]

## 11. Kdo to rozbil? — 08:04

Teď nepříjemnější část. git blame ukazuje, kdo naposledy změnil který řádek. Tady jsou tři řádky z index.html.
[KLIK]
(zvýraznit autora marekpasler na všech řádcích)
Podívejte se na autora. Na každém řádku stejné jméno: marekpasler.
[KLIK]
(velký text: 818 z 818 řádků index.html jsem napsal já.)
Dalo by se to říct i takhle. 818 z 818 řádků index.html jsem napsal já. Zjednodušeně: blame hledá viníka. Přesněji: ukazuje poslední commit, který daný řádek změnil. Neříká proč. Na to se musíte podívat do zprávy commitu. Takže blame není trest. Je to mapa, kdo a kdy co napsal. Vy si to můžete zkusit na libovolném souboru ve svém repozitáři, nic se tím nerozbije.
[KLIK → další slide]

## 12. Větev = ukazatel na commit — 08:46

Větev je ukazatel na commit, který se posouvá s každým novým commitem. Tohle je ilustrace. Větev nove-menu jsem si pro ukázku vymyslel, moje reálná historie takhle nevypadá.
[KLIK]
(větev nove-menu roste, HEAD jede s ní)
Vytvořím novou větev a dělám v ní změny. HEAD je místo, kde právě jsem. Když přepnu větev, HEAD jede se mnou.
[KLIK]
(merge commit se dvěma rodiči)
Až je hotovo, větev se vrátí do main. Vznikne merge commit a ten má dva rodiče. Dvě linie se spojí do jedné.
[KLIK]
(karta: Konflikt, obě větve změnily stejný řádek: <<<<<<< HEAD, =======, >>>>>>> nove-menu)
A teď konflikt. Dvě větve změnily stejný řádek a Git nemá jak rozhodnout, co chcete. Na kartě vidíte značky, a musíte vybrat vy. Vyřešíte to tak, že značky smažete, necháte text, který chcete, a uděláte commit.
Zjednodušeně: větev je ukazatel. Přesněji: jméno, které ukazuje na konkrétní commit. HEAD je ukazatel na místo, kde právě jste. Merge commit má dva rodiče. Konflikt nastane, když obě větve změnily stejné řádky.
[KLIK → další slide]

## 13. Pull request = „mrkni mi na to“ — 09:50

Zjednodušeně: pull request je „mrkni mi na to“. Přesněji: návrh, aby se větev sloučila do jiné, s review a s automatickými kontrolami. Tahle karta je ilustrace. Nové menu z větve nove-menu chci dostat do main. Běží kontroly, třeba testy nebo build. Člověk do toho nezasahuje, dokud nejsou zelené.
[KLIK]
(kontroly prošly, reviewer schválil, tlačítko Merge je aktivní)
Kontroly prošly. Reviewer schválil změny. Tlačítko merge se rozsvítilo.
[KLIK]
(fialové Merged)
Merged. Hotovo. Větev nove-menu je v main a nové menu se tím dostalo na web. Pull request je funkce GitHubu, ne Gitu. Git sám o pull requestech neví.
[KLIK → další slide]

## 14. Open source: fork a hvězdička — 10:29

Tady je karta repozitáře. Hvězdiček nula, forků nula. Ilustrace, čísla nejsou živá.
[KLIK]
Dám hvězdičku. Jedna. Hvězdička je záložka pro sebe, ale taky ukazuje, co lidi považují za užitečné. Takhle to dělají lidi, kterým se něco líbí.
[KLIK]
(objeví se kopie vas-ucet/plesoktava)
Forkem si udělám kopii na svůj účet. Můžu v ní cokoliv upravit a nikoho to nerozbije.
[KLIK]
(šipka zpět: pull request zpátky)
Upravím to a pošlu zpátky jako pull request. Takhle funguje open source: vezmu kopii, upravím ji a navrhnu změnu autorovi. Autor se rozhodne, jestli to vezme. Do jeho projektu nikdo nesahá bez svolení, což je fér.
[KLIK → další slide]

## 15. GitHub v číslech — 11:10

Pár čísel z Octoverse 2025, to je roční report GitHubu. Přes 180 milionů vývojářů. 630 milionů repozitářů. Skoro miliarda commitů za jediný rok. Čísla se každý rok mění, takže až si je budete dohledávat, budou jiná. Já jsem použil report z roku 2025. Na slidu je odhad, tak si ho neplette s oficiálním číslem.
Zvedněte ruku, kdo z vás má účet na GitHubu. (počkat na ruce, ukázat na počítadlo v rohu)
Počítadlo je odhad. Počítá, kolik nových vývojářů přibylo od začátku tohohle slidu, podle průměru víc než jeden za sekundu. Jen odhad, ne měření.
[KLIK → další slide]

## 16. GitHub Pages = web z repozitáře — 11:59

Tohle jsou soubory z repozitáře: index.html, CNAME, event.ics, og-image.jpg a složka assets. A tohle je prázdné okno prohlížeče na adrese 8a8.gkolin.cz.
[KLIK]
(soubory přeletí do okna, objeví se náhled plesového webu)
Pages vezme soubory z repozitáře a servíruje je jako web. Zdarma, s HTTPS. Výchozí adresa je jméno.github.io. Nebo si připojíte vlastní doménu, tu řídí soubor CNAME. Ten web, co vidíte, už běží, a neběží na mém notebooku. Běží na serverech GitHubu. Žádný server jsem nekupoval a nic jsem neplatil. Pages je zdarma v rámci limitů, které uvidíte později. Potřebujete jen účet a repozitář s HTML soubory.
Zjednodušeně: repozitář se stane webem. Přesněji: Pages servíruje statické soubory z vybrané větve nebo složky, a vlastní doména se na ně napojí přes CNAME a DNS záznam.
[KLIK → další slide]

## 17. Od pushe k živému webu — 12:52

Co se stane po git push? Podívejte se na tři bloky.
[KLIK]
(git push hotový, GitHub Actions běží žlutě)
Push je hotový. Teď běží GitHub Actions. Je to soubor YAML ve složce .github/workflows. Spustí se při každém pushi, běží na cizím počítači, takzvaném runneru, nahraje hotový web jako artefakt a nasadí ho. Když něco spadne, uvidíte červený křížek a log s chybou.
[KLIK]
(Actions hotové, nasazení běží)
Actions doběhly. Web se nasazuje.
[KLIK]
(všechny bloky zelené, web je živě na 8a8.gkolin.cz)
Web je živě. U plesového webu to ale dělám jinak. Mám nastaveno Deploy from a branch, a pod tím GitHub stejně pustí workflow pages-build-deployment. Tahle prezentace má vlastní workflow.
Zjednodušeně: push spustí nasazení. Přesněji: workflow běží na runneru, nahraje artefakt a nasadí ho. Při větvi se na pozadí pustí stejný mechanismus, jen ho nevidíte ve vlastním souboru.
[KLIK → další slide]

## 18. Vlastní web za pár minut — 14:06

Jestli chcete mít vlastní web, postup je krátký.
[KLIK]
(krok 1 se rozsvítí)
Jedna. Založit účet na github.com.
[KLIK]
(krok 2 se rozsvítí)
Dva. New repository.
[KLIK]
(krok 3 se rozsvítí)
Tři. Nahrát index.html. Hotovo, soubor se dá otevřít. Chcete hezčí web? Přidáte další soubory a znovu pushnete.
[KLIK]
(krok 4 se rozsvítí, dole vas-ucet.github.io)
Čtyři. Settings, Pages, Deploy from a branch. Pak to bude na adrese vas-ucet.github.io. Zvládnete to ještě dnes večer, bez jediného příkazu v terminálu.
Jen na čtvrtý krok nezapomeňte. Já jsem na něj zapomněl a hodinu jsem koukal na chybovou stránku. Pokud to nefunguje, zkontrolujte, jestli je soubor index.html v kořeni repozitáře a jestli je nastavená správná větev.
[KLIK → další slide]

## 19. Živé demo — 14:47

Teď to zkusíme naživo. Co tam mám napsat? Řekněte mi jednu větu, co změním na plesovém webu. (počkat na návrh, vybrat jeden)
Dobře, tohle je dobrý nápad. Přepínám do editoru.
(alt+tab, otevřít index.html)
Změním jeden řádek, ten, co jste navrhli.
(v terminálu napsat a potvrdit `git add .`, pak `git commit -m "živě z hodiny"`, pak `git push`)
Push odešel. Otevírám záložku Actions. Deploy trvá asi minutu. Mezitím se vrátím do prezentace. Zatím nic nespadlo, to je dobré znamení.
[KLIK]
(s1: meme „U mě to funguje.“)
Tady máte meme. U mě to funguje.
[KLIK]
(s2: „Tak pošleme do produkce tvůj počítač.“ a notebook zabalený v krabici PRODUKCE)
Tak pošleme do produkce tvůj počítač. Tohle dělá Docker. Zabalí aplikaci i s prostředím, takže běží všude stejně. Pro náš web to není potřeba, Actions to řeší za nás. Kdybyste chtěli Docker, je to na jiný seminář.
(alt+tab do prohlížeče, obnovit stránku, změna je živě)
Vidíte, je to živě. Teď to vrátím zpátky.
(v terminálu `git revert HEAD`, pak `git push`)
Git revert HEAD, pak push. Jeden příkaz, nový commit, který změnu vrátí. Web je zase původní.
(Pokud by nešlo Wi-Fi: stisknout B a říct: „Pro jistotu jsem si to natočil.“)
[KLIK → další slide]

## 20. Na co Pages je a na co ne — 16:43

Co na Pages jde? Ano: plesový web, portfolio, dokumentace, tahle prezentace. Všechno, co je statické, tedy HTML, CSS a JavaScript.
[KLIK]
Ne: databáze, přihlašování, PHP. Na to potřebujete server nebo jinou službu.
[KLIK]
(karta: Web max. 1 GB, přenos 100 GB za měsíc (měkký limit), zdroj GitHub Docs)
Limity najdete v dokumentaci GitHubu. Web má maximálně 1 GB. Přenos 100 GB za měsíc je měkký limit. Pro plesový web víc než dost. Kdybych chtěl databázi, musel bych si pořídit server nebo cloudovou službu. To je rozdíl mezi statickým a dynamickým webem. Dynamický web něco počítá při každém kliknutí. Statický jen vydá hotový soubor.
Zjednodušeně: statický web znamená, že server nic nepočítá a jen posílá soubory. Přesněji: prohlížeč si spustí JavaScript sám a server vydá hotový soubor.
[KLIK → další slide]

## 21. Copilot navrhuje, já rozhoduju — 17:39

Tady je soubor soucet.js. Prázdný, to je začátek.
[KLIK]
(napíšu komentář)
Napíšu komentář: vrať součet všech čísel v poli.
[KLIK]
(šedý návrh: function soucet(pole) { return pole.reduce((a, b) => a + b, 0); })
Šedý text je návrh od Copilotu. Funkce soucet, pole, reduce, a nula na začátku. Vypadá to dobře, ale musím to přečíst.
[KLIK]
(Tab, návrh přijat)
Zmáčknu Tab a přijmu ho. Zodpovědnost za kód ale zůstává na mně. Vždycky si přečtěte, co přijímáte. Návrh někdy vypadá správně a přesto selže, třeba na prázdném poli. Proto ho spustím, než ho nechám v projektu. Pokud je návrh delší, než čekáte, je to signál, že si ho máte přečíst dvakrát.
Zjednodušeně: Copilot píše kód za vás. Přesněji: navrhuje doplnění podle kontextu. Nekontroluje, jestli je správně, a za chyby neručí.
[KLIK → další slide]

## 22. Student Pack a odhalení — 18:33

GitHub Student Developer Pack. Dostanete GitHub Pro zdarma, dokud studujete. Copilot Student pro ověřené studenty, s limity. A doménu na rok zdarma u partnerů. Ověření studenta je na webu GitHubu, ať to nemusím popisovat přesně.
[KLIK]
Stav je k listopadu 2026 a nabídky se mění, takže si to ověřte přímo na GitHubu.
[KLIK]
(zoom ven: prezentace v okně prohlížeče, QR kód)
Tahle prezentace je taky web na GitHub Pages. Teď se to zmenší do okna prohlížeče. Naskenujte si QR kód, adresa je marekpasler.github.io/prezentace-github. Kdo chce, ať si to pak projde doma, všechny kroky jsou tam, kde jsem je ukazoval. Děkuju. Máte otázky?

---

## Otázky

**1. Proč nasazení přes Actions a ne přímo z větve?**
Actions umožní krok sestavení, takzvaný build, ještě před nasazením. Deploy z větve prožene soubory Jekyllem, proto mám v repu .nojekyll.

**2. Merge, nebo rebase?**
Merge vytvoří commit se dvěma rodiči a historie zůstane taková, jaká byla. Rebase přepíše commity na nový základ. Na sdílené větvi ne.

**3. Co dělá git push --force a čím ho nahradit?**
Přepíše historii na serveru. Místo toho použiju git push --force-with-lease. Ten přepíše jen tehdy, když se větev na serveru od mého posledního fetch nezměnila. Chybu na main opravuju revertem.

**4. Jak funguje vlastní doména?**
V repu je soubor CNAME s názvem domény. U registrátora nastavím DNS záznam CNAME na jméno.github.io. V nastavení Pages zapnu Enforce HTTPS.

**5. Proč ne Vercel nebo Netlify?**
Umí serverové funkce a náhledy pro každý pull request. Na statický web stačí Pages.

**6. Je veřejné repo bezpečné?**
Kód vidí každý. Proto v repu ani ve frontendu nejsou hesla ani klíče.

Když se zeptá na něco, co neznáte: „Tohle jsem v praxi nezkoušel, ale dohledám to.“

## Zdroje

- GitHub, Octoverse 2025 (výroční report, octoverse.github.com): přes 180 mil. vývojářů, 630 mil. repozitářů, téměř miliarda commitů za 2025.
- GitHub Docs, sekce GitHub Pages: limity webu (1 GB, 100 GB přenosu za měsíc, pouze statický obsah), vlastní doména, Enforce HTTPS (docs.github.com).
- GitHub Docs, GitHub Actions: workflow, runner, artefakty, nasazení Pages (docs.github.com).
- GitHub Docs, GitHub Student Developer Pack (education.github.com).
- Git SCM, dokumentace příkazů git revert, git reset, git push --force-with-lease (git-scm.com/docs).
- Scott Chacon a Ben Straub, Pro Git, kapitoly o commitech, větvích a objektech (git-scm.com/book).
- GitHub Blog, historie GitHubu (2008 spuštění, 2018 akvizice Microsoftem, 2019 Actions, 2021 Copilot) (github.blog).
- Linus Torvalds, vznik Gitu pro vývoj jádra Linuxu (2005), dokumentace projektu Git (git-scm.com).
