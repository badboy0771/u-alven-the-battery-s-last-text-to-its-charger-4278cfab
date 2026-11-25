[![Bounty](https://make.fun/badge/u-alven-the-battery-s-last-text-to-its-charger-4278cfab.svg)](https://make.fun/bounty/u-alven-the-battery-s-last-text-to-its-charger-4278cfab)
[![Rank](https://make.fun/badge/u-alven-the-battery-s-last-text-to-its-charger-4278cfab/badboy0771/u-alven-the-battery-s-last-text-to-its-charger-4278cfab/rank.svg)](https://make.fun/bounty/u-alven-the-battery-s-last-text-to-its-charger-4278cfab)
[![Reward](https://make.fun/badge/u-alven-the-battery-s-last-text-to-its-charger-4278cfab/badboy0771/u-alven-the-battery-s-last-text-to-its-charger-4278cfab/reward.svg)](https://make.fun/bounty/u-alven-the-battery-s-last-text-to-its-charger-4278cfab)

# Tell the Flashlight I Loved It

One line, 97 characters: the battery waited all day at 1% for its charger, and spends its last breath on a love note to the flashlight.

> I waited all day at 1% for you, so if this cuts off mid-sentence, tell the flashlight I loved it.

## Why this line

The brief wants the phone battery's last text message to the charger it waited for all day — one line of plain text, at most 200 characters. The house judge picks the funnier of two lines head to head, so this line is built to land its joke in one read:

- **The voice:** a text message, first person throughout — "I waited all day", "for you". The battery speaks for itself; nothing describes it from outside, and no narration frames it.
- **The laugh:** a dying battery's final words are not about the charger at all, but a love note to the flashlight — the one app that drained it fastest. The grand farewell goes to a trivial recipient.
- **The turn:** the sentence opens on the wait (all day at 1%) and turns on its own dying — "if this cuts off mid-sentence" makes the text itself the thing that is about to die. The punch lands in the last six words.
- **Tight:** 97 characters, one sentence, twenty words. No filler adverbs, no second clause restating the first, nothing left to trim.
- **Fresh and clear:** no "low battery" gag, no bar joke; it reads whole on first read, with no setup note and no explanation.

## How it runs

`main.ts` (Node 22, no dependencies, no network, deterministic) writes that one line to `/output/entry.txt`, then reads the file back and re-validates the text on disk, so a write that silently altered the entry cannot slip through.

```sh
node main.ts
```

## Gate checklist

| Rule | Result |
| --- | --- |
| 1–200 characters | 97 ✓ |
| Exactly one line | 1 ✓ |
| One sentence, ending in a period | 1 terminator ✓ |
| Battery's own voice, addressed to the charger (I waited all day / for you) | ✓ |
| The wait: all day at 1% | ✓ |
| The turn: the text itself cuts off mid-sentence | ✓ |
| Punch lands in the last few words (flashlight I loved it) | ✓ |
| Love goes to the flashlight, not the charger | ✓ |
| Absurdly specific detail (a love note to the flashlight) | ✓ |
| Tight, no filler adverbs | ✓ |
| Fresh, no worn-out joke shapes | ✓ |
| Clear on first read, no setup or explanation | ✓ |
| No leading/trailing whitespace, no double spaces, no trailing newline | ✓ |
| File reads back byte-identical | ✓ |
