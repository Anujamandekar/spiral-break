/* =========================================================
   SPIRAL BREAK
   V0.1

   No AI.
   No server.
   No database.
   No tracking.

   Your information is stored in this browser using
   localStorage.
========================================================= */


/* =========================================================
   BASIC STATE
========================================================= */

const saved = localStorage.getItem("spiralBreak");

const state = saved
  ? JSON.parse(saved)
  : {
      redirected: 0,
      bugs: 0,
      growth: 0,
      parked: [],
      quotes: []
    };


function save() {
  localStorage.setItem(
    "spiralBreak",
    JSON.stringify(state)
  );

  updateHome();
}


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

function showScreen(id) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {
      screen.classList.remove("active");
    });

  document
    .getElementById(id)
    .classList.add("active");

  window.scrollTo(0, 0);
}


function goHome() {
  showScreen("home");
  updateHome();
}


/* =========================================================
   HOME / GARDEN
========================================================= */

function updateHome() {

  document.getElementById("gardenStats").textContent =
    `${state.redirected} loop${
      state.redirected === 1 ? "" : "s"
    } redirected · ${state.bugs} bug${
      state.bugs === 1 ? "" : "s"
    }`;

  document.getElementById("parkedCount").textContent =
    state.parked.length;


  const stage =
    Math.min(
      7,
      Math.floor(state.growth / 2)
    );


  const art = [
    "🌱",
    "🌿",
    "🌿",
    "🌿🌸",
    "🌳",
    "🌳🌸",
    "🌳🌸🦋",
    "🌳🌸🦋🐦"
  ];

  const names = [
    "A beginning",
    "First leaves",
    "Growing",
    "First flower",
    "Young tree",
    "In bloom",
    "A little ecosystem",
    "Your garden"
  ];


  document.getElementById("gardenArt").textContent =
    art[stage];

  document.getElementById("gardenName").textContent =
    names[stage];
}


updateHome();


/* =========================================================
   RANDOMIZED OPENING
========================================================= */

const openingMessages = [

  "Stop. Don't explain the whole story yet. Take one breath. Feet down. You're allowed to not solve this in this exact minute.",

  "Pause. Your brain may be trying to think its way out of a feeling. Let's find out whether there is actually something to do.",

  "Hold on. No detective work yet. One breath, shoulders loose, feet on the floor. Let's separate a problem from a loop.",

  "Before you follow the thought any further: pause. You don't need an answer this second. Let's check what kind of thinking this is.",

  "Hey. Don't chase the thought yet. Give yourself ten seconds outside the story. Then we'll decide whether this needs action.",

  "You're here. Good. Nothing needs to be solved before we figure out whether there is anything to solve.",

  "Interrupt first. Analyse later. One breath. Feet down. Let's see whether this is a problem or your brain replaying one.",

  "For the next few seconds, you don't need to understand anything. Just pause the loop and check: is there an action?"
];


/* =========================================================
   START SPIRAL
========================================================= */

function startSpiral() {

  const message =
    openingMessages[
      Math.floor(
        Math.random() *
        openingMessages.length
      )
    ];


  renderContent(`
    <div class="card">

      <h2>${message}</h2>

      <div class="notice">

        You don't have to figure out your
        relationship, your money, or your
        future in this minute.

        <br><br>

        First we'll decide whether there
        is actually something useful to do.

      </div>

      <button class="spiral-button"
              onclick="askConcreteAction()">

        Continue

      </button>

    </div>
  `, 10);
}


/* =========================================================
   CONCRETE ACTION?
========================================================= */

function askConcreteAction() {

  renderContent(`

    <div class="card">

      <h2>
        Can you take a concrete action
        right now?
      </h2>

      <p class="muted">
        Something specific that would
        change the situation — not more
        thinking about it.
      </p>

      <div class="choices">

        <button class="choice"
                onclick="actionYes()">

          YES

          <small>
            There is something I can actually do.
          </small>

        </button>


        <button class="choice"
                onclick="actionNo()">

          NO

          <small>
            There isn't a useful action right now.
          </small>

        </button>

      </div>

    </div>

  `, 25);
}


/* =========================================================
   YES — THERE IS AN ACTION
========================================================= */

function actionYes() {

  renderContent(`

    <div class="card">

      <h2>
        Good. Name the action.
      </h2>

      <p class="muted">
        One sentence. Make it concrete.
      </p>

      <input
        id="actionInput"
        maxlength="180"
        placeholder="e.g. send the email..."
      >

      <button
        class="spiral-button"
        onclick="confirmAction()">

        Continue

      </button>

    </div>

  `, 35);
}


