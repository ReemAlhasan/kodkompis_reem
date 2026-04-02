
    (function() {
      const age = document.getElementById('quizAge');
      const focus = document.getElementById('quizFocus');
      const goal = document.getElementById('quizGoal');
      const trigger = document.getElementById('quizRecommend');
      const result = document.getElementById('quizResult');
      const title = document.getElementById('quizResultTitle');
      const text = document.getElementById('quizResultText');
      const list = document.getElementById('quizResultList');

      if (!age || !focus || !goal || !trigger || !result || !title || !text || !list) return;

      let currentRecommendation = null;

      const recommendations = {
        young: ['recYoungTitle', 'recYoungText', ['recYoungItem1', 'recYoungItem2', 'recYoungItem3']],
        builder: ['recBuilderTitle', 'recBuilderText', ['recBuilderItem1', 'recBuilderItem2', 'recBuilderItem3']],
        portfolio: ['recPortfolioTitle', 'recPortfolioText', ['recPortfolioItem1', 'recPortfolioItem2', 'recPortfolioItem3']],
        math: ['recMathTitle', 'recMathText', ['recMathItem1', 'recMathItem2', 'recMathItem3']],
        coach: ['recCoachTitle', 'recCoachText', ['recCoachItem1', 'recCoachItem2', 'recCoachItem3']]
      };

      function t(key) {
        return window.i18n ? window.i18n.t(key) : key;
      }

      function decideRecommendation() {
        if (focus.value === 'math') {
          return 'math';
        }

        if (focus.value === 'mixed') {
          return 'coach';
        }

        if (age.value === '6-8') {
          return 'young';
        }

        if (age.value === '13-16' || age.value === 'adult') {
          return goal.value === 'support' ? 'coach' : 'portfolio';
        }

        if (goal.value === 'support') {
          return 'coach';
        }

        return 'builder';
      }

      function renderRecommendation() {
        if (!currentRecommendation) {
          result.classList.add('is-empty');
          title.textContent = t('quizDefaultTitle');
          text.textContent = t('quizDefaultText');
          list.innerHTML = '';
          return;
        }

        const config = recommendations[currentRecommendation];
        if (!config) return;

        result.classList.remove('is-empty');
        title.textContent = t(config[0]);
        text.textContent = t(config[1]);
        list.innerHTML = '';
        config[2].forEach((itemKey) => {
          const li = document.createElement('li');
          li.textContent = t(itemKey);
          list.appendChild(li);
        });
      }

      trigger.addEventListener('click', () => {
        currentRecommendation = decideRecommendation();
        renderRecommendation();
      });

      document.addEventListener('languageChanged', renderRecommendation);
      renderRecommendation();
    })();
  