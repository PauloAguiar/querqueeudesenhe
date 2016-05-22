    function AddImageToDrawingCanvas(img, x, y) {
      lc.saveShape(LC.createShape('Image', {x: x, y: y, image: img}));
      
    }

function FixImageFromUrl(url, position) {
    if (!position) {
        position = {
            x: 0,
            y: 0,
            width: 800, //$("#drawing-canvas").width(),
            height: 600, //$("#drawing-canvas").height()
        };

        AddImage(url, position);
    }
}

function setImageCanvas() {
      var image_canvas = document.getElementById('image-canvas');
      //console.log({"offset":$("#drawing-canvas").offset(), "width":$("#drawing-canvas").width(), "height":$("#drawing-canvas").height()});
      $("#image-canvas").offset($("#drawing-canvas").offset());
      $("#image-canvas").attr('width', $("#drawing-canvas").width());
      $("#image-canvas").attr('height', $("#drawing-canvas").height());
      $("#image-canvas").width($("#drawing-canvas").width());
      $("#image-canvas").height($("#drawing-canvas").height());
    }
var image_canvas;
    var ctx;

    var canvasOffset;
    var offsetX;
    var offsetY;

    var startX;
    var startY;
    var isDown;


    var pi2;
    var resizerRadius;
    var rr;

    var draggingResizer;
    var imageX;
    var imageY;
    var imageWidth,imageHeight,imageRight,imageBottom;
    var draggingImage;
    var startX;
    var startY;
    var img;

    var hasImage;

    function AddImage(image_src = "", position) {
      $("#image-canvas").zIndex(1);
      draggingResizer={x:0,y:0};

      canvasOffset=$("#image-canvas").offset();
    offsetX=canvasOffset.left;
    offsetY=canvasOffset.top - 60;

      hasImage = true;

      img=new Image();
      img.crossOrigin = "anonymous";
      img.onload=function(){
          imageWidth=img.width;
          imageHeight=img.height;
          imageRight=imageX+imageWidth;
          imageBottom=imageY+imageHeight;
          draw(true,false);
          if(position) {
            imageX = position.x;
            imageY = position.y;
            imageWidth = position.width;
            imageHeight = position.height;
            fixImage(null, true);
          }
      };
      //console.log({"imageWidth":imageWidth, "imageHeight":imageHeight, "imageX":imageX, "imageY":imageY});
      img.src=image_src;
    }

   function ClearAll() {
      $("#image-canvas").zIndex(-1);
      ctx.clearRect(0,0,image_canvas.width,image_canvas.height);
      hasImage = false;
   }


    function draw(withAnchors,withBorders){
        if(!hasImage)
          return;

        // clear the canvas
        ctx.clearRect(0,0,image_canvas.width,image_canvas.height);

        // draw the image
        ctx.drawImage(img,0,0,img.width,img.height,imageX,imageY,imageWidth,imageHeight);

        // optionally draw the draggable anchors
        if(withAnchors){
            drawDragAnchor(imageX,imageY);
            drawDragAnchor(imageRight,imageY);
            drawDragAnchor(imageRight,imageBottom);
            drawDragAnchor(imageX,imageBottom);
        }

        // optionally draw the connecting anchor lines
        if(withBorders){
            ctx.beginPath();
            ctx.moveTo(imageX,imageY);
            ctx.lineTo(imageRight,imageY);
            ctx.lineTo(imageRight,imageBottom);
            ctx.lineTo(imageX,imageBottom);
            ctx.closePath();
            ctx.stroke();
        }

    }

    function drawDragAnchor(x,y){
        ctx.beginPath();
        ctx.arc(x,y,resizerRadius,0,pi2,false);
        ctx.closePath();
        ctx.fill();
    }

    function anchorHitTest(x,y){

        var dx,dy;

        // top-left
        dx=x-imageX;
        dy=y-imageY;
        //console.log({'achor':'test', 'dx':dx, 'dy':dy});
        if(dx*dx+dy*dy<=rr){ return(0); }
        // top-right
        dx=x-imageRight;
        dy=y-imageY;
        if(dx*dx+dy*dy<=rr){ return(1); }
        // bottom-right
        dx=x-imageRight;
        dy=y-imageBottom;
        if(dx*dx+dy*dy<=rr){ return(2); }
        // bottom-left
        dx=x-imageX;
        dy=y-imageBottom;
        if(dx*dx+dy*dy<=rr){ return(3); }
        return(-1);

    }


    function hitImage(x,y){
        //console.log({'x':x, 'y':y});
        return(x>imageX && x<imageX+imageWidth && y>imageY && y<imageY+imageHeight);
    }


    function handleMouseDown(e){
      canvasOffset=$("#image-canvas").offset();
    offsetX=canvasOffset.left;
    offsetY=canvasOffset.top - 60;

      startX=parseInt(e.clientX-offsetX);
      startY=parseInt(e.clientY-offsetY);
      //For some reason it is off by 60
      

      draggingResizer=anchorHitTest(startX,startY);
      draggingImage= draggingResizer<0 && hitImage(startX,startY);
    }

    function handleMouseUp(e){
      draggingResizer=-1;
      draggingImage=false;
      draw(true,false);
    }

    function handleMouseOut(e){
      handleMouseUp(e);
    }

    function handleMouseMove(e){
      //console.log({"imageWidth":imageWidth, "imageHeight":imageHeight, "imageX":imageX, "imageY":imageY});
      //console.log({"offsetX":offsetX, "offsetY":offsetY});

      if(draggingResizer>-1){

          mouseX=parseInt(e.clientX-offsetX);
          mouseY=parseInt(e.clientY-offsetY);

          // resize the image
          switch(draggingResizer){
              case 0: //top-left
                  imageX=mouseX;
                  imageWidth=imageRight-mouseX;
                  imageY=mouseY;
                  imageHeight=imageBottom-mouseY;
                  break;
              case 1: //top-right
                  imageY=mouseY;
                  imageWidth=mouseX-imageX;
                  imageHeight=imageBottom-mouseY;
                  break;
              case 2: //bottom-right
                  imageWidth=mouseX-imageX;
                  imageHeight=mouseY-imageY;
                  break;
              case 3: //bottom-left
                  imageX=mouseX;
                  imageWidth=imageRight-mouseX;
                  imageHeight=mouseY-imageY;
                  break;
          }

          // enforce minimum dimensions of 25x25
          if(imageWidth<25){imageWidth=25;}
          if(imageHeight<25){imageHeight=25;}

          // set the image right and bottom
          imageRight=imageX+imageWidth;
          imageBottom=imageY+imageHeight;

          // redraw the image with resizing anchors
          draw(true,true);

      }else if(draggingImage){

          imageClick=false;

          mouseX=parseInt(e.clientX-offsetX);
          mouseY=parseInt(e.clientY-offsetY);

          // move the image by the amount of the latest drag
          var dx=mouseX-startX;
          var dy=mouseY-startY;
          imageX+=dx;
          imageY+=dy;
          imageRight+=dx;
          imageBottom+=dy;
          // reset the startXY for next time
          startX=mouseX;
          startY=mouseY;

          // redraw the image with border
          draw(false,true);

      }


    }

  

 $(function() {
    hasImage = false;

    image_canvas=document.getElementById("image-canvas");
    ctx=image_canvas.getContext("2d");

    canvasOffset=$("#image-canvas").offset();
    offsetX=canvasOffset.left;
    offsetY=canvasOffset.top - 60;

    isDown=false;


    pi2=Math.PI*2;
    resizerRadius=8;
    rr=resizerRadius*resizerRadius;

    draggingResizer={x:0,y:0};

    draggingImage=false;
    
      $("#image-canvas").mousedown(function(e){handleMouseDown(e);});
  $(document).mousemove(function(e){handleMouseMove(e);});
  $(document).mouseup(function(e){handleMouseUp(e);});
  //$("#canvas").mouseout(function(e){handleMouseOut(e);});



  $("#image-canvas").dblclick(function(e){fixImage(e)});

  $("#clear-rect").on('click', ClearAll);
  });

function fixImage(e, instantFix = false) {
  if(!hasImage)
    return;

  img.width = imageWidth;
  img.height = imageHeight;

  var blankWidth = Math.max(0, ($("#drawing-canvas").width() - 800)/2);
  if(instantFix)
    blankWidth = 0;
  //console.log('blankWidth', blankWidth);

  AddImageToDrawingCanvas(img, imageX - blankWidth, imageY);
  ClearAll();
}



function previewFile() {
  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    AddImage(reader.result);
    //preview.src = reader.result;
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