function confirmAction() {

  const action =
    document
      .getElementById("actionInput")
      .value
      .trim();


  if (!action) {

    alert(
      "Give the action one sentence."
    );

    return;
  }


  renderContent(`

    <div class="card">

      <h2>
        That's an actual action.
      </h2>

      <div class="notice">

        <strong>Action:</strong><br>

        ${escapeHTML(action)}

      </div>

      <p>
        Do you want to deal with it now?
      </p>

      <div class="choices">

        <button class="choice"
                onclick="doAction()">

          DO IT NOW

        </button>

        <button class="choice"
                onclick="parkAction('${escapeAttribute(action)}')">

          PARK IT

        </button>

      </div>

    </div>

  `, 45);
}


/* =========================================================
   DO ACTION
========================================================= */

function doAction() {

  renderContent(`

    <div class="card">

      <h2>
        Good. Go do the thing.
      </h2>

      <div class="notice">

        Don't optimise it.
        Don't rehearse it.
        Don't analyse it.

        <br><br>

        Just do the smallest concrete
        version of the action.

      </div>

      <button
        class="spiral-button"
        onclick="afterAction()">

        I'VE DONE IT

      </button>

    </div>

  `, 60);
}


function afterAction() {

  state.redirected++;

  if (state.bugs > 0) {
    state.bugs--;
  }

  state.growth++;

  save();

  successScreen();
}


/* =========================================================
   NO — RUMINATION
========================================================= */

function actionNo() {

  renderContent(`

    <div class="card">

      <h2>
        Then you're not solving a problem
        right now.
      </h2>

      <div class="notice">

        You're experiencing a thought loop.

        <br><br>

        That's okay.

        <br><br>

        We don't need to fight the thought.
        We just need to stop feeding it.

      </div>

      <p>
        <strong>
          What is your brain trying to get
          certainty about?
        </strong>
      </p>

      <input
        id="thoughtInput"
        maxlength="180"
        placeholder="One sentence only..."
      >

      <button
        class="spiral-button"
        onclick="askCertainty()">

        Continue

      </button>

    </div>

  `, 45);
}


/* =========================================================
   CERTAINTY
========================================================= */

function askCertainty() {

  const thought =
    document
      .getElementById("thoughtInput")
      .value
      .trim();


  if (!thought) {

    alert(
      "One sentence is enough."
    );

    return;
  }


  renderContent(`

    <div class="card">

      <h2>
        Can you get certainty about this
        right now?
      </h2>

      <div class="notice">

        “${escapeHTML(thought)}”

      </div>

      <div class="choices">

        <button class="choice"
                onclick="certaintyYes('${escapeAttribute(thought)}')">

          YES

        </button>

        <button class="choice"
                onclick="certaintyNo('${escapeAttribute(thought)}')">

          NO

        </button>

      </div>

    </div>

  `, 60);
}


/* =========================================================
   YES — CERTAINTY IS POSSIBLE
========================================================= */

function certaintyYes(thought) {

  renderContent(`

    <div class="card">

      <h2>
        What information or action would
        give you that certainty?
      </h2>

      <input
        id="certaintyAction"
        maxlength="180"
        placeholder="One concrete thing..."
      >

      <button
        class="spiral-button"
        onclick="saveCertaintyAction('${escapeAttribute(thought)}')">

        Continue

      </button>

    </div>

  `, 70);
}


function saveCertaintyAction(thought) {

  const action =
    document
      .getElementById("certaintyAction")
      .value
      .trim();


  if (!action) {

    alert(
      "Make it one concrete action."
    );

    return;
  }


  renderContent(`

    <div class="card">

      <h2>
        That's useful.
      </h2>

      <div class="notice">

        <strong>Thought:</strong><br>
        ${escapeHTML(thought)}

        <br><br>

        <strong>Possible action:</strong><br>
        ${escapeHTML(action)}

      </div>

      <div class="choices">

        <button class="choice"
                onclick="doAction()">

          DO IT NOW

        </button>

        <button class="choice"
                onclick="parkThought('${escapeAttribute(thought)}',
                                      '${escapeAttribute(action)}')">

          PARK IT

        </button>

      </div>

    </div>

  `, 80);
}


/* =========================================================
   NO — PARK THE THOUGHT
========================================================= */

function certaintyNo(thought) {

  parkThought(
    thought,
    "Nothing useful to do right now."
  );
}


function parkThought(thought, action) {

  state.parked.push({

    thought: thought,

    action: action,

    revisit:
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(),

    created:
      new Date().toISOString()

  });


  save();


  renderContent(`

    <div class="card">

      <h2>
        You don't need to solve this right now.
      </h2>

      <div class="notice">

        <strong>Parked:</strong><br><br>

        ${escapeHTML(thought)}

        <br><br>

        <span class="muted">

          You'll be able to revisit this later.

        </span>

      </div>

      <button
        class="spiral-button"
        onclick="chooseMission()">

        CHANGE CHANNEL

      </button>

    </div>

  `, 90);
}


