// import services and utilities
import { getDogs } from './services/adopt-service.js';

// import component creators
import createFilter from './components/Filter.js';
import createPaging from './components/Paging.js';
import createDogList from './components/DogList.js';

// declare state variables
let breed = '';
let age = 0;
let page = 1;
let pageSize = 5;
let totalPages = 0;
let dogs = [];

// handler functions
async function handlePageLoad() {
    const params = new URLSearchParams(window.location.search);
    // *** set state from params
    // breed
    breed = params.get('breed') || '';
    // age (make sure a number, default to 0)
    age = Number(params.get('age')) || 0;
    // page (make sure a number, default to 1)
    page = Number(params.get('page')) || 1;
    // pageSize (make sure a number, default to 5
    pageSize = Number(params.get('pageSize')) || 5;
    // calculate start and end of range from page and pageSize
    const start = (page - 1) * pageSize;
    const end = (page * pageSize) - 1;

    const { data, count } = await getDogs(breed, age, { start, end });
    dogs = data;

    // set totalPages from calculating based on count and page Size
    totalPages = Math.ceil(count / pageSize);
    display();

    display();
}

function handleFilter(filter) {
    const params = new URLSearchParams(window.location.search);
    // *** set breed, age, and page params based on filter
    params.set('breed', filter.breed);
    params.set('age', filter.age);
    params.set('page', 1);
    window.location.search = params.toString();
}

function handlePaging(change, size) {
    const params = new URLSearchParams(window.location.search);
    // *** set page and pageSize params based on change and PageSize
    // make sure page not less than 1
    page = size === pageSize ? Math.max(1, page + change) : 1;
    params.set('page', page);
    params.set('pageSize', size);
    window.location.search = params.toString();
}

// Create each component: 
const Filter = createFilter(document.querySelector('#filter'), { handleFilter });
const Paging = createPaging(document.querySelector('#paging'), { handlePaging });
const DogList = createDogList(document.querySelector('#dog-list'));

// Roll-up display function that renders (calls with state) each component
function display() {
    Filter({ breed, age });
    Paging({ page, pageSize, totalPages });
    DogList({ dogs });
}

// Call display and page load!
handlePageLoad();

// no need to display until loaded!
// display();



