//Uso de location y hash navigation
//aqui va la mayoria de la logica de la aplicacion
//Los tag que se modifican vienen de nodes.js
let maxPage;
let page = 1;
let infiniteScroll;

//Boton de busqueda
searchFormBtn.addEventListener('click', ()=>{

    location.hash = '#search='+searchFormInput.value;
});

//Boton ver mas
trendingBtn.addEventListener('click', ()=>{
    location.hash = '#trends='
});

//Boton Flecha de retorno
arrowBtn.addEventListener('click', ()=>{
    // console.log(history) buscar que solo navegue hacia atras en nuestra url, que no vaya a otra
    history.back();
    // location.hash = '#home'
});


window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);


function navigator() {
    // console.log(location)
    console.log("Entro a Navigation")

    if(infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')) {
        trendsPage();
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
        homePage();

    }

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    // location.hash = trends // asi puedes probarlo en la consola

    if(infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive:false})
    }
}

function homePage() {
    console.log('Home')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoriesPage() {
    console.log('Categories!!!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,categoryData] = location.hash.split('='); // ['#category','id-name']
    const [categoryId, categoryName] = categoryData.split('-');
    const categoryName2 = decodeURI(categoryName)
    headerCategoryTitle.innerHTML = categoryName2

    console.log(categoryId)
    getMoviesByCategory(categoryId);

    infiniteScroll = getPaginatedMoviesByCategory(categoryId)
}

function movieDetailsPage() {
    console.log('MOVIE!!!!')

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    // array ['#movie','idMovie']
    const[__,movieId] = location.hash.split('=')
    getMovieById(movieId);

}

function searchPage() {
    console.log('SEARCH!!!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // array ['#search','buscado']
    const[__,query] = location.hash.split('=')
    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query)
}

function trendsPage() {
    console.log('TRENDS!!!!')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias'

    getTrendingMovies();

    infiniteScroll = getPaginatedTrendingMovies
}

