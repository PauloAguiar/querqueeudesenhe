var canvas;
    var context;

    $(document).ready(function() {
      lc = LC.init(
            document.getElementsByClassName('lite')[0],
            {imageURLPrefix: './lib/img', backgroundColor: 'white',
            imageSize: {width: 800, height: 600}}
        );
    canvas = document.getElementById('drawing-canvas');
    setImageCanvas();
    context = canvas.getContext('2d');
    
  });