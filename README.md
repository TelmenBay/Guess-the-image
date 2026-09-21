# Guess the Image — The Duel

A local 2-player image duel inspired by *The Floor*. One screen, two players,
two independent clocks. Look at the image, say the answer, press **Space**.

## Run it

Open `index.html` in a browser. No server, no build step, no dependencies.
Press **Fullscreen** on the setup screen (or **F** during play) for TV mode.

## Adding images

1. Put the image file in `images/<category>/` (any browser-supported format:
   jpg, png, webp, gif, svg…).
2. Add one line to `images.js`:

```js
{ src: "images/animals/dog.jpg", answer: "Dog", category: "Animals" },
```

That's it. The category slider and image counts update automatically.
`answer` and `category` are optional — if omitted they're derived from the
file name and folder name (`images/food/hot_dog.jpg` → "Hot Dog" / "Food").

## How a duel works

- Both players start with the chosen time (30 / 45 / 60 s). Each clock only
  runs during that player's turn and carries over between turns.
- Player 1 sees an image; their clock runs. When they say the answer
  correctly, press **Space**: their clock freezes, the answer is shown for a
  moment, then the next image appears and Player 2's clock starts.
- Press **P** to pass: the answer is shown briefly, then the same player gets
  a new image. Their clock keeps running the whole time, so a pass costs about
  a second. You can't pass on the last remaining image.
- Space and P do nothing during the answer reveal, a pass, or the switch.
- Images are shuffled each game and never repeat within a game.
- The first clock to hit 0 loses. If every image in the category is used up
  first, the player with the most time left wins.

## Keys

| Key       | When            | Does                                  |
|-----------|-----------------|---------------------------------------|
| `Enter`   | Setup           | Start the duel                        |
| `Space`   | During a turn   | Mark the current image as answered    |
| `P`       | During a turn   | Pass — new image, clock keeps running |
| `Space`   | Results         | Rematch with the same settings        |
| `Esc`     | Anywhere in game| Back to setup                         |
| `F`       | During the game | Toggle fullscreen                     |

## Tuning

Timings and thresholds (reveal length, warning/danger seconds, countdown) are
constants at the top of `game.js`. Player colours are in `:root` in `style.css`.
