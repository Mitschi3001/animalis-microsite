const historyGallery = document.getElementById('historySection');

if (historyGallery) {
  // Elemente für den Kartenwechsel in der Historie
  const historyBaseImage = document.getElementById('mapPicA');
  const historyOverlayImage = document.getElementById('mapPicB');
  const historyDescription = document.getElementById('storyTxt');
  const historyDescriptionYear = document.getElementById('storyYearBig');
  const historyDescriptionText = document.getElementById('storyMainTxt');
  const historyYearButtons = Array.from(historyGallery.querySelectorAll('[data-year-button]'));
  let historyTransitionToken = 0;

  const historyEntries = {
    1998: {
      image: 'image/zoomaps/zookarte01.png',
      alt: 'Zoo-Karte aus dem Jahr 1998',
      text: 'auf dem Animalis in den nächsten Jahren entstehen wird. Es besteht aus Seen mit kleinen Inseln, vielen Wiesen und zahlreichen Bäumen und Pflanzen. Ein Paradies für die zukünftigen Bewohner!'
    },
    2000: {
      image: 'image/zoomaps/zookarte02.png',
      alt: 'Zoo-Karte aus dem Jahr 2000',
      text: 'Ein Streichelzoo wird erbaut. Kinder können sich u. a. an den Ziegen Ernie und Bert oder an Benjamin unseren Esel erfreuen. Außerdem fand Leon, unser Löwe, mit seiner Gefährtin Nale bei uns ein sicheres zu Hause.\n \nFür Farbe und Stimmung sorgen unsere farbenfrohen Papageien Timo und Nelli mit ihnren zahlreichen Freunden in unserem Vogeldom. Für das leibliche Wohl sorgt unser Restaurant mit seinen leckeren Speisen und Getränken. Ein Besuch lohnt sich! \n \n Der Eintritt ist noch frei, wir freuen uns über jede Spende!'
    },
    2002: {
      image: 'image/zoomaps/zookarte03.png',
      alt: 'Zoo-Karte aus dem Jahr 2002',
      text: 'und mit ihr ziehen unter anderen Giraffe Susi und Zebra Helmut mit ihren Familien ein.  Die Jungtiere lassen sich jeden Tag beim spielen unf toben beobachten.\n \n Um die Kosten für unsere Tiere zu stämmen, wurde ein Kassenhäuschen installiert, bei dem es für kleines Geld Eintrittskarten erwerben kann.'
    },
    2005: {
      image: 'image/zoomaps/zookarte04.png',
      alt: 'Zoo-Karte aus dem Jahr 2005',
      text: 'Es entsteht das neue Elefantenhaus gleich neben der Savanne. Mit viel Arbeit wird einer der Seeinseln aufbereitet, damit hier eine Affeninsel entstehen kann. Diese Insel mit ihren vielfältigen Arten geht über in das Tropenland, in dem Erwachsene und Kinder viele neue Tiere, wie z. B. das Faultier bewundern können.\n \nAußerdem wird das Kassenhäuschen durch eine einladene Halle ersetzt, in der Besucher Eintrittskarten und viele Souvenirs erwerben können. Hier gibt es für jedes Alter etwas.\n \n Weiterhin werden Piknikplätze erbaut, an denen sich die Besucher im Grünen ihr Essen schmecken lassen können.'
    },
    2008: {
      image: 'image/zoomaps/zookarte05.png',
      alt: 'Zoo-Karte aus dem Jahr 2008',
      text: 'Auf Seite unseres Tropenlandes werden das Reptilienhaus und ein Aquarium errichtet. Hier können Besucher Schlangen, Spinnen, Fledermäuse und die unterschiedlichsten Fische hautnah erleben. Ebenso zieht bei uns ein Wolfsrudel und mehrere Pinguinfamilien ein.\n \n Ab hier werden regelmäßig Live-Fütterungen für die Besucher veranstaltet.'
    },
    2011: {
      image: 'image/zoomaps/zookarte06.png',
      alt: 'Zoo-Karte aus dem Jahr 2011',
      text: 'Unser Janosch und seine Bärenfamilie erhält bei uns ein zu Hause umgeben von viel Natur. \n \n Für die kleinen Besucher wird neben dem Streichelzoo ein Abenteuerspielplatz erichtet, auf dem sich Kinder so richtig austoben können und die Eltern sich ein wenig entspannen können. Außerdem wird unser Café direkt am See errichtet, um die Seele bei gutem Eis und Kaffeegetränke baumeln zu lassen. '
    }
  };
  const historyYearTitles = {
    1998: 'Das Land wird gekauft',
    2000: 'Die ersten Tiere ziehen ein',
    2002: 'Eine kleine Savanne entsteht',
    2005: 'Viele neue Bewohner ziehen ein',
    2008: 'Die Arten-Vielfalt steigt',
    2011: 'Die (bisher) letzte große Veränderung'
  };

  // Lädt das Bild vor, damit der Wechsel ruhiger wirkt
  function preloadHistoryImage(src) {
    const image = new Image();
    image.src = src;

    if (typeof image.decode === 'function') {
      return image.decode().catch(() => {});
    }

    return new Promise((resolve) => {
      image.onload = resolve;
      image.onerror = resolve;
    });
  }

  // Wartet, bis die Fade-Animation fertig ist
  function waitForOverlayFade() {
    return new Promise((resolve) => {
      let finished = false;

      const done = () => {
        if (finished) {
          return;
        }
        finished = true;
        historyOverlayImage.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      const onTransitionEnd = (event) => {
        if (event.propertyName === 'opacity') {
          done();
        }
      };

      historyOverlayImage.addEventListener('transitionend', onTransitionEnd);
      setTimeout(done, 980);
    });
  }

  async function setHistoryYear(year) {
    // Wechsel auf gewähltes Jahr inkl. Fade-Übergang
    const entry = historyEntries[year];
    if (!entry || !historyBaseImage || !historyOverlayImage || !historyDescription || !historyDescriptionYear || !historyDescriptionText) {
      return;
    }

    for (let i = 0; i < historyYearButtons.length; i += 1) {
      const button = historyYearButtons[i];
      const isActive = button.dataset.year === year;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }

    const currentYear = historyBaseImage.dataset.currentYear;
    if (currentYear === year) {
      const title = historyYearTitles[year] || year;
      historyDescriptionYear.textContent = title;
      historyDescriptionText.textContent = entry.text;
      return;
    }

    const transitionToken = ++historyTransitionToken;
    await preloadHistoryImage(entry.image);

    if (transitionToken !== historyTransitionToken) {
      return;
    }

    historyOverlayImage.classList.remove('is-visible');
    historyOverlayImage.src = entry.image;
    historyOverlayImage.alt = entry.alt;
    void historyOverlayImage.offsetWidth;
    historyOverlayImage.classList.add('is-visible');

    const title = historyYearTitles[year] || year;
    historyDescriptionYear.textContent = title;
    historyDescriptionText.textContent = entry.text;
    await waitForOverlayFade();

    if (transitionToken !== historyTransitionToken) {
      return;
    }

    historyBaseImage.src = entry.image;
    historyBaseImage.alt = entry.alt;
    historyBaseImage.dataset.currentYear = year;
    historyOverlayImage.classList.remove('is-visible');
  }

  for (let i = 0; i < historyYearButtons.length; i += 1) {
    const button = historyYearButtons[i];
    button.addEventListener('click', function () {
      const selectedYear = button.dataset.year;
      setHistoryYear(selectedYear);
    });
  }
}

const quizContainer = document.getElementById('quizWrap1');

if (quizContainer) {
  // Quiz-Elemente und Zustände sammeln
  const quizProgress = document.getElementById('quizProgressText');
  const quizQuestion = document.getElementById('quizQuestionText');
  const quizOptions = document.getElementById('quizOptionsList');
  const quizBackButton = document.getElementById('quizBackButton');
  const quizNextButton = document.getElementById('quizNextButton');
  const quizResultDialog = document.getElementById('resultPop');
  const quizResultTitle = document.getElementById('quizResultTitleText');
  const quizResultText = document.getElementById('quizResultBodyText');
  const quizRestartButton = document.getElementById('restartBtnQ');

  const quizQuestions = [
    {
      question: 'Wie können Wölfe über große Entfernungen miteinander kommunizieren?',
      options: ['Durch Heulen', 'Durch Schnabelklappern', 'Durch Trommeln', 'Durch Farbwechsel'],
      correctIndex: 0
    },
    {
      question: 'Warum bewegen Elefanten bei großer Hitze häufig ihre großen Ohren?',
      options: ['Zur Kühlung des Körpers', 'Um schneller laufen zu können', 'Um besser sehen zu können', 'Um Nahrung aufzuspüren'],
      correctIndex: 0
    },
    {
      question: 'Wozu dient das dichte Federkleid von Pinguinen?',
      options: ['Zum Schutz vor Kälte und Wasser', 'Zum besseren Fliegen', 'Zum Speichern von Nahrung', 'Zum Atmen unter Wasser'],
      correctIndex: 0
    },
    {
      question: 'Zu welcher Ernährungsgruppe gehört ein Braunbär grundsätzlich?',
      options: ['Allesfresser', 'Reiner Fleischfresser', 'Reiner Pflanzenfresser', 'Reiner Insektenfresser'],
      correctIndex: 0
    },
    {
      question: 'Was ist typisch für Erdmännchen?',
      options: ['Sie leben häufig in Gruppen und einzelne Tiere halten Wache.', 'Sie leben ausschließlich allein.', 'Sie verbringen den Großteil ihres Lebens auf Bäumen.', 'Sie halten mehrere Monate Winterschlaf.'],
      correctIndex: 0
    },
    {
      question: 'Warum häuten sich Schlangen regelmäßig?',
      options: ['Weil die äußere Hautschicht nicht dauerhaft mitwächst.', 'Damit sie ihre Farbe wechseln können.', 'Damit sie mehr Wasser speichern können.', 'Damit sie schneller kriechen können.'],
      correctIndex: 0
    },
    {
      question: 'Welche überraschende Fähigkeit besitzen Faultiere?',
      options: ['Sie können gut schwimmen.', 'Sie können mehrere Meter weit springen.', 'Sie können fliegen.', 'Sie können mehrere Stunden unter Wasser atmen.'],
      correctIndex: 0
    },
    {
      question: 'Wie sind die Zehen vieler Papageien angeordnet?',
      options: ['Zwei nach vorn und zwei nach hinten', 'Vier nach vorn', 'Drei nach hinten und eine nach vorn', 'Drei nach vorn und eine nach hinten'],
      correctIndex: 0
    },
    {
      question: 'Welche Töne können Elefanten zur Kommunikation über große Entfernungen nutzen?',
      options: ['Sehr tiefe Infraschalltöne', 'Ausschließlich Ultraschall', 'Nur kurze Pfeiftöne', 'Ausschließlich hörbares Trompeten'],
      correctIndex: 0
    },
    {
      question: 'Wie nennt man eine Gruppe von Löwen?',
      options: ['Kolonie', 'Schwarm', 'Rudel', 'Herde'],
      correctIndex: 2
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;
  const selectedAnswers = new Array(quizQuestions.length).fill(null);
  let previouslyFocusedElement = null;

  // Sammelt fokussierbare Elemente im Ergebnis-Popup
  function getModalFocusableElements() {
    const allFocusable = Array.from(
      quizResultDialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
    const enabledFocusable = [];

    for (let i = 0; i < allFocusable.length; i += 1) {
      const element = allFocusable[i];
      if (!element.disabled) {
        enabledFocusable.push(element);
      }
    }

    return enabledFocusable;
  }

  // Öffnet das Ergebnis-Popup und setzt Fokus
  function openQuizResultModal() {
    previouslyFocusedElement = document.activeElement;
    quizResultDialog.classList.remove('hideMe');

    const focusableElements = getModalFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      quizResultDialog.focus();
    }
  }

  // Schließt das Ergebnis-Popup und gibt Fokus zurück
  function closeQuizResultModal() {
    quizResultDialog.classList.add('hideMe');
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus();
    }
  }

  function renderQuizQuestion() {
    // Rendert die aktuelle Frage + Antwortoptionen
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const currentSelectedAnswer = selectedAnswers[currentQuestionIndex];
    quizBackButton.disabled = currentQuestionIndex === 0;
    quizNextButton.disabled = currentSelectedAnswer === null;
    quizProgress.textContent = `Frage ${currentQuestionIndex + 1} von ${quizQuestions.length}`;
    quizQuestion.textContent = currentQuestion.question;
    quizNextButton.textContent = currentQuestionIndex === quizQuestions.length - 1 ? 'Auswerten' : 'Weiter';

    quizOptions.innerHTML = '';
    for (let optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex += 1) {
      const option = currentQuestion.options[optionIndex];
      const optionLabel = document.createElement('label');
      optionLabel.className = 'qOptItem';

      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      optionInput.name = 'qOpt';
      optionInput.value = String(optionIndex);
      optionInput.checked = currentSelectedAnswer === optionIndex;
      optionInput.addEventListener('change', function () {
        selectedAnswers[currentQuestionIndex] = optionIndex;
        quizNextButton.disabled = false;
      });

      const optionText = document.createElement('span');
      optionText.textContent = option;

      optionLabel.appendChild(optionInput);
      optionLabel.appendChild(optionText);
      quizOptions.appendChild(optionLabel);
    }
  }

  function showQuizResult() {
    // Auswertung aller Antworten und Ergebnistext
    let totalScore = 0;
    for (let i = 0; i < selectedAnswers.length; i += 1) {
      const answerIndex = selectedAnswers[i];
      if (answerIndex === quizQuestions[i].correctIndex) {
        totalScore += 1;
      }
    }
    score = totalScore;

    quizResultTitle.textContent = `Ergebnis: ${score} Punkte`;

    if (score >= 7) {
      quizResultText.textContent = 'Wahnsinn, du hast den Durchblick! Aber man lernt bekanntlich nie aus, also komme bei uns vorbei und schau, ob du noch mehr lernen kannst.';
    } else if (score >= 4) {
      quizResultText.textContent = 'Ordentliche Leistung! Aber es sind doch ein paar Wissenslücken. Komme zu uns und fülle diese!';
    } else {
      quizResultText.textContent = 'Hier besteht noch ein wenig Nachholbedarf, komme zu uns in den Zoo und lerne neue spannende Dinge!';
    }

    openQuizResultModal();
  }

  quizNextButton.addEventListener('click', function () {
    if (selectedAnswers[currentQuestionIndex] === null) {
      return;
    }

    const nextQuestionIndex = currentQuestionIndex + 1;
    currentQuestionIndex = nextQuestionIndex;
    if (currentQuestionIndex >= quizQuestions.length) {
      showQuizResult();
      return;
    }

    renderQuizQuestion();
  });

  quizBackButton.addEventListener('click', function () {
    if (currentQuestionIndex === 0) {
      return;
    }

    const previousQuestionIndex = currentQuestionIndex - 1;
    currentQuestionIndex = previousQuestionIndex;
    renderQuizQuestion();
  });

  quizRestartButton.addEventListener('click', function () {
    currentQuestionIndex = 0;
    score = 0;
    selectedAnswers.fill(null);
    closeQuizResultModal();
    renderQuizQuestion();
  });

  quizResultDialog.addEventListener('click', function (event) {
    if (event.target === quizResultDialog) {
      closeQuizResultModal();
    }
  });

  quizResultDialog.addEventListener('keydown', function (event) {
    const isHidden = quizResultDialog.classList.contains('hideMe');
    if (isHidden) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeQuizResultModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getModalFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });

  renderQuizQuestion();
}
