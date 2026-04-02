
    (function () {
      const websiteContent = {
        sv: {
          summer: {
            eyebrow: 'Sommar 2026',
            title: 'Sommarkurser som går att förstå, följa och faktiskt slutföra',
            intro: 'Tre tydliga 12-lektionsspår: Scratch för yngre barn, Python för barn/tonåringar och praktisk Python för vuxna. Fokus ligger på progression, trygg guidning och konkreta resultat – inte bara inspiration.',
            footnote: 'Barnkurserna ligger på cirka 175 kr per lektion och vuxenspåret på cirka 200 kr per lektion. Du kan boka direkt eller fylla i formuläret för att anmäla intresse.',
            book: 'Boka plats',
            interest: 'Anmäl intresse',
            roadmap: 'Visa 12-lektionsplan',
            totalLabel: 'Total kurskostnad',
            lessonLabel: 'Per lektion',
            lessonsLabel: '12 livelektioner online',
            bestForLabel: 'Passar bäst för',
            cards: [
              {
                audience: 'Barn 7–10 år',
                badge: 'Scratch',
                title: 'Scratch Summer Start',
                subtitle: 'En kreativ start för barn som vill bygga spel och berättelser utan att fastna i svår syntax.',
                bestFor: 'Barn som behöver en trygg, lekfull och tydlig introduktion.',
                pricePerLesson: '175 kr',
                total: '2100 kr',
                topic: 'summer_kids',
                message: 'Hej! Jag vill anmäla intresse för Scratch Summer Start (12 lektioner).',
                bullets: ['Visuell programmering som känns rolig direkt', 'Små spel och berättelser varje vecka', 'Bra första steg inför vidare Scratch eller Python'],
                roadmap: ['Lektion 1: Hitta i Scratch och förstå block', 'Lektion 2: Figurer, rörelse och bakgrunder', 'Lektion 3: Händelser och klickbara objekt', 'Lektion 4: Loopar och mönster', 'Lektion 5: Villkor och val', 'Lektion 6: Variabler och poäng', 'Lektion 7: Ljud, timing och effekter', 'Lektion 8: Bygg ett eget minispel', 'Lektion 9: Felsökning på ett lugnt sätt', 'Lektion 10: Förbättra spelet med nivåer', 'Lektion 11: Eget slutprojekt', 'Lektion 12: Showcase och nästa steg']
              },
              {
                audience: 'Barn & tonåringar 10–15 år',
                badge: 'Python för unga',
                title: 'Python Explorer',
                subtitle: 'För elever som vill gå från spelidéer och logik till riktig kod i tydliga steg.',
                bestFor: 'Barn och tonåringar som vill börja med Python utan att stressa.',
                pricePerLesson: '175 kr',
                total: '2100 kr',
                topic: 'summer_kids',
                message: 'Hej! Jag vill anmäla intresse för Python Explorer (12 lektioner).',
                bullets: ['Python från grunden med roliga exempel', 'Quiz, spel och små projekt', 'Tydlig väg från första rad kod till eget miniprojekt'],
                roadmap: ['Lektion 1: Starta Python och kör första programmet', 'Lektion 2: Variabler, text och print', 'Lektion 3: Input och användarval', 'Lektion 4: If-satser och logik', 'Lektion 5: Loopar och repetition', 'Lektion 6: Funktioner', 'Lektion 7: Listor och enkel data', 'Lektion 8: Bygg quiz eller minispel', 'Lektion 9: Felsökning som programmerare', 'Lektion 10: Bygg vidare på projektet', 'Lektion 11: Eget handledt projekt', 'Lektion 12: Demo och nästa steg']
              },
              {
                audience: 'Vuxna nybörjare',
                badge: 'Praktisk Python',
                title: 'Python Summer Track för vuxna',
                subtitle: 'En rak och praktisk kurs för vuxna som vill förstå Python och använda det i vardagen, studier eller jobb.',
                bestFor: 'Vuxna som vill lära sig från grunden med tydlig struktur.',
                pricePerLesson: '200 kr',
                total: '2400 kr',
                topic: 'summer_adults',
                message: 'Hej! Jag vill anmäla intresse för Python Summer Track för vuxna (12 lektioner).',
                bullets: ['Lugn start från noll', 'Automation, data och små riktiga case', 'Ett eget miniprojekt innan kursen är slut'],
                roadmap: ['Lektion 1: Miljö, editor och första programmet', 'Lektion 2: Datatyper, variabler och operatorer', 'Lektion 3: If-satser och logik', 'Lektion 4: Loopar', 'Lektion 5: Funktioner och struktur', 'Lektion 6: Listor och dictionaries', 'Lektion 7: Moduler', 'Lektion 8: Filhantering', 'Lektion 9: Praktisk automation', 'Lektion 10: Data/API eller enkel analys', 'Lektion 11: Eget miniprojekt', 'Lektion 12: Nästa steg efter sommaren']
              }
            ]
          },
          panels: {
            title: 'Testa upplägget direkt',
            intro: 'Här får besökaren känna hur undervisningen kan se ut, inte bara läsa om den. Klicka på alternativen och se ett visuellt upplägg direkt.',
            code: {
              eyebrow: 'Programmering',
              title: 'Bygg ditt första kodspår',
              intro: 'Välj mål och nivå så visas ett första upplägg med projekt, fokus och nästa steg.',
              step1: '1. Välj spår',
              step2: '2. Välj mål',
              cta: 'Boka detta upplägg',
              tracks: [
                { value: 'scratch', label: 'Scratch', icon: '🧩', audience: 'Barn 7–10 år' },
                { value: 'youth-python', label: 'Python för unga', icon: '🎮', audience: '10–15 år' },
                { value: 'adult-python', label: 'Python för vuxna', icon: '🐍', audience: 'Vuxna nybörjare' }
              ],
              goals: [
                { value: 'play', label: 'Bygga spel', icon: '🎯' },
                { value: 'logic', label: 'Förstå logik', icon: '🧠' },
                { value: 'practical', label: 'Praktiskt användbar kod', icon: '⚙️' }
              ],
              plans: {
                'scratch:play': { title: 'Starta med Scratch-spel', text: 'Bra för barn som behöver snabb känsla av “jag kan bygga något själv”.', project: 'Första projekt: ett klickbart minispel', bullets: ['Figurer, rörelse och poäng', 'Tydligt veckomål', 'Bygg något att visa hemma'], steps: ['Välj figur och bana', 'Lägg till rörelse och regler', 'Testa och förbättra spelet'] },
                'scratch:logic': { title: 'Scratch med fokus på tänk', text: 'Bra när målet är att förstå villkor, loopar och stegvis problemlösning.', project: 'Första projekt: logikspel med regler', bullets: ['Loopar och villkor', 'Mindre stress, mer förståelse', 'Bra bro till senare Python'], steps: ['Bygg ett mönster', 'Lägg till regler', 'Testa vad som händer när något ändras'] },
                'scratch:practical': { title: 'Kreativ Scratch-start', text: 'Bra för barn som vill skapa berättelser, animationer och enkla spel.', project: 'Första projekt: interaktiv berättelse', bullets: ['Passar kreativa elever', 'Tydlig struktur', 'Bra första kontakt med kod'], steps: ['Välj scen', 'Skapa händelser', 'Gör berättelsen klickbar'] },
                'youth-python:play': { title: 'Python med spelkänsla', text: 'För unga som vill börja med riktig kod genom quiz, textspel och små projekt.', project: 'Första projekt: textbaserat spel eller quiz', bullets: ['Python utan onödig teori', 'Snabb känsla av progression', 'Perfekt för nyfikna tonåringar'], steps: ['Lär dig input', 'Lägg in villkor', 'Gör spelet roligare med fler val'] },
                'youth-python:logic': { title: 'Python för logik och struktur', text: 'Bra när eleven vill förstå hur kod verkligen fungerar steg för steg.', project: 'Första projekt: problemlösare i Python', bullets: ['If-satser och loopar', 'Tydlig felsökning', 'Bygger stark grund'], steps: ['Skriv första reglerna', 'Testa olika fall', 'Förbättra och städa koden'] },
                'youth-python:practical': { title: 'Python för riktiga små projekt', text: 'Ett bra spår för tonåringar som vill bygga något konkret att visa upp.', project: 'Första projekt: enkel app eller smart verktyg', bullets: ['Kod som känns modern', 'Bra inför portfölj eller gymnasiet', 'Från idé till fungerande resultat'], steps: ['Välj projektidé', 'Bygg första versionen', 'Lägg till förbättringar'] },
                'adult-python:play': { title: 'Python på ett lättsamt sätt', text: 'För vuxna som vill börja utan prestationspress men ändå bygga något direkt.', project: 'Första projekt: litet quiz eller smart terminalverktyg', bullets: ['Tydlig start utan förkunskaper', 'Roligare än ren teori', 'Bra för att komma över starttröskeln'], steps: ['Skriv första programmet', 'Lägg till val och logik', 'Testa och justera'] },
                'adult-python:logic': { title: 'Python med stark grund', text: 'För vuxna som vill förstå logiken ordentligt innan de går vidare till data eller automation.', project: 'Första projekt: enkel problemlösare eller kalkylhjälp', bullets: ['Datatyper, villkor och funktioner', 'Struktur som håller', 'Bra bas för vidare kurs'], steps: ['Bygg en tydlig struktur', 'Bryt ut i funktioner', 'Testa flera scenarier'] },
                'adult-python:practical': { title: 'Praktisk Python för vardag och jobb', text: 'Det mest relevanta spåret för vuxna som vill använda Python direkt.', project: 'Första projekt: filhantering eller enkel automation', bullets: ['Kod som löser riktiga små problem', 'Passar jobb, studier eller sidoprojekt', 'Ger tydlig känsla av nytta'], steps: ['Identifiera ett litet problem', 'Automatisera första steget', 'Utöka till ett användbart verktyg'] }
              }
            },
            math: {
              eyebrow: 'Matte',
              title: 'Se hur mattehjälpen läggs upp',
              intro: 'Välj nivå och behov så visas ett konkret första upplägg med fokus, upplägg och nästa steg.',
              step1: '1. Välj nivå',
              step2: '2. Välj behov',
              cta: 'Boka mattehjälp',
              levels: [
                { value: 'school', label: 'Grundskola', icon: '📘', audience: 'Åk 1–9' },
                { value: 'highschool', label: 'Gymnasium', icon: '📐', audience: 'Matte 1–4' },
                { value: 'adult', label: 'Vuxen / universitet', icon: '🎓', audience: 'Komvux, universitet' }
              ],
              needs: [
                { value: 'confidence', label: 'Bygga förståelse', icon: '🌱' },
                { value: 'exam', label: 'Prov / tenta', icon: '📝' },
                { value: 'catchup', label: 'Komma ikapp', icon: '🚀' }
              ],
              plans: {
                'school:confidence': { title: 'Lugn grundplan för yngre elever', text: 'Fokus ligger på att förstå innan tempot ökar.', focus: ['Räknesätt och begrepp', 'Små steg som känns möjliga', 'Trygg repetition'], steps: ['Se var det fastnar', 'Förklara med enkla exempel', 'Skicka hem en kort plan'] },
                'school:exam': { title: 'Provfokus för grundskolan', text: 'Vi väljer ut det viktigaste först så eleven inte drunknar i allt samtidigt.', focus: ['Vanliga uppgiftstyper', 'Tydliga metoder', 'Mindre stress inför prov'], steps: ['Prioritera rätt områden', 'Öva med stöd', 'Repetera smart'] },
                'school:catchup': { title: 'Komma ikapp-plan', text: 'Bra när matte har blivit tung och eleven behöver struktur och riktning igen.', focus: ['Kartlägg luckor', 'Bygg upp grunden', 'Veckovis små delmål'], steps: ['Identifiera luckor', 'Träna ett område i taget', 'Följ upp nästa vecka'] },
                'highschool:confidence': { title: 'Gymnasiematte med riktig förståelse', text: 'Mindre stress, mer grepp om metoder och varför de fungerar.', focus: ['Algebra och funktioner', 'Problemlösning', 'Metodförståelse'], steps: ['Bryt ner området', 'Träna med exempel', 'Bygg upp självständighet'] },
                'highschool:exam': { title: 'Provplan för Matte 1–4', text: 'Bra när det är mycket stoff och man behöver tydlig prioritering.', focus: ['Provliknande uppgifter', 'Vanliga fallgropar', 'Genomgång av lösningsgång'], steps: ['Välj viktigaste delarna', 'Jobba med provfrågor', 'Finslipa strategi'] },
                'highschool:catchup': { title: 'Kom ikapp innan nästa moment', text: 'När grunden svajar blir allt ovanpå svårt. Här bygger vi om rätt del först.', focus: ['Täta kunskapsluckor', 'Kortare tydliga delmål', 'Starkare studierutin'], steps: ['Hitta roten till problemet', 'Träna strukturerat', 'Följ upp nästa steg'] },
                'adult:confidence': { title: 'Matte för vuxna som vill förstå på riktigt', text: 'Passar vuxna som återvänder till matte och vill ha lugna, tydliga förklaringar.', focus: ['Begreppsförståelse', 'Tydliga exempel', 'Plan mellan lektionerna'], steps: ['Starta på rätt nivå', 'Bygg upp förståelsen', 'Skapa hållbar rutin'] },
                'adult:exam': { title: 'Plan inför tenta eller kursprov', text: 'Ett fokuserat upplägg för vuxenstudier, komvux eller universitetsmatte.', focus: ['Rätt prioritering', 'Typuppgifter', 'Feedback på lösningsmetod'], steps: ['Välj viktigaste områdena', 'Öva med struktur', 'Justera inför provet'] },
                'adult:catchup': { title: 'Tillbaka in i matematiken', text: 'Bra när det gått tid sedan man läste matte eller när tempot i kursen blivit för högt.', focus: ['Repetition av basen', 'Tydlig ordning', 'Mindre känsla av kaos'], steps: ['Kartlägg nuläge', 'Börja med rätt grund', 'Bygg steg för steg'] }
              }
            }
          }
        },
        en: {
          summer: {
            eyebrow: 'Summer 2026',
            title: 'Summer courses with a clear roadmap and a realistic pace',
            intro: 'Three 12-lesson tracks: Scratch for younger children, Python for kids/teens, and practical Python for adults. The focus is clear progress, calm guidance, and concrete results.',
            footnote: 'Children’s courses are about 175 SEK per lesson and the adult track is about 200 SEK per lesson. You can book directly or register interest through the form.',
            book: 'Book a spot', interest: 'Register interest', roadmap: 'Show 12-lesson roadmap', totalLabel: 'Total price', lessonLabel: 'Per lesson', lessonsLabel: '12 live online lessons', bestForLabel: 'Best for',
            cards: []
          },
          panels: {
            title: 'Try the teaching style directly',
            intro: 'Instead of only reading about the offer, visitors can click through a visual preview of how programming and math support are structured.',
            code: { eyebrow: 'Programming', title: 'Build your first coding path', intro: 'Pick a track and a goal to see a realistic first setup.', step1: '1. Pick a track', step2: '2. Pick a goal', cta: 'Book this setup', tracks: [], goals: [], plans: {} },
            math: { eyebrow: 'Math', title: 'See how the math support is structured', intro: 'Pick a level and a need to see a concrete first plan.', step1: '1. Pick a level', step2: '2. Pick a need', cta: 'Book math support', levels: [], needs: [], plans: {} }
          }
        },
        ar: {
          summer: {
            eyebrow: 'صيف 2026',
            title: 'دورات صيفية بخطة واضحة وإيقاع مناسب',
            intro: 'ثلاثة مسارات من 12 درساً: سكراتش للأطفال الأصغر، بايثون للأطفال والمراهقين، وبايثون عملي للكبار. التركيز على التدرج الواضح والشرح الهادئ والنتائج الملموسة.',
            footnote: 'دورات الأطفال حوالي 175 كرونة لكل درس، ومسار الكبار حوالي 200 كرونة لكل درس. يمكنك الحجز مباشرة أو إرسال طلب اهتمام عبر النموذج.',
            book: 'احجز مكاناً', interest: 'سجل اهتمامك', roadmap: 'اعرض خطة 12 درساً', totalLabel: 'إجمالي السعر', lessonLabel: 'لكل درس', lessonsLabel: '12 درساً مباشراً عبر الإنترنت', bestForLabel: 'يناسب أكثر',
            cards: []
          },
          panels: {
            title: 'جرّب الأسلوب مباشرة',
            intro: 'بدلاً من قراءة الوصف فقط، يمكن للزائر الضغط ومشاهدة معاينة بصرية لكيفية بناء مسار البرمجة أو الرياضيات.',
            code: { eyebrow: 'البرمجة', title: 'ابنِ مسارك البرمجي الأول', intro: 'اختر المسار والهدف لترى بداية عملية مناسبة.', step1: '1. اختر المسار', step2: '2. اختر الهدف', cta: 'احجز هذا المسار', tracks: [], goals: [], plans: {} },
            math: { eyebrow: 'الرياضيات', title: 'شاهد كيف يتم بناء خطة الرياضيات', intro: 'اختر المستوى والاحتياج لرؤية خطة أولى واضحة.', step1: '1. اختر المستوى', step2: '2. اختر الاحتياج', cta: 'احجز مساعدة الرياضيات', levels: [], needs: [], plans: {} }
          }
        }
      };

      // Reuse Swedish content for EN/AR structure to keep the UI complete, with translated section copy above.
      websiteContent.en.summer.cards = websiteContent.sv.summer.cards.map(card => ({ ...card }));
      websiteContent.en.panels.code.tracks = websiteContent.sv.panels.code.tracks.map(item => ({ ...item }));
      websiteContent.en.panels.code.goals = websiteContent.sv.panels.code.goals.map(item => ({ ...item }));
      websiteContent.en.panels.code.plans = JSON.parse(JSON.stringify(websiteContent.sv.panels.code.plans));
      websiteContent.en.panels.math.levels = websiteContent.sv.panels.math.levels.map(item => ({ ...item }));
      websiteContent.en.panels.math.needs = websiteContent.sv.panels.math.needs.map(item => ({ ...item }));
      websiteContent.en.panels.math.plans = JSON.parse(JSON.stringify(websiteContent.sv.panels.math.plans));
      websiteContent.ar.summer.cards = websiteContent.sv.summer.cards.map(card => ({ ...card }));
      websiteContent.ar.panels.code.tracks = websiteContent.sv.panels.code.tracks.map(item => ({ ...item }));
      websiteContent.ar.panels.code.goals = websiteContent.sv.panels.code.goals.map(item => ({ ...item }));
      websiteContent.ar.panels.code.plans = JSON.parse(JSON.stringify(websiteContent.sv.panels.code.plans));
      websiteContent.ar.panels.math.levels = websiteContent.sv.panels.math.levels.map(item => ({ ...item }));
      websiteContent.ar.panels.math.needs = websiteContent.sv.panels.math.needs.map(item => ({ ...item }));
      websiteContent.ar.panels.math.plans = JSON.parse(JSON.stringify(websiteContent.sv.panels.math.plans));

      function currentLang() {
        const lang = window.i18n && window.i18n.getLanguage ? window.i18n.getLanguage() : 'sv';
        return websiteContent[lang] ? lang : 'sv';
      }

      function renderSummerCourses() {
        const host = document.getElementById('summerCoursesGrid');
        const section = document.getElementById('summer-courses');
        if (!host || !section) return;
        const data = websiteContent[currentLang()].summer;

        const eyebrow = section.querySelector('.eyebrow');
        const h2 = section.querySelector('h2');
        const intro = section.querySelector('h2 + p');
        const footnote = section.querySelector('.summer-footnote');
        if (eyebrow) eyebrow.textContent = data.eyebrow;
        if (h2) h2.textContent = data.title;
        if (intro) intro.textContent = data.intro;
        if (footnote) footnote.textContent = data.footnote;

        host.innerHTML = data.cards.map((card, idx) => `
          <article class="card summer-course-card ${idx === 2 ? 'summer-course-card--featured' : ''}">
            <div class="summer-course-header">
              <div>
                <span class="summer-badge">${card.badge}</span>
                <p class="summer-audience">${card.audience}</p>
              </div>
              <span class="summer-chip">${data.lessonsLabel}</span>
            </div>
            <h3>${card.title}</h3>
            <p>${card.subtitle}</p>
            <ul class="meta">${card.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
            <div class="summer-pricing">
              <div><span>${data.lessonLabel}</span><strong>${card.pricePerLesson}</strong></div>
              <div><span>${data.totalLabel}</span><strong>${card.total}</strong></div>
            </div>
            <p class="summer-bestfor"><strong>${data.bestForLabel}:</strong> ${card.bestFor}</p>
            <div class="quiz-actions">
              <a class="btn primary" href="#booking">${data.book}</a>
              <button class="btn ghost summer-interest-btn" type="button" data-topic="${card.topic}" data-message="${card.message.replace(/"/g, '&quot;')}">${data.interest}</button>
            </div>
            <details class="summer-roadmap">
              <summary>${data.roadmap}</summary>
              <ol>${card.roadmap.map(step => `<li>${step}</li>`).join('')}</ol>
            </details>
          </article>`).join('');
      }

      function createOptionButtons(items, activeValue, buttonClass = 'panel-choice') {
        return items.map(item => `
          <button type="button" class="${buttonClass}${item.value === activeValue ? ' is-active' : ''}" data-value="${item.value}">
            <span class="panel-choice-icon">${item.icon || ''}</span>
            <span class="panel-choice-copy">
              <strong>${item.label}</strong>
              ${item.audience ? `<small>${item.audience}</small>` : ''}
            </span>
          </button>`).join('');
      }

      function renderProgrammingPanel() {
        const host = document.getElementById('programmingPanel');
        if (!host) return;
        const data = websiteContent[currentLang()].panels.code;
        const defaultTrack = host.dataset.track || data.tracks[0].value;
        const defaultGoal = host.dataset.goal || data.goals[0].value;
        const planKey = `${defaultTrack}:${defaultGoal}`;
        const plan = data.plans[planKey] || Object.values(data.plans)[0];

        host.dataset.track = defaultTrack;
        host.dataset.goal = defaultGoal;
        host.innerHTML = `
          <div class="panel-shell">
            <div class="panel-header">
              <span class="eyebrow">${data.eyebrow}</span>
              <h3>${data.title}</h3>
              <p>${data.intro}</p>
            </div>
            <div class="panel-stage">
              <div>
                <p class="panel-step-label">${data.step1}</p>
                <div class="panel-choice-grid panel-choice-grid--tracks">${createOptionButtons(data.tracks, defaultTrack)}</div>
              </div>
              <div>
                <p class="panel-step-label">${data.step2}</p>
                <div class="panel-choice-grid panel-choice-grid--goals">${createOptionButtons(data.goals, defaultGoal, 'panel-pill')}</div>
              </div>
            </div>
            <div class="panel-preview">
              <div class="panel-preview-top">
                <div>
                  <p class="panel-preview-kicker">Första upplägget</p>
                  <h4>${plan.title}</h4>
                  <p>${plan.text}</p>
                </div>
                <div class="panel-project-card">
                  <span>Projektstart</span>
                  <strong>${plan.project}</strong>
                </div>
              </div>
              <div class="panel-roadmap">
                ${plan.steps.map((step, index) => `<div class="panel-roadmap-step"><span>${index + 1}</span><p>${step}</p></div>`).join('')}
              </div>
              <ul class="check compact">${plan.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
              <a class="btn ghost" href="#booking">${data.cta}</a>
            </div>
          </div>`;

        host.querySelectorAll('.panel-choice-grid--tracks .panel-choice').forEach((btn) => {
          btn.addEventListener('click', () => { host.dataset.track = btn.dataset.value; renderProgrammingPanel(); });
        });
        host.querySelectorAll('.panel-choice-grid--goals .panel-pill').forEach((btn) => {
          btn.addEventListener('click', () => { host.dataset.goal = btn.dataset.value; renderProgrammingPanel(); });
        });
      }

      function renderMathPanel() {
        const host = document.getElementById('mathPanel');
        if (!host) return;
        const data = websiteContent[currentLang()].panels.math;
        const defaultLevel = host.dataset.level || data.levels[0].value;
        const defaultNeed = host.dataset.need || data.needs[0].value;
        const planKey = `${defaultLevel}:${defaultNeed}`;
        const plan = data.plans[planKey] || Object.values(data.plans)[0];

        host.dataset.level = defaultLevel;
        host.dataset.need = defaultNeed;
        host.innerHTML = `
          <div class="panel-shell">
            <div class="panel-header">
              <span class="eyebrow">${data.eyebrow}</span>
              <h3>${data.title}</h3>
              <p>${data.intro}</p>
            </div>
            <div class="panel-stage">
              <div>
                <p class="panel-step-label">${data.step1}</p>
                <div class="panel-choice-grid panel-choice-grid--tracks">${createOptionButtons(data.levels, defaultLevel)}</div>
              </div>
              <div>
                <p class="panel-step-label">${data.step2}</p>
                <div class="panel-choice-grid panel-choice-grid--goals">${createOptionButtons(data.needs, defaultNeed, 'panel-pill')}</div>
              </div>
            </div>
            <div class="panel-preview">
              <div class="panel-preview-top">
                <div>
                  <p class="panel-preview-kicker">Första planen</p>
                  <h4>${plan.title}</h4>
                  <p>${plan.text}</p>
                </div>
                <div class="panel-focus-card">
                  <span>Fokus</span>
                  <strong>${plan.focus[0]}</strong>
                </div>
              </div>
              <div class="panel-focus-tags">${plan.focus.map(item => `<span>${item}</span>`).join('')}</div>
              <div class="panel-roadmap panel-roadmap--math">
                ${plan.steps.map((step, index) => `<div class="panel-roadmap-step"><span>${index + 1}</span><p>${step}</p></div>`).join('')}
              </div>
              <a class="btn ghost" href="#booking">${data.cta}</a>
            </div>
          </div>`;

        host.querySelectorAll('.panel-choice-grid--tracks .panel-choice').forEach((btn) => {
          btn.addEventListener('click', () => { host.dataset.level = btn.dataset.value; renderMathPanel(); });
        });
        host.querySelectorAll('.panel-choice-grid--goals .panel-pill').forEach((btn) => {
          btn.addEventListener('click', () => { host.dataset.need = btn.dataset.value; renderMathPanel(); });
        });
      }

      function bindSummerInterestButtons() {
        document.querySelectorAll('.summer-interest-btn').forEach((btn) => {
          btn.addEventListener('click', () => {
            const topic = document.getElementById('topic');
            const message = document.getElementById('message');
            if (topic && btn.dataset.topic) topic.value = btn.dataset.topic;
            if (message && btn.dataset.message) message.value = btn.dataset.message;
            document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            message?.focus();
          });
        });
      }

      function renderInteractiveCopy() {
        const lang = currentLang();
        const section = document.getElementById('interactive-panels');
        if (section) {
          const title = section.querySelector('h2');
          const intro = section.querySelector('h2 + p');
          if (title) title.textContent = websiteContent[lang].panels.title;
          if (intro) intro.textContent = websiteContent[lang].panels.intro;
        }
        renderProgrammingPanel();
        renderMathPanel();
      }

      function renderDynamicSections() {
        renderSummerCourses();
        renderInteractiveCopy();
        bindSummerInterestButtons();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderDynamicSections);
      } else {
        renderDynamicSections();
      }

      document.addEventListener('languageChanged', renderDynamicSections);
    })();
  