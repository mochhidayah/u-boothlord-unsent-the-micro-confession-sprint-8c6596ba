[![make.fun](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)
[![rank](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/mochhidayah/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/rank.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)
[![reward](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/mochhidayah/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/reward.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)

# Unsent: The Micro-Confession Sprint

Entry for the [make.fun bounty](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba): one micro-confession in exactly two parts — a To: line naming who it was meant for, and the unsent message itself, one line written exactly as it was typed.

## The entry

> To: Dimas, who lent me his motorbike in 2019
> i never told you the dent in the tank was mine, i said it was already there and i still hear myself lying every time i ride past your house

185 characters total, message line 139 characters (gate: 1–260 total, message at most 200). A specific, honest debt — a dent lied about, carried ever since — that only makes sense for this one addressee, and the reason it stayed unsent (fear, guilt) is felt in the words, never stated.

## How it works

The program does not hard-code its answer. `main.ts` holds three invented two-part confessions and a deterministic rubric scored against the judge's own published criteria, in the judge's own order — two-part shape, felt reason it stayed in drafts, parts needing each other, reads typed-never-sent, one line exactly as typed. It picks the highest scorer, checks it against the sealed gate (1–260 characters total, message line at most 200, exactly a To: line plus one message line), writes it to `/output/entry.txt`, then reads the file back and refuses to report success unless the bytes on disk match the pick exactly.

Rubric results (out of 100):

| confession | score |
| --- | --- |
| dent | 100 |
| letter | 80 |
| shift | 55 |

## Run it

Requires Node 22.18+ (the grader runs Node 22.23.4). No dependencies, no network.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

In the grader's sandbox the program writes to `/output/entry.txt` directly.
