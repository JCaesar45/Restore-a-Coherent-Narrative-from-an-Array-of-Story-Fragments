const shuffledFragments = [
  { id: 15, text: "and, after a time, passed the place where the Hare was sleeping." },
  { id: 12, text: "he lay down beside the course to take a nap" },
  ,
  { id: 11, text: "and to make the Tortoise feel very deeply how ridiculous it was for him to try a race with a Hare," },
  { id: 7, text: "but for the fun of the thing he agreed." },
  { id: 19, text: "The Hare now ran his swiftest," },
  ,
  { id: 1, text: "A Hare was making fun of the Tortoise one day for being so slow." },
  { id: 14, text: "The Tortoise meanwhile kept going slowly but steadily," },
  { id: 9, text: "marked the distance and started the runners off." },
  ,
  { id: 5, text: "I'll run you a race and prove it.\"" },
  { id: 17, text: "and when at last he did wake up," },
  { id: 2, text: '"Do you ever get anywhere?" he asked with a mocking laugh.' },
  { id: 12, text: "he lay down beside the course to take a nap" },
  ,
  { id: 8, text: "So the Fox, who had consented to act as judge," },
  { id: 20, text: "but he could not overtake the Tortoise in time." },
  { id: 5, text: "I'll run you a race and prove it.\"" },
  { id: 6, text: "The Hare was much amused at the idea of running a race with the Tortoise," },
  ,
  { id: 13, text: "until the Tortoise should catch up." },
  { id: 10, text: "The Hare was soon far out of sight," },
  { id: 12, text: "he lay down beside the course to take a nap" },
  { id: 18, text: "the Tortoise was near the goal." },
];

function compactFragments(fragments) {
  const compacted = [];
  let removed = false;

  for (let i = 0; i < fragments.length; i++) {
    if (fragments[i] === undefined) {
      removed = true;
    } else {
      compacted.push(fragments[i]);
    }
  }

  if (removed) {
    console.log("[COMPACTED] Undefined fragments were removed.");
  }

  return compacted;
}

function sortFragments(fragments) {
  const sorted = fragments.slice();

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    let j = i - 1;

    while (j >= 0 && sorted[j].id > current.id) {
      sorted[j + 1] = sorted[j];
      j--;
    }

    sorted[j + 1] = current;
  }

  return sorted;
}

function dedupeFragments(fragments) {
  const deduped = [];
  const seen = {};
  const logged = {};

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];

    if (!seen[fragment.id]) {
      seen[fragment.id] = true;
      deduped.push(fragment);
    } else if (!logged[fragment.id]) {
      logged[fragment.id] = true;
      console.log(`[DEDUPED] Duplicate fragment with id ${fragment.id} was removed.`);
    }
  }

  return deduped;
}

function fillMissingFragments(fragments) {
  if (fragments.length === 0) {
    return [];
  }

  const filled = [];
  let expectedId = fragments[0].id;

  for (let i = 0; i < fragments.length; i++) {
    const fragment = fragments[i];

    while (expectedId < fragment.id) {
      filled.push({ id: expectedId, text: "[...]" });
      console.log(`[FILLED] Missing fragment with id ${expectedId} was added.`);
      expectedId++;
    }

    filled.push(fragment);
    expectedId = fragment.id + 1;
  }

  return filled;
}

function assembleStory(fragments) {
  let story = "";

  for (let i = 0; i < fragments.length; i++) {
    if (i > 0) {
      story += "\n";
    }
    story += fragments[i].text;
  }

  return story;
}

const compactedShuffledFragments = compactFragments(shuffledFragments);
const sortedFragments = sortFragments(compactedShuffledFragments);
const dedupedFragments = dedupeFragments(sortedFragments);
const filledFragments = fillMissingFragments(dedupedFragments);

console.log(assembleStory(filledFragments));
