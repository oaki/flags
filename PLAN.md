# Vlajkovy svet MVP plan

## Product direction

Turn the app from a plain flag quiz into a Europe-first world journey for kids:

1. One clear adventure loop: choose mode and difficulty, answer a flag question, get a useful hint or story, unlock a country in the album.
2. Adaptive difficulty: fewer answer options for younger kids, more options and similar flags for older kids.
3. Learning feedback: after wrong answers explain the distinguishing detail instead of only saying "wrong".
4. Local progress only: no accounts, no tracking, parent overview stored in the browser.
5. Europe MVP first: make the first continent feel good before expanding the same mechanics worldwide.

## Phase 1 implementation scope

- Add difficulty presets: Baby Explorer, Junior Quiz, Flag Master.
- Add mode switch: Journey and Similar Flags.
- Add a Flag Painter mode with tap-to-fill color slots.
- Add daily challenge and achievement feedback.
- Prefer weak countries and undiscovered countries when selecting questions.
- Store per-country attempts/correct answers/mistakes in localStorage.
- Show smart hints and parent overview.
- Keep the existing album, speech toggle, and level structure working.

## Next phases

- Add a simple Europe map screen.
- Expand Flag Painter into drag/drop with flag-specific symbols and crests where useful.
- Replace the mini Europe progress grid with a real geographic SVG map.
- Add daily challenge and printable worksheets.
- Add Slovak/English language switch.
