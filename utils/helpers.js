import moment from "moment";

export const objectifyForm = ( formArray ) =>  {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

export const resetSlideToSubmit = () => {
    $('.slide-submit-dragging').animate({
        'left': '0'
    }, 150);

    $('.slide-submit').removeClass('slide-success');
    $('.slide-submit-text').text("Slide To Get OTP");
}

export const intersect = (a, b) => {
    return a.filter(Set.prototype.has, new Set(b));
}


export const dateFormate = (date) => {
    if (date) return moment(date).format("MMMM DD YYYY, hh.mm A");
}

export const avgRating = (reviews) => {
    if (reviews?.length) {
        let total = 0;
        reviews.forEach(review => {
            total = total + (review.rating || 0);
        });

        return total / reviews?.length
    } else return 0;
}

export const months = [
    {value: 1, name: "January"},
    {value: 2, name: "February"},
    {value: 3, name: "March"},
    {value: 4, name: "April"},
    {value: 5, name: "May"},
    {value: 6, name: "June"},
    {value: 7, name: "July"},
    {value: 8, name: "August"},
    {value: 9, name: "September"},
    {value: 10, name: "October"},
    {value: 11, name: "November"},
    {value: 12, name: "December"},
];

export const yearsList = () => {
    var date = new Date,
    years = [],
    year = date.getFullYear();

    for (var i = year; i > 1900; i--) {
        years.push(i);   
    }

    return years;
}

export const cities = [
    "Dhaka", "Chattogram", "Khulna", "Sylhet", "Rājshāhi", "Mymensingh", "Barishal", 
    "Comilla", "Rangpur", "Brāhmanbāria", "Jessore", "Saidpur", "Nārāyanganj", "Gaibandha", "Naogaon"
]

export const divisions = [
    "Dhaka", "Chattogram", "Khulna", "Sylhet", "Rājshāhi", "Mymensingh", "Barishal", 
    "Rangpur"
]