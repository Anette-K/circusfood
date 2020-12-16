import { shows, categories } from './components/shows.js';
import { calendar } from './components/calendar.js';



function addShows() {
    shows.forEach(show => {
        const list = $('#showList');
        const template = document.getElementById('template-show-item');
        const instance = document.importNode(template.content, true);
        const category = categories.find(cat => cat.id == show.category);
        console.log('category ', category.name);
        $(instance).find('#title').text(show.title);
        $(instance).find('#category').text(category.name);
        //$(instance).find('#price').text(show.price + 'Kr');
        $(instance).find('#description').text(show.description);
        $(instance).find('#date').text(show.date + ' ' + show.time);
        //$(instance).find('content').text(show.content);
        $(instance).find('#thumb').attr('src', 'img/' + show.thumb);
        $(instance).find('#modal-button').attr('data-bs-id', show.id);
        /* $(instance).find('#modal-button').click(() => {
            console.log('clicker');
            openModal();
        }); */
        list.append(instance);
    });
}
$(".quantity-button").click(() => {
    //console.log('button clicked ', event.target);
    let category = $(event.target).parent().attr('id').split("-")[1];
    console.log('category ', category);
    $("#add-seatings-" + category).val(event.target.innerText);
    $("#seatings-"+category+"-data").text(event.target.innerText);
    let total = $("#price-"+category).text() * event.target.innerText;
    $("#total-"+category).text(total);  
});

$(".quantity").change(() => {
    let category = $(event.target).parent().parent().attr('id').split("-")[1];
    console.log('category ', category);
    $("#seatings-"+category+"-data").text(event.target.value);
    let total = $("#price-"+category).text() * event.target.value;
    $("#total-"+category).text(total);  
    //booking.seatings = $("#seating-quantity").text(event.target.value);
    
});

$("#go-to-payment").click(() => {
    let orderId = '#' + Math.random().toString(36).substring(5).toUpperCase(); 
    localStorage.setItem('order', JSON.stringify(booking));
    window.location.assign("/payment.html");
});


let showModal = document.getElementById('showModal');
showModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    
    let button = event.relatedTarget
    // Extract info from data-bs-* attributes
    let showId = button.getAttribute('data-bs-id');
    let show = shows.find(show => show.id == showId);
    console.log('show ', show);
    console.log('showId', showId);
    // If necessary, you could initiate an AJAX request here
    // and then do the updating in a callback.
    //
    // Update the modal's content.
    let modalTitle = showModal.querySelector('.modal-title')
    let alert = showModal.querySelector('.alert')
    alert.innerHTML = `<h5>${show.title}</h5><p>${show.description}</p>`;
    //$('.show-card').removeClass("bg-success");
    
    //$('.booking-button').removeAttr('data-id');
    //$('.booking-button').attr('data-id', showId);
    //$('.booking-button').click(() => console.log(showId));
    
    $(".booking-button").click((e) => {
        const button = $(e.target);
        let category = button.data('category');
        $("#seatings-"+category).removeClass("d-none");
        $("#"+category).addClass('d-none');
        let seatings = $("#seating-quantity").text();
        booking.category = category;
        booking.price = show[category];
        /* 
        booking.image = show.thumb;
        console.log('show ', show)
        booking.showId = show.id;
        booking.time = show.time;
        booking.date = show.date;
        booking.name = show.title; */
        
        let table = $('<table class="table">');
        let thead = $(`
        
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Date</th>
                <th>Time</th>
                <th>Seatings</th>
                <th>Price</th>
                <th>Total</th>
            </tr>    
        `);
        let tr = $(`
        
            <tr>
                <td>${show.title}</td>
                <td>${category}</td>
                <td>${show.date}</td>
                <td>${show.time}</td>
                <td id="seatings-${category}-data">${seatings}</td>
                <td id="price-${category}">${booking.price}</td>
                <td id="total-${category}">${seatings*booking.price}</td>
            </tr>
        
        `);
        thead.appendTo(table);
        tr.appendTo(table);
        $("#seatings-"+category).append(table);
        let bookingButton = $('<button class="btn">Add to cart</button>').click((e) => {
            let tr = $(e.target).siblings('table').children().last();
            let tableData = tr.children();
            let orderId = '#' + Math.random().toString(36).substring(5).toUpperCase();
            booking.orderId = orderId;
            const menuButton = $(`
                <a href="menu.html" class="btn" data-order-id="${orderId}">
                    Add a menu for this booking
                </a>
            `);
            $("#seatings-" + category).append(menuButton);

            
            booking.seatings = tableData.eq(4).text();
            
            booking.category = tableData.eq(1).text();
            booking.image = show.thumb;
            booking.price = tableData.eq(5).text();
            booking.showId = show.id;
            booking.time = show.time;
            booking.date = show.date;
            booking.name = show.title;
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.forEach(b => {
                if (booking.showId == b.showId && booking.category == b.category) {
                    console.log('already booked');
                }
            })
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            //console.log('rows ', $(e.target).siblings('table').rows);
            //console.log($(category).prev());
        })
        $("#seatings-"+category).append(bookingButton);
            
        //$("#order-status").append(table);
        
        
        
    });
    
    modalTitle.textContent = 'Seating booking for ' + show.date + ' ' + show.time
});
showModal.addEventListener('hide.bs.modal', function(event) {
    console.log('closing modal');
    
    document.querySelectorAll(".booking-button").forEach(btn => removeEventListener('click', function(){}));

});
//const categories = [...new Set(shows.map(show => show.category))];
console.log('categories ', categories);
function categoriesAsTabs(categories) {
    let ul = $('<ul class="nav nav-pills flex-column">');
    let li = $('<li class="nav-item">');
    li.append(`
            <a href="#" id="main" class="nav-link bg-info mb-3 p-3 shadow active tab-item" aria-current="page" 
            onclick="openTab(event, 'all')">All shows</a>
    `);

    ul.append(li);
    categories.forEach(c => {
        let li = $('<li class="nav-item">');
        let link = $(`
                <a href="#" class="d-flex justify-content-between nav-link mb-3 p-3 shadow tab-item" id="${c.name}" 
                onclick="openTab(event, '${c.name}')">
        `);

        const icon = $(c.icon).addClass("rounded-pill");
        icon.attr("width", "60");
        console.log('name ', c.name);
        const span = $('<p>'+c.name+'</p>');
        
        icon.appendTo(link);
        span.appendTo(link);
        console.log('category ', c);
        console.log('link text: ', link.text());
        link.appendTo(li);
        li.appendTo(ul)
    });
    $("#categories").append(ul);

}

function openTab(event, tabName) {
    console.log('tab name ', tabName);
    $('.tab-item').removeClass('active')
    if (tabName == 'all') {
        $(".show-item").attr("style", "");

    } else {     
        $(".show-item").map((index, card) => card.innerText.includes(tabName) ? card.style.display = "block" : card.style.display = "none");
        
    }
    event.currentTarget.className += " active";
}
// using modules
window.openTab = openTab;

var booking = {orderId:'', showId: '', name: '', date: '', time: '', image: '', category: '', seatings: '', price:''};

$(document).ready(function() {
    console.log('document loaded');
    addShows();
    categoriesAsTabs(categories)
    $("#calendar").html(calendar());
    //$("#main").click();
}); 
    