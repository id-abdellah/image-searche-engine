const searchInput = document.querySelector(".search input");
const searchIcon = document.querySelector(".search .icon");

const images_wrapper = document.querySelector(".images_wrapper");

const loadMore = document.querySelector("section.gallery button.loadMore");

const lightbox = document.querySelector(".lightbox");

// const imageContainer = document.querySelectorAll(".imgContainer img");

let page = 1;
let perPage = 20;

let youSearched = false;


/* Curated Images. When reload */
const API_URL = "https://api.pexels.com/v1/curated?page=1&per_page=20";
const config = {
    method: "GET",
    headers: {
        Authorization: "b1YnQbmRjTIIun0dB8KaTDAxiFMZsuL7MR1zmpvRg6zWMObCzatGmR7K"
    }
}

function downloadimg(imgUrl) {
    fetch(imgUrl).then(
        (res) => {
            let file = res.blob();
            return file
        }
    ).then(
        (file) => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click()
        }
    )
}

function getData(API_URL) {
    fetch(API_URL, config).then(
        (result) => {
            let myData = result.json();
            return myData;
        }
    ).then(
        (imgsData) => {
            let arrayPhotos = imgsData.photos;

            let divPage = document.createElement("div");
            divPage.className = `page-${page}`;
            images_wrapper.appendChild(divPage)
            for (let i = 0; i < arrayPhotos.length; i++) {
                let currentPhoto = arrayPhotos[i];
                divPage.innerHTML += `
                <div class="imgContainer">
                    <img class="anImg" src="${currentPhoto.src.large}" alt="" loading="lazy">
                    <div class="details">
                        <div class="photographer">
                            <div class="icon"><i class="fa-solid fa-camera"></i></div>
                            <div class="name">${currentPhoto.photographer}</div>
                        </div>
                        <button onclick="downloadimg('${currentPhoto.src.large2x}')"><i class="fa-solid fa-download"></i></button>
                    </div>
              </div>
                `;
            }
        }
    );
}


getData(`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`)

const loadMoreImages = () => {
    if (page === perPage) return;
    page++;
    let api_url = null;
    if (youSearched == true) {
        api_url = `https://api.pexels.com/v1/search?query=${searchInput.value}}&page=${page}&per_page=${perPage}`;
    } else {
        api_url = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
    }
    getData(api_url);
}

loadMore.addEventListener("click", loadMoreImages);

/* Searched images */

searchIcon.addEventListener("click", () => {
    if (searchInput.value == "") return;
    images_wrapper.innerHTML = "";
    if (youSearched == false) {
        youSearched = true;
    }
    page = 1;
    getData(`https://api.pexels.com/v1/search?query=${searchInput.value}}&page=${page}&per_page=${perPage}`)
})

/* img lightbox */

document.addEventListener("click", (e) => {
    let target = e.target;
    if (target.className != "anImg") return;

    let imgContainer = target.parentElement;
    let imgContainer_imgSrc = imgContainer.firstElementChild.src;
    let imgContainer_photographerName = imgContainer.querySelector(".details .photographer .name").textContent;

    lightbox.style.display = "flex";
    lightbox.innerHTML = `
    <div class="content">
        <div class="head">
            <div class="photographer-infos">
                <div class="icon"><i class="fa-solid fa-camera"></i></div>
                <div class="name">${imgContainer_photographerName}</div>
            </div>
            <div class="actions">
                <button onclick="downloadimg('${imgContainer_imgSrc}')" class="down"><i class="fa-solid fa-download"></i></button>
                <button class="closeLightbox"><i class="fa-solid fa-xmark"></i></button>
            </div>
        </div>

        <div class="img-itself">
        <img
            src="${imgContainer_imgSrc}" alt="">
        </div>

    </div>
    `;
    let closeLightbox = document.querySelector(".closeLightbox");
    closeLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    })
})