/* =========================================================
   MICRO MISSIONS
========================================================= */

const missions = [

  {
    title: "Make a paper airplane",
    emoji: "✈️",
    detail:
      "Take one sheet of paper and make a paper airplane. Give yourself three throws.",
    link:
      "https://www.youtube.com/results?search_query=easy+paper+airplane"
  },

  {
    title: "Make an origami swan",
    emoji: "🦢",
    detail:
      "Make a simple origami swan. Follow a short tutorial and keep your hands moving.",
    link:
      "https://www.youtube.com/results?search_query=easy+origami+swan+beginner"
  },

  {
    title: "Draw without lifting your pen",
    emoji: "✏️",
    detail:
      "Draw your room, your face, or the object nearest you without lifting the pen from the paper."
  },

  {
    title: "Build a five-object tower",
    emoji: "🏗️",
    detail:
      "Choose exactly five safe objects near you. Build the tallest stable tower you can."
  },

  {
    title: "Memory challenge",
    emoji: "🧠",
    detail:
      "Look around and choose eight objects. Study them for 20 seconds. Look away and name as many as you can."
  },

  {
    title: "Use your other hand",
    emoji: "✍️",
    detail:
      "Write today's date and draw a tiny house using your non-dominant hand."
  },

  {
    title: "Make a paper sculpture",
    emoji: "📄",
    detail:
      "Take one sheet of paper and turn it into a tiny sculpture. No planning for more than 20 seconds."
  },

  {
    title: "Coin balance",
    emoji: "🪙",
    detail:
      "Balance a coin on the back of your hand. Switch hands. Try to beat your first attempt."
  },

  {
    title: "Paper-ball target",
    emoji: "🎯",
    detail:
      "Make five paper balls. Throw them into a bin. Change the distance after each round."
  },

  {
    title: "Reorder five things",
    emoji: "🔢",
    detail:
      "Choose five nearby objects. Arrange them from smallest to largest, then reverse the order."
  },

  {
    title: "Water + balcony",
    emoji: "💧",
    detail:
      "Drink two glasses of water. Then stand on your balcony and deliberately notice five different sounds."
  },

  {
    title: "Call someone",
    emoji: "📞",
    detail:
      "Call a friend. Don't discuss the problem. Ask them one ordinary question and stay with the conversation."
  },

  {
    title: "Find five circles",
    emoji: "⭕",
    detail:
      "Look around your room and find five objects containing a circle. Touch each one as you find it."
  },

  {
    title: "One-line drawing",
    emoji: "🖊️",
    detail:
      "Draw an animal using one continuous line. You cannot lift the pen."
  },

  {
    title: "Fold five things",
    emoji: "👕",
    detail:
      "Find five pieces of clothing and fold them carefully. Focus on making each fold clean."
  },

  {
    title: "Paper fortune teller",
    emoji: "🔮",
    detail:
      "Make a paper fortune teller. Follow the tutorial and actually finish it.",
    link:
      "https://www.youtube.com/results?search_query=easy+paper+fortune+teller"
  },

  {
    title: "Jumping frog",
    emoji: "🐸",
    detail:
      "Make an origami jumping frog and see how far it jumps.",
    link:
      "https://www.youtube.com/results?search_query=easy+origami+jumping+frog"
  },

  {
    title: "Paper heart",
    emoji: "❤️",
    detail:
      "Make a small origami heart. Give yourself five minutes and don't aim for perfection.",
    link:
      "https://www.youtube.com/results?search_query=easy+origami+heart"
  }

];


function chooseMission() {

  const mission =
    missions[
      Math.floor(
        Math.random() *
        missions.length
      )
    ];


  renderContent(`

    <div class="card">

      <h2>
        Change channels.
      </h2>

      <p class="muted">
        You don't need to feel different first.
        Do something different first.
      </p>

      <div class="mission">

        <div class="mission-emoji">
          ${mission.emoji}
        </div>

        <h3>
          ${mission.title}
        </h3>

        <p>
          ${mission.detail}
        </p>

        ${
          mission.link
            ? `
              <a
                href="${mission.link}"
                target="_blank"
                rel="noopener">

                Show me how →

              </a>
            `
            : ""
        }

      </div>

      <button
        class="spiral-button"
        onclick="finishMission()">

        I DID IT

      </button>

    </div>

  `, 100);
}


/* =========================================================
   FINISHED MISSION
========================================================= */

