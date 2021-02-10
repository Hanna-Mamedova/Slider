
class Carousel {
   constructor(s) {

    let settings = this._initConfig(s);
       
    this.container = document.querySelector(settings.containerID)
    this.slides = this.container.querySelectorAll(settings.slideID);
    this.interval = settings.interval;
   }

   _initConfig(o) {
       return {...{containerID: '#carousel', interval: 5000, slideID: '.slide'}, ...o};
   }

   _initProps() {
            this.currentSlide = 0;
            this.slidesCount = this.slides.length;
            this.isPlaying = true;
            
            this.ACTIVE = 'active';
            this.FA_PAUSE  = '<i class="fas fa-pause"></i>';
            this.FA_PLAY  = '<i class="fas fa-play"></i>';
            this.FA_PREV = '<i class="fas fa-arrow-left"></i>';
            this.FA_NEXT = '<i class="fas fa-arrow-right"></i>';
    
            this.SPACE = ' ';
            this.LEFT_ARROW = 'ArrowLeft';
            this.RIGHT_ARROW = 'ArrowRight';
            
        };

    _initControls() {
        const controls = document.createElement('div');

        const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
        const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
        const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;


        controls.setAttribute('class', 'controls');
        controls.setAttribute('id', 'controls-container');

        controls.innerHTML = PAUSE + PREV + NEXT;
        
        this.container.appendChild(controls);
        
        this.pauseBtn = this.container.querySelector('#pause-btn');
        this.prevBtn = this.container.querySelector('#prev-btn');
        this.nextBtn = this.container.querySelector('#next-btn');

        let controlbtns = document.querySelectorAll('.controls');

        for (let i = 0; i < controlbtns.length; i++) {
            controlbtns[i].style.display = 'flex';
        };

    };

    _initIdicators() {
        const indicators = document.createElement('ol');
        
        indicators.setAttribute('class', 'indicators');
        indicators.setAttribute('id', 'indicators-container');

        for (let i = 0; i < this.slidesCount; i++) {
            const indicator = document.createElement('li');

            indicator.setAttribute('class', 'indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.dataset.slideTo = `${i}`;
            indicators.appendChild(indicator);
        }

        this.container.appendChild(indicators);

    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.indicatorsContainer.querySelectorAll('.indicator');
    };

    _initListeners() {

        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this._indicate.bind(this));
        document.addEventListener('keydown', this._pressKey.bind(this));
    
        };

    _indicate (e) {
        let target = e.target;
          
        if (target.classList.contains('indicator')) {
            this.pause();
            this.gotoNth(+target.dataset.slideTo);
        }
          
    };

    _pressKey(e) {
        if (e.key === this.LEFT_ARROW) this.prev();
        if (e.key === this.RIGHT_ARROW) this.next();
        if (e.key === this.SPACE) this.pausePlay();
      };
      


    gotoNth(n) {

        this.slides[this.currentSlide].classList.toggle(this.ACTIVE);
        this.indicators[this.currentSlide].classList.toggle(this.ACTIVE);
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.slides[this.currentSlide].classList.toggle(this.ACTIVE);
        this.indicators[this.currentSlide].classList.toggle(this.ACTIVE);
      };
      
    gotoNext() {
        this.gotoNth(this.currentSlide + 1);
    };
    
    gotoPrev() {

        this.gotoNth(this.currentSlide - 1);
    };

    pause() {
        this.pauseBtn.innerHTML = this.FA_PLAY;
      clearInterval(this.timerID);
      this.isPlaying = false;
    };
    
    play() {
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.timerID = setInterval(() => this.gotoNext(), this.interval);
        this.isPlaying = true;
    };
    
    
    pausePlay() {
        this.isPlaying ? this.pause() : this.play()
    };

    next() {
      this.pause();
      this.gotoNext();
    };
    
    prev() {
      this.pause();
      this.gotoPrev();
    };

    init() {

    this._initProps();
    this._initIdicators();
    this._initControls();
    this._initListeners();

    this.timerID = setInterval(() => this.gotoNext(), this.interval);
    };

}


class SwipeCarousel extends Carousel {


_initListeners () {
    super._initListeners();

    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));    
};

_swipeStart (e) {
    if (e.changedTouches.length === 1) this.swipeStartX = e.changedTouches[0].pageX;
};
  
_swipeEnd (e) {
    if (e.changedTouches.length === 1) {
      this.swipeEndX = e.changedTouches[0].pageX;
    if ((this.swipeStartX - this.swipeEndX) < 0) this.next();
    if ((this.swipeStartX - this.swipeEndX) > 0) this.prev();
    }
};

}
