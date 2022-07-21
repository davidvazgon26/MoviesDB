// aca son los llamados a la API de Movies DB

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY
    },
});

//Utils o Helpers

function createMovies(movies, container) {
    container.innerHTML = '';

    movies.forEach(movie => {

        // creando el contenedor
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
    });
}

function createCategories(categories, container) {
    container.innerHTML = '';

    categories.forEach(category => {

        // creando el contenedor
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        //Creando el elemento
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
            location.hash = '#category=' + category.id + '-' + category.name;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer)

    });

}

//Llamados a la API

async function getTrendingMoviesPreview() {

    const {
        data
    } = await api('trending/movie/day')

    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList)

    // Generacion automatica de elementos
    // trendingMoviesPreviewList.innerHTML = ''

    // movies.forEach(movie => {

    //     // creando el contenedor
    //     const movieContainer = document.createElement('div')
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

    //     movieContainer.appendChild(movieImg);
    //     trendingMoviesPreviewList.appendChild(movieContainer);
    // });
}


async function getCategoriesPreview() {

    const {
        data
    } = await api('genre/movie/list')
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList)
    // Generacion automatica de elementos

    // categoriesPreviewList.innerHTML = '';

    // categoties.forEach(category => {

    //     // creando el contenedor
    //     const categoryContainer = document.createElement('div');
    //     categoryContainer.classList.add('category-container');

    //     //Creando el elemento
    //     const categoryTitle = document.createElement('h3');
    //     categoryTitle.classList.add('category-title');
    //     categoryTitle.setAttribute('id', 'id'+category.id);
    //     categoryTitle.addEventListener('click', ()=>{
    //         location.hash= '#category='+category.id + '-' + category.name;
    //     })
    //     const categoryTitleText = document.createTextNode(category.name);

    //     categoryTitle.appendChild(categoryTitleText);
    //     categoryContainer.appendChild(categoryTitle);
    //     categoriesPreviewList.appendChild(categoryContainer)

    // });
}


async function getMoviesByCategory(id) {

    const {
        data
    } = await api('discover/movie', {
        params: {
            with_genres: id,
        },
    })

    const movies = data.results;

    createMovies(movies, genericSection)

    // Generacion automatica de elementos
    // genericSection.innerHTML = ''

    // movies.forEach(movie => {

    //     // creando el contenedor
    //     const movieContainer = document.createElement('div')
    //     movieContainer.classList.add('movie-container');

    //     const movieImg = document.createElement('img');
    //     movieImg.classList.add('movie-img');
    //     movieImg.setAttribute('alt', movie.title);
    //     movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

    //     movieContainer.appendChild(movieImg);
    //     genericSection.appendChild(movieContainer);
    // });
}

async function getMoviesBySearch(query) {

    //Documentacion: https://developers.themoviedb.org/3/search/search-movies

    const {
        data
    } = await api('search/movie', {
        params: {
            query: query,
        },
    })

    const movies = data.results;
    createMovies(movies, genericSection)

}


async function getTrendingMovies() {

    const {
        data
    } = await api('trending/movie/day')

    const movies = data.results;

    createMovies(movies, genericSection)

}


async function getMovieById(id) {

    const { data: movie } = await api('/movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w300' + movie.poster_path;
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),
        url(${movieImgUrl})`;

    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_averange;

    createCategories(movie.genres, movieDetailCategoriesList)

    getRelatedMoviesId(id);
}

async function getRelatedMoviesId(id){

    const { data } = await api(`/movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies, relatedMoviesContainer);

}





/*Este es el codigo con fetch, el cual se cambio por Axios

async function getTrendingMoviesPreview(){

    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key='+ API_KEY)
    const data = await res.json();

    const movies = data.results;
    // Generacion automatica de elementos
    movies.forEach(movie => {
        // Seleccionando la seccion donde haremos append de los elementos
        const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList')

        // creando el contenedor
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
    });
}


async function getCategoriesPreview(){

    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key='+ API_KEY)
    const data = await res.json();

    const categoties = data.genres;
    // Generacion automatica de elementos
    categoties.forEach(category => {
        
        const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list')

        // creando el contenedor
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        //Creando el elemento
        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id'+category.id);
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer)
        
    });
}


getTrendingMoviesPreview();
getCategoriesPreview();

*/