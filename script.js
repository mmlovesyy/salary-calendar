var fan = document.getElementById('dollar-bill');

var cw = new KeyframeEffect(
  fan, [{
      transform: "translateY(-80%)"
    },
    {
      transform: "translateY(80%)",
    }
  ], {
    // timing options
    duration: 80,
    iterations: Infinity,
  });

// Creates new Animation object and starts it in clockwise rotation
// NOTE(BB): No need for document.timeline, it's the default.
var fananim = new Animation(cw/*, document.timeline*/);

// Stops Animation so it doesnt run automatically
// NOTE(BB): It only runs automatically if you use Element.animate()
// fananim.pause();

var clockwise = function() {
 cw.setKeyframes(
    [{
        transform: "translateY(-80%)"
      },
      {
        transform: "translateY(80%)",
      }
    ]
  );
  fananim.play();
}

var stop = function() {
  fananim.pause();
}

// Click Handlers for Buttons on Control Baord
var ela = document.getElementById("paper");
ela.addEventListener("click", clockwise, false);

var elc = document.getElementById("stop");
elc.addEventListener("click", stop, false);
