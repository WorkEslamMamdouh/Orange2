/*===============Login Pop up Windows ===============*/
const loginBtn = document.getElementById('login_');
const loginModel = document.getElementById('cta');
const closeBtn = document.getElementById('close-login');
const btnOk = document.getElementById('btnOk');
const btnBack = document.getElementById('btnBack');
if(loginBtn){
    loginBtn.addEventListener('click', () =>{
        loginModel.classList.remove('display_none');
        loginModel.classList.add('show');
    })
}

if(closeBtn){
    closeBtn.addEventListener('click', () =>{
        loginModel.classList.add("display_none");
        loginModel.classList.add("hide");
    })
}
if (btnOk) {
    btnOk.addEventListener('click', () => {
        loginModel.classList.add("display_none");
        loginModel.classList.add("hide");
    })
}
/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
//const sections = document.querySelectorAll('section[id]')

//function scrollActive() {
//    const scrollY = window.pageYOffset

//    sections.forEach(current =>{
//        const sectionHeight = current.offsetHeight,
//              sectionTop = current.offsetTop - 58,
//              sectionId = current.getAttribute('id')

//        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
//            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
//        }else{
//            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
//        }
//    })
//}
//window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 400 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 400) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home__data`)
sr.reveal(`.home__img`, {delay: 500})
sr.reveal(`.home__social`, {delay: 600})
sr.reveal(`.about-us-img-box, .contact__box`,{origin: 'left'})
sr.reveal(`.about-us-details-box, .contact__form`,{origin: 'right'})
sr.reveal(`.serviceBox, .services-content, .questions__group, .footer-content`,{interval: 100})

/*=============== Slider ===============*/
let slideIndex = 0;
let slidePlay = true;
const imgSlides = document.querySelectorAll(".home-slide");
const slider = document.querySelector(".home-slider");
const slideNext = document.querySelector(".slide-next");
const slidePrev = document.querySelector(".slide-prev");
imgSlides[0].classList.add("active");

hideAllSlide = () => {
  imgSlides.forEach((slide) => {
    slide.classList.remove("active");
  });
};

showSlide = () => {
  hideAllSlide();
  imgSlides[slideIndex].classList.add("active");
};

nextSlide = () =>
  (slideIndex = slideIndex + 1 === imgSlides.length ? 0 : slideIndex + 1);

prevSlide = () =>
  (slideIndex = slideIndex - 1 < 0 ? imgSlides.length - 1 : slideIndex - 1);

/* play/stop home-slider */
slider.addEventListener("mouseover", () => (slidePlay = false));
slider.addEventListener("mouseleave", () => (slidePlay = true));

/* Slider Control */
slideNext.addEventListener("click", () => {
  nextSlide();
  showSlide();
});
slidePrev.addEventListener("click", () => {
  prevSlide();
  showSlide();
});

setInterval(() => {
  if (!slidePlay) return;
  nextSlide();
  showSlide();
}, 3000);

for (let i = 0; i < imgSlides.length; i++) {
    const imgs = imgSlides[i].querySelector('.home-img');
    const num = i + 1;
    if (num % 4 === 0) {
        imgSlides[i].classList.add("home-slide-reverse");
        imgs.classList.add("down-top");
    } else if (num % 3 === 0) {
     imgs.classList.add("left-right");
    } else if (num % 2 === 0) {
        imgSlides[i].classList.add("home-slide-reverse");
        imgs.classList.add("right-left");
    } else {
         imgs.classList.add("top-down");
    }
}



