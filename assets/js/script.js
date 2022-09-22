/**
 * 1. Render songs ✔️
 * 2. Scroll top ✔️
 * 3. Play / pause / seek ✔️
 * 4. CD rotate ✔️
 * 5. Next / prev ✔️
 * 6. Random ✔️
 * 7. Next / Repeat when ended ✔️
 * 8. Active song ✔️
 * 9. Scroll active song into view ✔️
 * 10. Play song when click ✔️
 * 11. Repeat all and One song
 * 12. Timer of the song
 */
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
// const repeat1Btn = $('.btn-repeat-1');

const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isRepeat1: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
            name: 'If I Let You Go',
            singer: 'Westlife',
            path: './assets/music/Song 1 - Westlife - If I Let You Go.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Fool Again',
            singer: 'Westlife',
            path: './assets/music/Song 2 - Westlife - Fool Again.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'I Lay My Love on You',
            singer: 'Westlife',
            path: './assets/music/Song 3 - Westlife - I Lay My Love on You.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'You Raise Me Up',
            singer: 'Westlife',
            path: './assets/music/Song 4 - Westlife - You Raise Me Up.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Seasons In The Sun',
            singer: 'Westlife',
            path: './assets/music/Song 5 - Westlife - Seasons In The Sun.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Swear It Again',
            singer: 'Westlife',
            path: './assets/music/Song 6 - Westlife - Swear It Again.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Queen Of My Heart',
            singer: 'Westlife',
            path: './assets/music/Song 7 - Westlife - Queen Of My Heart.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'I Have a Dream',
            singer: 'Westlife',
            path: './assets/music/Song 8 - Westlife - I Have a Dream.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Hello My Love',
            singer: 'Westlife',
            path: './assets/music/Song 9 - Westlife - Hello My Love.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Unbreakable',
            singer: 'Westlife',
            path: './assets/music/Song 10 - Westlife - Unbreakable.mp3',
            image: './assets/img/song10.jpg'
        }
    ],
    setConfig: function(key , value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Handle CD rotate / stop
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Handle zoom in and zoom out the CD
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Handle when clicking play button method 1
        // playBtn.onclick = () => {
        //     if(player.classList.contains('playing')) {
        //         audio.pause();
        //         player.classList.remove('playing');
        //     } else {
        //         audio.play();
        //         player.classList.add('playing');
        //     }
        // }
        // method 2
        playBtn.onclick = () => {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Onplay the music
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Onpause the music
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // When progress of song changes
        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;

                // At the end of current song automatically changes to random / current / next song
                // if(progressPercent == 100) {
                //     if(_this.isRandom) {
                //         _this.playRandomSong();
                //     } else if (_this.isRepeat) {
                //         _this.loadCurrentSong();
                //     }
                //     else {
                //         _this.nextSong();
                //     }
                //     audio.play();
                // }
            }
        }
        
        // Handle seeking function
        progress.onchange = e => {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // When clicking previous button
        prevBtn.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // When clicking next button
        nextBtn.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // On / Off random button
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            // if(randomBtn.classList.contains('active')) {
            //     randomBtn.classList.remove('active');
            // } else {
            //     randomBtn.classList.add('active');
            //     _this.randomSong();
            // }
        }

        // On / Off repeat button
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // On / Off repeat 1 button
        // repeat1Btn.onclick = () => {
        //     _this.isRepeat1 = !_this.isRepeat1;
        //     repeat1Btn.classList.toggle('active', _this.isRepeat1);
        // }

        // Select the option when end the song
        audio.onended = () => {
            if(_this.isRepeat) {
                audio.play();
            } else if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                nextBtn.click();
            }
            // nextBtn.click();
        }

        // Listen the event when clicking into playlist
        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            const optionBtn = e.target.closest('.option');
            if(songNode || optionBtn) {
                // Click to not active song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Click to option button
                if(optionBtn) {

                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: (this.currentIndex <= 1) ? 'center' : 'nearest',
            })
        }, 500)
    },
    loadCurrentSong: function() {        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * (this.songs.length - 1));
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // repeatCurrentSong: function() {
    //     this.loadCurrentSong();
    // },
    start: function () {
        // Attach configation from config in application
        this.loadConfig();
        // Define all properties for object
        this.defineProperties();
        // Listen / handle all events (DOM events)
        this.handleEvents();
        // Load the information of the first song to UI (User Interface), when running application
        this.loadCurrentSong();
        // Render playlist
        this.render();
        // Display initial state of button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
};

app.start();