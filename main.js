class Clock {
    constructor (hour, minute, second) {
        this.showhideButton = true

        this.SCREEN_WIDTH = window.innerWidth
        this.SCREEN_HEIGHT = window.innerHeight

        this.scale = 11

        this.calcClockVariables()
        
        this.CLOCK_HANDPOS = (this.CLOCK_SIZE / 2)

        this.clockPositions = {
            posX:  this.SCREEN_WIDTH / 2,
            posY:  this.SCREEN_HEIGHT / 2,
        }
        
        this.myTime = {
            'hour': hour,
            'minute': minute,
            'second': second,
        };

        this.createElements()
        this.addEventListeners()

        this.timeLoop(this.myTime) // First load
        this.TICK = setInterval(() => this.timeLoop(this.myTime), 1000)
    }

    calcClockVariables() {
        this.CLOCK_SIZE = this.scale * 18
        this.CLOCK_HOUR_HAND = this.scale * 6
        this.CLOCK_MINUTE_HAND = this.scale * 8
        this.CLOCK_SECOND_HAND = this.scale * 8
        this.CLOCK_CIRCLE = this.scale * 0.5
    }

    createElements() {
        this.divElement = document.createElement('div')
        this.divElement.setAttribute('id', 'clockDiv')
        this.divElement.setAttribute('position', 'absolute')
        this.divElement.style.position = 'absolute';
        this.divElement.style.left = this.clockPositions.posX - this.CLOCK_SIZE / 2 + 'px';
        this.divElement.style.top = this.clockPositions.posY - this.CLOCK_SIZE / 2 + 'px';
        this.divElement.style.width = this.CLOCK_SIZE + 'px';
        this.divElement.style.height = this.CLOCK_SIZE + 'px';

        this.canvasElement = document.createElement('canvas')
        this.canvasElement.setAttribute('width', this.CLOCK_SIZE)
        this.canvasElement.setAttribute('height', this.CLOCK_SIZE)

        this.divElement.appendChild(this.canvasElement)

        document.body.setAttribute('position', 'relative')
        document.body.appendChild(this.divElement)
        this.context = this.canvasElement.getContext('2d')
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 's') {
                clearInterval(this.TICK)
                console.log('Az ismétlés leállt.')
            }
            if (event.key === 'r') {
                clearInterval(this.TICK)

                this.TICK = setInterval(() => this.timeLoop(this.myTime), 1000)
                console.log('Az ismétlés újraindul.')
            }
        });

        document.getElementById('button-showhide').addEventListener('click',() => {
            if (this.showhideButton) {
                this.showhideButton = false
                this.divElement.style.display = 'none'
            } else {
                this.showhideButton = true
                this.divElement.style.display = 'block'
            }
        })

        window.addEventListener('resize', (event) => {
            this.SCREEN_WIDTH = window.innerWidth
            this.SCREEN_HEIGHT = window.innerHeight

            const stayInsideTheClock = (posX, element) => {
                if (posX > (this.SCREEN_WIDTH - this.CLOCK_HANDPOS)) {
                    posX = this.SCREEN_WIDTH - this.CLOCK_HANDPOS;
                    element = posX - this.CLOCK_HANDPOS + 'px';
                }
            }

            stayInsideTheClock(this.clockPositions.posX, this.divElement.style.left)
            stayInsideTheClock(this.clockPositions.posY, this.divElement.style.top)
        });

        let clockDiv = document.getElementById('clockDiv');

        clockDiv.addEventListener('mousedown', () => {
            clockDiv.style.cursor = 'grabbing';
        
            const trackMouse = (event) => {                
                if ((event.clientX <= (this.SCREEN_WIDTH - this.CLOCK_HANDPOS)) && (event.clientX >= (this.CLOCK_HANDPOS))) {
                    this.clockPositions.posX = event.clientX;
                    this.divElement.style.left = this.clockPositions.posX - this.CLOCK_HANDPOS + 'px';
                }
                
                if ((event.clientY <= (this.SCREEN_HEIGHT - this.CLOCK_HANDPOS)) && (event.clientY >= (this.CLOCK_HANDPOS))) {
                    this.clockPositions.posY = event.clientY;
                    this.divElement.style.top = this.clockPositions.posY - this.CLOCK_HANDPOS + 'px';
                }
            };
        
            document.addEventListener('mousemove', trackMouse);
        
            document.addEventListener('mouseup', () => {
                clockDiv.style.cursor = 'default';
                document.removeEventListener('mousemove', trackMouse);
            });
        });
    }

    timeLoop(myTime) {
        this.now = new Date()
        this.myTime.hour = this.now.getHours() - 1
        this.myTime.minute = this.now.getMinutes()
        this.myTime.second = this.now.getSeconds()

        // console.log('Hour: ' + myTime.hour + ' Minute: ' + myTime.minute + ' Second: ' + myTime.second)
        
        // CLOCK GRAPH
        this.drawClockBody()
        // CLOCK HEADS
        this.calcHour(myTime.hour, myTime.minute, this.CLOCK_HOUR_HAND, 7, 'red')
        this.calcMinuteOrSecond(myTime.minute,  this.CLOCK_MINUTE_HAND, 4, 'blue')
        this.calcMinuteOrSecond(myTime.second,  this.CLOCK_SECOND_HAND, 2, 'orange')


        this.context.beginPath();
        this.context.arc(this.CLOCK_HANDPOS, this.CLOCK_HANDPOS, this.CLOCK_CIRCLE, 0, 2 * Math.PI, false);
        this.context.fillStyle = '#ccc'
        this.context.fill()
        this.context.lineWidth = 3
        this.context.strokeStyle = '#ddd'
        this.context.stroke()
    }

    drawClockBody() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        this.context.fillRect(0,0, this.canvasElement.posX, this.canvasElement.posX)
        
        this.context.beginPath();
        this.context.arc(this.CLOCK_HANDPOS, this.CLOCK_HANDPOS, (this.CLOCK_SIZE/2), 0, 2 * Math.PI, false);
        this.context.fillStyle = 'white';
        this.context.lineCap = 'round';
        this.context.fill();
    }

    calcHour (hour, minute, length, thick, color) {
        
        let angle

        if (hour || hour + 12) {angle = hour * 30}
        
        // Add hour minutes deg
        angle = angle + (minute * 0.5);
        
        angle = angle - 90

        this.drawClockHands(angle, length, thick, color)
    }

    calcMinuteOrSecond(value, length, thick, color) {

        let angle = (value * 6) - 90

        this.drawClockHands(angle, length, thick, color)
    }

    angleToRadian(angle) {
        return angle * (Math.PI / 180)
    }

    drawClockHands(angle, length, thick, color) {
        this.context.lineWidth = thick;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(this.CLOCK_HANDPOS, this.CLOCK_HANDPOS);
        this.context.lineTo(
            ((this.CLOCK_HANDPOS) + (Math.cos(this.angleToRadian(angle)) * length)),
            ((this.CLOCK_HANDPOS) + (Math.sin(this.angleToRadian(angle)) * length)),
        );
        
        this.context.stroke();
    }
}

var now = new Date();

let hour = now.getHours()
let minute = now.getMinutes()
let second = now.getSeconds()

const clock = new Clock(hour, minute, second)
