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

function likedMoviesList(){
const item= JSON.parse(localStorage.getItem("liked_movies"));
let movies;

if(item){
    movies  = item;
}else{
    movies={}
}

    return movies;
}

function likeMovie(movie){
    const likedMovies = likedMoviesList();

    if(likedMovies[movie.id]){
        likedMovies[movie.id]=undefined;
    }else{
        likedMovies[movie.id]=movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
}

//Utils o Helpers


// esta es la funcion que se encarga de insertar solo lo visible de los scroll
const lazyLoader = new IntersectionObserver((entries) =>{
    entries.forEach((entry)=>{
       if(entry.isIntersecting){
        const url = entry.target.getAttribute('data-img')
        entry.target.setAttribute('src', url)
       }
    })
})

function createMovies(movies, container, 
    {
        lazyLoad = false,
        clean = true,
    }={}
    ) {

    if(clean){
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        // creando el contenedor
        const movieContainer = document.createElement('div')
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad? 'data-img': 'src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);
        movieImg.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
        })

        // Esta parte del codigo es para cuando no cargan las imagenes agregamos una por defecto
        movieImg.addEventListener('error', ()=> {
            movieImg.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png'
            )
        });

        // Este es el boton generico que servira para dar like a las peliculas y guardar en favoritos
        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn');
        // dejar boton seleccionado de me gusta
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked')

        // movieBtn.innerHTML = "sdfdsfssgg"
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            // console.log('Se agrego nuevo elemento al storage')
            getLikedMovies();
        })


           // se tiene que agregar esta linea para que el lazy loader este escuchando
           if(lazyLoad){
            lazyLoader.observe(movieImg)
        }
        
        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
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
    // tenemos que mandar true en los parametros de createMovies si queremos que funcione el lazyLoader
    createMovies(movies, trendingMoviesPreviewList, true)

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
    });

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)


    // No olvides el true para que se active el lazyLoader
    createMovies(movies, genericSection, {lazyLoad: true})

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

function getPaginatedMoviesByCategory(id) {
    return async function () {

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBotton = scrollTop + clientHeight >= scrollHeight - 25;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBotton && pageIsNotMax) {
      page++;
      const { data } = await api('discover/movie', {
        params: {
            with_genres: id,
            page,
        },
    })

      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {

    //Documentacion: https://developers.themoviedb.org/3/search/search-movies

    const { data } = await api('search/movie', {
        params: {
            query: query,
        },
    })

    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)

    createMovies(movies, genericSection)

}

 function getPaginatedMoviesBySearch(query) {
    console.log('entro a getPaginatedMoviesBySearch')
    return async function () {
      console.log('entro al closure de getPaginatedMoviesBySearch')
      console.log(query)

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBotton = scrollTop + clientHeight >= scrollHeight - 25;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBotton && pageIsNotMax) {
      page++;
      const { data } = await api("search/movie", {
        params: {
          query,
          page,
        },
      });

      const movies = data.results;

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getTrendingMovies() {

    const {
        data
    } = await api('trending/movie/day')

    const movies = data.results;
    maxPage = data.total_pages

    createMovies(movies, genericSection, {lazyLoad: true, clean: true})

    // const btnLoad = document.createElement('button')
    // btnLoad.innerHTML = 'Cargar mas'
    // btnLoad.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoad)

}


async function getPaginatedTrendingMovies(){
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    const scrollIsBotton = (scrollTop + clientHeight)>= (scrollHeight-25)
    const pageIsNotMax = page<maxPage;
    
    if(scrollIsBotton && pageIsNotMax){
        page++
        const { data } = await api('trending/movie/day', {
            params:{
                page
            },
        });
    
        const movies = data.results;
    
        createMovies(movies, genericSection, {lazyLoad: true, clean: false})

    }

    // const btnLoad = document.createElement('button')
    // btnLoad.innerHTML = 'Cargar mas'
    // btnLoad.addEventListener('click', getPaginatedTrendingMovies)
    // genericSection.appendChild(btnLoad)
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

function getLikedMovies (){
    // console.log('Se agrego un nuevo favorito')
    const likedMovies = likedMoviesList();

    // convrtiendo el objeto en arreglo con solo los valores

    const moviesArray = Object.values(likedMovies);
    console.log(moviesArray)

   //ordenamiento a > z
    moviesArray.sort(function (a, b) {
        if (a.original_title < b.original_title) {
          return -1;
        }
       
      });

    createMovies(moviesArray, likedMociesListArticle, {lazyLoad : true, clean: true })

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