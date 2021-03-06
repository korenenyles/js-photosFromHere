//API key
//97ba3134de42b898bdc7d414d4e197ea

//Secret:
//c488af71cbe36e11
const USE_PROXY = true;
const defaultSearchTerm = "photography";

const fallbackLocation = { latitude: 40.4236, longitude: -86.11416 };

let currentPhotoIndex = 0;

function assembleSearchURL(coords, seachTerm = defaultSearchTerm) {
  const proxy = "https://cors-anywhere.herokuapp.com/";
  return (
    (USE_PROXY ? proxy : ``) +
    `https://flickr.com/services/rest/?` +
    `api_key=97ba3134de42b898bdc7d414d4e197ea&` +
    `format=json&` +
    `nojsoncallback=1&` +
    `method=flickr.photos.search&` +
    `safe_search=1` +
    `per_page=5&` +
    ` text=${seachTerm}&` +
    `lat=${coords.latitude}&` +
    `lon=${coords.longitude}`
  );
}

function assembleImageSourceURL(photoObj) {
  return (
    `http://farm${photoObj.farm}.staticflickr.com/` +
    `${photoObj.server}/` +
    `${photoObj.id}_${photoObj.secret}.jpg`
  );
}

function assembleImagePageURL(photoObj) {
  return `http://www.flickr.com/photos/${photoObj.owner}/${photoObj.id}`;
}

function displayPhoto(photoObj) {
  const photoContainer = document.querySelector("#photoContainer");
  photoContainer.innerHTML = "";
  const urlContainer = document.querySelector("#urlContainer");
  urlContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = assembleImageSourceURL(photoObj);
  photoContainer.appendChild(img);

  const link = document.createElement("a");
  link.href = assembleImagePageURL(photoObj);
  link.appendChild(document.createTextNode("See on Flickr"));
  urlContainer.appendChild(link);
}

function wireUpNextButton(photoArray) {
  document.querySelector("#next").addEventListener("click", function(evt) {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoArray.length;
    displayPhoto(photoArray[currentPhotoIndex]);
  });
}

function fetchPhotos(coords) {
  fetch(assembleSearchURL(coords))
    .then(response => response.json())
    .then(data => {
      const photoArray = data.photos.photo;
      if (photoArray.length > 0) {
        wireUpNextButton(photoArray);
        displayPhoto(photoArray[currentPhotoIndex]);
      } else {
        console.error(new Error("No Image Found"));
      }
    });
}

function onGeolocationSuccess(location) {
  fetchPhotos(location.coords);
}

function onGeolocationFailure() {
  console.log("Geollocation failure. Using FallBack.");
  fetchPhotos(fallbackLocation);
}

navigator.geolocation.getCurrentPosition(
  onGeolocationSuccess,
  onGeolocationFailure
);

//followed along with Randy's demo.
//Assisted by Janell Huyck, Chris Wilson, and Sasha Lukas for Bugs
