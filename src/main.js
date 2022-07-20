

const api = axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type': 'application/json;charset=utf-8',
    },
    params:{
        'api_key': API_KEY
    },
});

async function getTrendingMoviesPreview(){

    const {data} = await api('trending/movie/day')

    const movies = data.results;
    // Generacion automatica de elementos

    trendingMoviesPreviewList.innerHTML = ''

    movies.forEach(movie => {
    
        // creando el contenedor
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer);
    });
}


async function getCategoriesPreview(){

    const {data} = await api('genre/movie/list')
    const categoties = data.genres;
    // Generacion automatica de elementos

    categoriesPreviewList.innerHTML = '';

    categoties.forEach(category => {
        
        const categoriesPreviewList = document.querySelector('#categoriesPreview .categoriesPreview-list')

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
        categoriesPreviewList.appendChild(categoryContainer)
        
    });
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