/* reusable way of any end point paginated */
/* end point 1: getAllLaunches end point */
//define default page limit and page number
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

//calculate limit values
function getPagination(query) {
    //Math.abs - returns absolute value of a number. String will be converted to a number as well
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER; //define default page number if page = 0
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; //define default page number if limit = 0
    //the amount of documents we want to skip if we are on a certain page
    const skip = (page - 1) * limit;

    return {
        skip,
        limit
    };
}

module.exports = {
    getPagination,
}