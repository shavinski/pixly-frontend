import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PixlyApi } from "./API";
import './UploadForm.css';


function UploadForm() {
  const canvasRef = useRef();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  console.log('SELECTED PHOTO', selectedPhoto);

  function handleSubmit(evt) {
    evt.preventDefault();
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Save the canvas as a new image
        canvas.toBlob((blob) => {
          const convertedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });

          setSelectedPhoto(convertedFile);
        }, file.type);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }

  function applyWashOut() {
    window.Caman(`#canvas`, function () {
      this.brightness(10);
      this.contrast(90);
      this.sepia(60);
      this.saturation(-30);
      this.render();
    });
  }

  function applySepia() {
    window.Caman(`#canvas`, function () {
      this.brightness(10);
      this.contrast(30);
      this.sepia(60);
      this.saturation(-30);
      this.render();
    });
  }

  function applyRithm() {
    window.Caman(`#canvas`, function () {
      this.vibrance(81);
      this.hue(100);
      this.clip(42);
      this.contrast(30);
      this.exposure(14);
      this.render();
    });
  }

  async function handleUpload(evt) {
    evt.preventDefault();
    if (selectedPhoto) {

      const canvas = canvasRef.current;
      canvas.toBlob(async function (blob) {
        // Create a FormData object to send the Blob as part of the request
        const formData = new FormData();
        formData.append('image', blob);

        await PixlyApi.uploadPhoto(formData);
        navigate('/photos');
      });
    }
  };

  return (
    <div className="upload-img-container m-4">
      <div className="row">
        <div className="col-md-10 m-auto">
          <form>
            <div className="custom-file mb-3">
              <input
                type="file"
                className="custom-file-input"
                name="image"
                id="upload-file"
                onChange={handleSubmit}
              />
              <label htmlFor="upload-file" className="custom-file-label">
                Select image
              </label>
            </div>
          </form>
          <div>
            <canvas
              ref={canvasRef}
              id="canvas"
              style={{maxInlineSize: '500px'}}>
            </canvas>
          </div>
          <div>
            <button className="upload-photo btn btn-ig" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
      </div>

      <div className="row filter-btns">
        <div className="col-md-10 m-auto">
          <button className="m-3 btn btn-ig" onClick={applyWashOut}>Washout</button>
          <button className="m-3 btn btn-ig" onClick={applySepia}>Sepia</button>
          <button className="m-3 btn btn-ig" onClick={applyRithm}>Rithm</button>
        </div>
      </div>
    </div>
  );
}
export default UploadForm;


/*   useEffect(() => {
    window.Caman(`#robert`, function () {
      this.brightness(10);
      this.contrast(30);
      this.sepia(60);
      this.saturation(-30);
      this.render();
    });
  }, [robertImage]);

 <div className="row">
        <img
          src={robertImage}
          alt=""
          style={{ width: 200, height: 200 }}
        />
        <img
          id="robert"
          // ref={robert}
          src={robertImage}
          alt=""
          style={{ width: 200, height: 200 }}
        />
      </div>

 ******* function CODE STARTS HERE

        formData.append('image', selectedPhoto);

  ****** FUNCTION CODE ENDS HERE
*/
