const connection_api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
});
connection_api.defaults.headers.common['X-API-KEY'] = 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh';

// const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=2';
// const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
// const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const containerRandom = document.querySelector('#randomCats-container');
const containerFavorite = document.querySelector('#favoriteCats-container');
const containerPreview = document.querySelector('#imgPreviewContainer');
const errorMessageRandom = document.querySelector('#randomCats-error');
const errorMessageFavorite = document.querySelector('#favouritesCats-error');
const inputPreview = document.querySelector('#file');

async function loadRandomCats() {
    const { data, status } = await connection_api.get('/images/search?limit=4')
        .catch(function(error){
            if (error) {
                errorMessageRandom.innerHTML = `
                    <p class="px-4 pt-4"><i class="fa-solid fa-circle-exclamation"></i> There was an error:</p>
                    <p class="px-4 pt-2">${error.message}</p>
                    <p class="px-4 pt-2 pb-4">${error.request.response}</p>
                `;
                return;
            }
        });
    
    console.log("Random status code: " + status);
    
    containerRandom.innerHTML = "";
    
    data.forEach(cat => {
        const article = document.createElement('article');
        article.classList.add('w-48','h-64','border','border-gray-200','rounded-lg','shadow','bg-zinc-500');
        const img = document.createElement('img');
        img.classList.add('h-4/5','w-full','object-cover','object-center','rounded-t-lg');
        const div = document.createElement('div');
        div.classList.add('flex','justify-center','py-2');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid','fa-plus','mx-1','font-semibold');
        const btn = document.createElement('button');
        btn.classList.add('text-white','w-auto','rounded-md','bg-blue-700','px-3','py-1.5','text-sm','hover:bg-blue-800');
        const btnText = document.createTextNode('Add to Favorites');
        
        btn.appendChild(icon);
        btn.appendChild(btnText);
        btn.onclick = () => saveFavouriteCat(cat.id);
        img.src = cat.url;
        article.appendChild(img);
        article.appendChild(div);
        div.appendChild(btn);
        containerRandom.appendChild(article);
    });
}

async function loadFavouriteCats() {
    const { data, status } = await connection_api.get('/favourites?order=DESC')
        .catch(function(error){
            if (error) {
                errorMessageFavorite.innerHTML = `
                    <p class="px-4 pt-4"><i class="fa-solid fa-circle-exclamation"></i> There was an error:</p>
                    <p class="px-4 pt-2">${error.message}</p>
                    <p class="px-4 pt-2 pb-4">${error.request.response}</p>
                `;
                return;
            }
        });

    console.log('Favorites status code: ' + status);
    
    containerFavorite.innerHTML = "";
    
    data.forEach(cat => {
        const article = document.createElement('article');
        article.classList.add('w-64','h-80','border','border-gray-300','rounded-lg','shadow');
        const img = document.createElement('img');
        img.classList.add('h-4/5','w-full','object-cover','object-center','rounded-t-lg');
        const div = document.createElement('div');
        div.classList.add('flex','justify-center','h-1/5','rounded-b-lg','py-3','bg-slate-400');
        const icon = document.createElement('i');
        icon.classList.add('fa-regular','fa-trash-can','mx-1','font-light');
        const btn = document.createElement('button');
        btn.classList.add('text-white','w-auto','rounded-md','bg-indigo-600','px-3','py-1.5','text-sm','hover:bg-indigo-700');
        const btnText = document.createTextNode('Remove from favorites');
        
        btn.appendChild(icon);
        btn.appendChild(btnText);
        btn.onclick = () => deleteFavouriteCat(cat.id);
        img.src = cat.image.url;
        article.appendChild(img);
        article.appendChild(div);
        div.appendChild(btn);
        containerFavorite.appendChild(article);
    });
}

async function saveFavouriteCat(id) {
    const { data, status } = await connection_api.post('/favourites', { image_id: id })
        .catch(function(error){
            if (error) {
                Swal.fire({
                    icon: "error",
                    text: "Could not add to Favorites list",
                });
            }
        });
    
    console.log("Status code when saving: " + status);
    
    if (status == 200) {
        Swal.fire({
            text: "Neko successfully added to Favorites",
            icon: "success"
        });
       
        loadFavouriteCats();    
    }
}

async function loadPreviewImage() {
    const archivo = inputPreview.files;

    if (!archivo || !archivo.length) {
        containerPreview.innerHTML = `
            <p class="text-center text-white font-thin"><i class="fa-regular fa-image mx-2"></i>Preview</p>
        `;
    } else {
        containerPreview.innerHTML = "";

        const primerArchivo = archivo[0];
        const objectURL = URL.createObjectURL(primerArchivo);
        
        const img2 = document.createElement('img');
        img2.classList.add('h-52','w-52','rounded-lg','object-cover','object-center')
        img2.src = objectURL;
        containerPreview.appendChild(img2);
    }
}

async function uploadPhotoCat() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    
    if (formData.get('file').size <= 0) {
        Swal.fire({
            icon: "error",
            text: "You must select an image before continuing",
        });
        return;
    }
    
    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'X-API-KEY': 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh',
        },
        body: formData,
    });

    const data = await res.json();
    
    if (res.status !== 201) {
      
        Swal.fire({
            icon: "error",
            text: "An error occurred and the photo could not be uploaded",
        });
    } else {
        Swal.fire({
            text: "The photo was added successfully",
            icon: "success"
        });
        
        containerPreview.innerHTML = `
            <p class="text-center text-white font-thin"><i class="fa-regular fa-image mx-2"></i>Preview</p>
        `;
        inputPreview.value = "";
        saveFavouriteCat(data.id);
        loadFavouriteCats();
    }
}

async function deleteFavouriteCat(id) {
    const { data, status } = await connection_api.delete(`/favourites/${id}`)
        .catch(function(error){
            if (error) {
                Swal.fire({
                    icon: "error",
                    text: "An error occurred and the Neko could not be removed from the list",
                });
            }
        });
    
    console.log("Status code on Delete: " + status);
    
    if (status == 200) {
        Swal.fire({
            text: "Neko was removed from Favorites",
            icon: "success"
        });
        loadFavouriteCats();
    }
}

loadRandomCats();
loadFavouriteCats();

inputPreview.addEventListener("change", () => {
    //e.preventDefault();
    loadPreviewImage();
})
