$("#gallery").hide();
    isHidden = true;

    function ToggleGallery() {
      if(isHidden) {
        $("#gallery").show();
        isHidden = false;
      }
      else {
        $("#gallery").hide();
        isHidden = true;
      }
    }

    function AddSelectedImage() {
      AddImage($(".selected").children(".image_picker_image").attr("src"));
    }

    $("select.image-picker").imagepicker({
        hide_select:  false,
      });