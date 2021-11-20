const getCatalogue = (request, response) => {
    const catalogueServices = require('../services/productServices');
    console.log("hello");
    catalogueServices.searchService(function(err, rows) {
        response.render('catalogue', { products: rows });
    });
};

const getProductByID = (request, response) => {
    const catalogueServices = require('../services/productServices');
    let reference = request.params.id;
    //console.log("-----Reference: " + request);
    catalogueServices.searchIDService(reference, function(err, rows) {
        //console.log(rows);
        response.render('article', { product: rows });
    });
};

const getProductsByCategory = (request, response) => {
    const catalogueServices = require('../services/productServices');
    let category = request.params.category;
    catalogueServices.searchCategoryService(category, function(err, rows) {
        response.json(rows);
        response.end();
    });
};

module.exports = {
    getCatalogue,
    getProductByID,
    getProductsByCategory
};