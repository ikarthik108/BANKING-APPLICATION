'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo=document.querySelector('.btn--scroll-to')
const section1=document.getElementById('section--1')



const openModal = function (event) {
  event.preventDefault()
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn=>{
  btn.addEventListener('click',openModal)
})
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Page Navigation by attaching eventlistener to each link element(performance Issue)


// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault()
//     if (e.target.href?.includes('section')) {
//       const secId=this.getAttribute('href');
//       const secCoords=document.querySelector(secId).getBoundingClientRect()
//       window.scrollTo({
//         left:secCoords.left+window.pageXOffset,
//         top:secCoords.top + window.pageYOffset,
//         behavior:'smooth'
//       })
//     }
//   })
// })

document.querySelector('.nav__links').addEventListener('click',function(e) {
  e.preventDefault()
  console.log(e.target)
  if(e.target.classList.contains('nav__link')) {
    const secId=e.target.getAttribute('href');
    console.log(secId)
    const secCoords=document.querySelector(secId).getBoundingClientRect();
    window.scrollTo({
      left:secCoords.left+ window.pageXOffset,
      top:secCoords.top+ window.pageYOffset,
      behavior:'smooth'
    })

  }
})




btnScrollTo.addEventListener('click',function(event) {
  //get co-or of the element we want to scroll to
  const s1coords=section1.getBoundingClientRect()
  console.log('Scroll button Coords',event.target.getBoundingClientRect())
  console.log('Section 1 Coords',s1coords)
  console.log('Current Scroll X/Y',window.pageXOffset,window.pageYOffset)

  window.scrollTo({
    left:s1coords.left + window.pageXOffset,
    top:s1coords.top + window.pageYOffset,
    behavior:'smooth'
  })

  //modern way---
  /// section1.scrollUntoView({behavior:"smooth"})

})

//----------bubbling Tabbed Components--------

const tabs=document.querySelectorAll('.operations__tab')
const tabsContainer=document.querySelector('.operations__tab-container')
const tabsContent=document.querySelectorAll('.operations__content')


// tabs.forEach(t=>{
//   t.addEventListener('click',function(){
//     console.log('Tab Clicked')
//   })
// })

//Adding an event listener to common parent of all tabs for performance optimization(event bubbling concept)

tabsContainer.addEventListener('click',function(e){
  //check where click was created
  const clicked=e.target
  // console.log(clicked)

  //now as the button element consists of child element also,in case if we click on number it would return us a span element
  //to avoid that we need to always find the closest parent button element
  const tabClicked=clicked.closest('.operations__tab')

  //once clicked .check if tabCLicked returns the element
  if(!tabClicked) return //guard Clause

  //(remove activate class from all buttons before)
  tabs.forEach(tab=> {
    tab.classList.remove('operations__tab--active')
  })
  //button is clicked,it should get the activate class(it should move up and rest others should move down) 
  tabClicked.classList.add('operations__tab--active')

  //display content for the tab
  const contentId=tabClicked.dataset.tab //getting the content id from the attribute 'data-tab'

  //remove active class from all tabs
  tabsContent.forEach(tc=>{
    tc.classList.remove('operations__content--active')
  })

  //add active class to display content
  document.querySelector(`.operations__content--${contentId}`).classList.add('operations__content--active')

})

//********Menu Fade animation****************//

const nav=document.querySelector('.nav')

const handleHover=function(e,opacity) {
  if(e.target.classList.contains('nav__link')) {
    const link=e.target;
    const siblings=link.closest('.nav').querySelectorAll('.nav__link')
    siblings.forEach(sib=> {
      if(sib!==link) {
        sib.style.opacity=opacity;
      }
      
    })
    const logo=link.closest('.nav').querySelector('.nav__logo')
    logo.style.opacity=opacity
  }
}

nav.addEventListener('mouseover',function(e) {
  handleHover(e,0.5)
})

nav.addEventListener('mouseout',function(e){
  handleHover(e,1)
})