function finishMission() {

  state.redirected++;

  state.growth++;


  if (state.bugs > 0) {
    state.bugs--;
  }


  save();


  renderContent(`

    <div class="card">

      <div class="reward">
        🌱✨
      </div>

      <h2>
        You changed the channel.
      </h2>

      <p class="muted">
        You didn't have to solve everything.
        You just stopped feeding the loop.
      </p>

      <div class="choices">

        <button class="choice"
                onclick="showRandomQuote()">

          READ SOMETHING

        </button>

        <button class="choice"
                onclick="goHome()">

          DONE

        </button>

      </div>

    </div>

  `, 100);
}


/* =========================================================
   QUOTES
========================================================= */

function openLibrary() {

  renderQuotes();

  showScreen("libraryScreen");
}


function addQuote() {

  const text =
    document
      .getElementById("quoteText")
      .value
      .trim();

  const author =
    document
      .getElementById("quoteAuthor")
      .value
      .trim();


  if (!text) {

    alert(
      "Add a passage first."
    );

    return;
  }


  state.quotes.push({
    text: text,
    author: author || "Unknown"
  });


  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";


  save();

  renderQuotes();
}


function renderQuotes() {

  const container =
    document.getElementById("quoteList");


  if (!state.quotes.length) {

    container.innerHTML = `
      <p class="muted">
        Your library is empty.
      </p>
    `;

    return;
  }


  container.innerHTML =
    state.quotes
      .map(
        (quote, index) => `

          <div class="quote-item">

            <blockquote>
              “${escapeHTML(quote.text)}”
            </blockquote>

            <cite>
              — ${escapeHTML(quote.author)}
            </cite>

            <br>

            <button
              class="text-button"
              onclick="deleteQuote(${index})">

              Delete

            </button>

          </div>

        `
      )
      .join("");
}


function deleteQuote(index) {

  state.quotes.splice(index, 1);

  save();

  renderQuotes();
}


function showRandomQuote() {

  if (!state.quotes.length) {

    renderContent(`

      <div class="card">

        <h2>
          Your passage library is empty.
        </h2>

        <p class="muted">
          Add passages you love in the
          Library section.
        </p>

        <button
          class="spiral-button"
          onclick="goHome()">

          DONE

        </button>

      </div>

    `, 100);

    return;
  }


  const quote =
    state.quotes[
      Math.floor(
        Math.random() *
        state.quotes.length
      )
    ];


  renderContent(`

    <div class="card">

      <div class="eyebrow">
        A PASSAGE
      </div>

      <h2>
        Something to take you elsewhere.
      </h2>

      <div class="notice"
           style="font-size:19px">

        “${escapeHTML(quote.text)}”

        <br><br>

        <span class="muted">
          — ${escapeHTML(quote.author)}
        </span>

      </div>

      <button
        class="spiral-button"
        onclick="goHome()">

        DONE

      </button>

    </div>

  `, 100);
}


/* =========================================================
   PARKED THOUGHTS
========================================================= */

function openParked() {

  showScreen("parkedScreen");

  renderParked();
}


function renderParked() {

  const container =
    document.getElementById("parkedList");


  if (!state.parked.length) {

    container.innerHTML = `

      <div class="card">

        <h2>
          Nothing parked.
        </h2>

        <p class="muted">
          Good. Go live your life.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML =
    state.parked
      .map(
        (thought, index) => `

          <div class="card"
               style="margin-bottom:15px">

            <h3>
              ${escapeHTML(thought.thought)}
            </h3>

            <p class="muted">

              Possible action:

              <br>

              ${escapeHTML(thought.action)}

            </p>


            <div class="choices">

              <button
                class="choice"
                onclick="resolveThought(${index})">

                RESOLVED / DELETE

              </button>


              <button
                class="choice"
                onclick="makePlan(${index})">

                MAKE A PLAN

              </button>


              <button
                class="choice"
                onclick="parkAgain(${index})">

                PARK AGAIN

              </button>

            </div>

          </div>

        `
      )
      .join("");
}


/* =========================================================
   RESOLVE / DELETE
========================================================= */

function resolveThought(index) {

  state.parked.splice(index, 1);

  save();

  renderParked();
}


/* =========================================================
   MAKE A PLAN
========================================================= */

function makePlan(index) {

  const thought =
    state.parked[index];


  const plan =
    prompt(
      "What is one thing you could do differently next time?",
      thought.action
    );


  if (!plan) {
    return;
  }


  thought.action = plan;


  save();

  renderParked();
}


/* =========================================================
   PARK AGAIN
========================================================= */

function parkAgain(index) {

  state.parked[index].revisit =
    new Date(
      Date.now() +
      24 * 60 * 60 * 1000
    ).toISOString();


  save();

  renderParked();
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}


/* =========================================================
   CONTENT RENDERER
========================================================= */

function renderContent(html, progress = 0) {

  showScreen("mainScreen");

  document.getElementById("content").innerHTML =
    html;

  document.getElementById("progressBar").style.width =
    progress + "%";
}
