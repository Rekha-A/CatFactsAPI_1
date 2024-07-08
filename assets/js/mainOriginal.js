const connection_api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
});
connection_api.defaults.headers.common['X-API-KEY'] = 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh';


const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=2';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVOURITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('error');

async function loadRandomMichis() {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    console.log('Random');
    console.log(data);

    if (res.status !== 200) {
        spanError.textContent = "There was a mistake: " + res.status;
    } else {
        const img1 = document.getElementById('img1');
        const img2 = document.getElementById('img2');
        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        
        img1.src = data[0].url;
        img2.src = data[1].url;

        btn1.onclick = () => saveFavouriteMichi(data[0].id);
        btn2.onclick = () => saveFavouriteMichi(data[1].id);
    }
}

async function loadFavouriteMichis() {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh',
        },
    });
    const data = await res.json();

    console.log('Favoritos');
    console.log(data);

    if (res.status !== 200) {
        spanError.innerHTML = "There was a mistake: " + res. status + "<br>" + data.message;
    } else {
        const section = document.getElementById('favoriteMichis')
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Favorite Michis');
        h2.appendChild(h2Text);
        section.appendChild(h2);
        
        data.forEach(michi => {
            const article = document.createElement('article');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Remove michi from favorites');
            
            btn.appendChild(btnText);
            btn.onclick = () => deleteFavouriteMichi(michi.id);
            
            img.src = michi.image.url;
            img.width = 150;
            article.appendChild(img);
            article.appendChild(btn);
            section.appendChild(article);
        });
    }
}

async function saveFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh',
        },
                
        body: JSON.stringify({
            image_id: id,
        }),
    });
    const data = await res.json();
            
    console.log('Saved Kitten');
    console.log(res);

    if (res.status !== 200) {
        spanError.innerHTML = "There was a mistake: " + res.status + data.message;
    } else {
        console.log('Michi added to favorites')
        loadFavouriteMichis();
    }
}

async function deleteFavouriteMichi(id) {
    const res = await fetch(API_URL_FAVOURITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh',
        },
    });
    const data = await res.json();
    
    if (res.status !== 200) {
        spanError.innerHTML = "There was a mistake: " + res.status + data.message;
    } else {
        console.log('Michi added to favoritess')
        loadFavouriteMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    
    // console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_b4Q3YyUrueAqjk7Ch6UKAdsd64vDQEcUCTCqjtWNczbGdixz98TD4R9rVfmn5iHh',
        },
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `There was an error uploading michi: ${res.status} ${data.message}`
    } else {
        console.log("Photo of michi uploaded.");
             saveFavouriteMichi(data.id);
        loadFavouriteMichis();
    }
}

loadRandomMichis();
loadFavouriteMichis();