//*****sticky navigation with the help of Intersection Observer API*****//
const header=document.querySelector('.header');
const navHeight=nav.getBoundingClientRect().height; //getting the height of nav bar
const stickyNav=function(entries,observer) {  
  const [entry]=entries;
  if(entry.isIntersecting===false) {
    nav.classList.add('sticky') 
  } else {
    nav.classList.remove('sticky')
  }
}
const HeaderObserver=new IntersectionObserver(stickyNav,{
  root:null,
  threshold:0,
  rootMargin:`-${navHeight}px` //entry triggers as soon as this value is reached;
})
HeaderObserver.observe(header)

//*****Revealing Elements on scroll ******/



const SectionReveal=function(entries,observer) {
  const [entry]=entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target);

}
const SectionObserver= new IntersectionObserver(SectionReveal,{
  root:null,
  threshold:0.15,
})

const AllSections=document.querySelectorAll('.section') //selecting all the sections

AllSections.forEach(function(section) {
  // console.log(section)
  
  SectionObserver.observe(section);
  // section.classList.add('section--hidden')
  //section--hidden
})

//*****Lazy Loading Images*******//
const ImgTargets=document.querySelectorAll('img[data-src]');
console.log(ImgTargets)

const LoadImage=function(entries,observer) {
  const [entry]=entries;
  console.log(entry);
  if(!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src= entry.target.dataset.src;

  //get high quality image by removing class

  //we de this because changing the img happens behind the scenes/and load load event is fired once the img actually changes
  //so it is better to show the blureed image//ull see the difference once u switch to a slow internet connection
  entry.target.addEventListener('load',function() {
    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
  
}
const ImageObserver=new IntersectionObserver(LoadImage,{
  root:null,
  threshold:0,
  rootMargin:'200px'
})

ImgTargets.forEach(image=> {
  ImageObserver.observe(image)
})

//****Bulding a slider component****//

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      curSlide = parseInt(slide, 10)
      activateDot(slide);
    }
  });
};
slider();


//[-100,0,100,200]





//******Sticky Navigation *******//
// const initial_section1_coords=document.querySelector('#section--1').getBoundingClientRect()
// window.addEventListener('scroll',function() {
//   if(window.scrollY > initial_section1_coords.top) {
//     nav.classList.add('sticky') 
//   } else {
//     nav.classList.remove('sticky')
//   }

// })




//////////////
//practice

// const header=document.querySelector('.header')
// console.log(header)


// //Add a cookie selector in the header

// //creating element
// const message=document.createElement('div')  //a dom obj is created here but still not on the dom tree
// message.classList.add('cookie-message')
// // message.textContent='We use cookies to improve your experience and the improve the website performance';

// //if u want to append multiple child elements(to add html content inside of an element)(use innerhtml)
// message.innerHTML=
// "We use cookies to improve your experience and the improve the website performance <button class='btn btn--close-cookie'>Got It!</button>"


// //inserting into dom (in header)
// header.prepend(message)
// // header.append(message) will only create one unique dom element in this case
// //(if u want multiple copies use CloneNode)
// // header.append(message.cloneNode(true))

// // header.before(message)

// const closeCookieBtn=document.querySelector('.btn--close-cookie')
// closeCookieBtn.addEventListener('click',function() {
//   message.remove()
//   //message.parentElement.removeChild(message)  older way
// })

// const link=document.querySelector('.nav__link--btn')
// console.log(link)

// document.documentElement.style.setProperty('--color-primary','orangered')

// message.style.backgroundColor='grey'

//smooth scrolling functionality



  //modern way---
  /// section1.scrollUntoView({behavior:"smooth"})

//event capturing and bubbling
// document.querySelector('.nav__link').addEventListener('click',function(e) {
//   this.style.backgroundColor="rgb(255,13,24)"
//   console.log('LINK',e.target)
// })


// document.querySelector('.nav__links').addEventListener('click',function(e) {
//   this.style.backgroundColor="rgb(150,150,250)"
//   console.log('CONTAINER',e.target)
// })

// document.querySelector('.nav').addEventListener('click',function(e) {
//   this.style.backgroundColor="rgb(23,240,100)"
//   console.log('NAV',e.target)
// },true)

