class Golf2DGame {
  constructor() {
    // DOM elements
    this.ball = document.getElementById("ball")
    this.holeContainer = document.getElementById("holeContainer")
    this.hole = document.getElementById("hole")
    this.golfFlag = document.getElementById("golfFlag")
    this.arrow = document.getElementById("arrow")
    this.golfClub = document.getElementById("golfClub")
    this.powerMeter = document.getElementById("powerMeter")
    this.powerBar = document.getElementById("powerBar")
    this.powerPercentage = document.getElementById("powerPercentage")
    this.shotCount = document.getElementById("shotCount")
    this.accuracy = document.getElementById("accuracy")
    this.distance = document.getElementById("distance")
    this.commentDisplay = document.getElementById("commentDisplay")
    this.audioStatus = document.getElementById("audioStatus")
    this.musicToggle = document.getElementById("musicToggle")
    this.course = document.getElementById("golfCourse")

    // Create comedy dialog display
    this.createComedyDialogDisplay()

    // Game state
    this.ballPos = { x: 80, y: window.innerHeight * 0.5 }
    this.holePos = { x: window.innerWidth - 80, y: window.innerHeight * 0.5 }
    this.isAiming = false
    this.isMoving = false
    this.power = 0
    this.powerDirection = 1
    this.shots = 0
    this.successfulShots = 0
    this.mousePos = { x: 0, y: 0 }
    this.audioEnabled = false
    this.musicEnabled = false

    // Initialize Web Audio API
    this.initAudio()

    this.comedyDialogs = [
      {
        title: "Weather Report:",
        emoji: "🌪️",
        text: '"Strong winds detected... oh wait, that\'s just your swing!"',
        subtext: "Meteorologists are confused!",
      },
      {
        title: "Hole Interview:",
        emoji: "🕳️",
        text: "\"I'm not running away, you're just really bad at this!\"",
        subtext: "- The hole, speaking candidly",
      },
    ]

    // Malayalam Cinema Style Hit Comments - REDUCED TO 5
    this.malayalamCinemaHitComments = [
      { text: "മാസ്സ് shot! 🔥 Hero entry പോലെ!", sound: "success", icon: "🎬" },
      { text: "പൊളിച്ചു! 💥 Action sequence!", sound: "hit", icon: "🎭" },
    ]

    // Malayalam Cinema Style Miss Comments - REDUCED TO 5
    this.malayalamCinemaMissComments = [
      { text: "Suspense! 😅 Twist വരുന്നു!", sound: "close", icon: "🎭" },
      { text: "Comedy scene! 🏃‍♂️ Villain escape!", sound: "sneaky", icon: "😂" },
    ]

    // Malayalam Cinema Style Encouragement Comments - REDUCED TO 5
    this.malayalamCinemaEncouragementComments = [
      { text: "Believe in yourself! 💪 Inner strength!", sound: "trust", icon: "🤝" },
    ]

    // Malayalam Comedy Dialogs - Cinema Style - REDUCED TO 5
    this.malayalamComedyDialogs = [
      {
        title: "കോമഡി Hero പറയുന്നു:",
        emoji: "😂",
        text: '"എന്റെ പൊന്നോ! ഇത് golf ആണോ അതോ circus ആണോ?"',
        subtext: "😂 😂 😂 😂 😂 😂",
      },
      {
        title: " Driver ",
        emoji: "🚗",
        text: '"സാർ, ഈ hole എവിടെ ആണ്? GPS ൽ കാണുന്നില്ലല്ലോ!"',
        subtext:  "😅 😅 😅 😅 😅",
      },
      {
        title: "Tea Shop Uncle:",
        emoji: "☕",
        text: '"മോനേ, ഒരു tea കുടിച്ച് വാ! Golf കളിക്കാൻ energy വേണം!"',
        subtext: "Parotta യും ഉണ്ട്, special rate!🤣🤣🤣🤣🤣",
      },
      {
        title: "Director Cut:",
        emoji: "🎬",
        text: '"Cut! Cut! ഇത് golf scene അല്ല, comedy scene ആണ്!"',
        subtext: "Take 47... Action!",
      },
    ]

    // Malayalam Hit Comments
    this.malayalamHitComments = [
      { text: "Perfect swing! 🏌️‍♂️ സൂപ്പർ!", sound: "success", icon: "🎯" },
      { text: "Clean strike! ⛳ ", sound: "hit", icon: "💥" },
    ]

    // Malayalam Miss Comments
    this.malayalamMissComments = [
      { text: "Hole escape ആയി! 🕳️ ഓടിപ്പോയി!", sound: "sneaky", icon: "🏃‍♂️" },
      { text: "Sneaky flag! 🚩 കൗശലക്കാരൻ!", sound: "escape", icon: "👻" },
      { text: "Flag ഓടിപ്പോയി! 😂 Run away!", sound: "laugh", icon: "🤣" },
    ]

    // Malayalam Encouragement Comments
    this.malayalamEncouragementComments = [
      { text: "നിങ്ങളുടെ swing നെ വിശ്വസിക്കൂ! നിങ്ങൾക്ക് പറ്റും! 💪 You can do it!", sound: "motivate", icon: "🔥" },
      { text: "Focus ചെയ്യൂ! 💯 Stay focused!", sound: "focus", icon: "🎯" },
    ]

    this.init()
  }

  createComedyDialogDisplay() {
    const comedyDisplay = document.createElement("div")
    comedyDisplay.className = "comedy-dialog-display"
    comedyDisplay.id = "comedyDialogDisplay"

    const container = document.createElement("div")
    container.className = "dialog-container"

    const title = document.createElement("div")
    title.className = "dialog-title"

    const emoji = document.createElement("div")
    emoji.className = "dialog-emoji"

    const text = document.createElement("div")
    text.className = "dialog-text"

    const subtext = document.createElement("div")
    subtext.className = "dialog-subtext"

    container.appendChild(title)
    container.appendChild(emoji)
    container.appendChild(text)
    container.appendChild(subtext)
    comedyDisplay.appendChild(container)
    this.course.appendChild(comedyDisplay)

    this.comedyDialogDisplay = comedyDisplay
    this.comedyDialogTitle = title
    this.comedyDialogEmoji = emoji
    this.comedyDialogText = text
    this.comedyDialogSubtext = subtext
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()

      this.audioStatus.addEventListener("click", () => {
        if (this.audioContext.state === "suspended") {
          this.audioContext.resume().then(() => {
            this.audioEnabled = true
            this.audioStatus.innerHTML = '<span class="btn-icon">🔊</span><span class="btn-text">SOUND ON</span>'
            this.audioStatus.classList.add("active")
            this.playCommentSound("success")
          })
        } else {
          this.audioEnabled = true
          this.audioStatus.innerHTML = '<span class="btn-icon">🔊</span><span class="btn-text">SOUND ON</span>'
          this.audioStatus.classList.add("active")
          this.playCommentSound("success")
        }
      })

      this.musicToggle.addEventListener("click", () => {
        if (!this.audioEnabled) {
          this.audioContext.resume().then(() => {
            this.audioEnabled = true
            this.toggleMusic()
          })
        } else {
          this.toggleMusic()
        }
      })

      document.addEventListener(
        "click",
        () => {
          if (this.audioContext.state === "suspended") {
            this.audioContext.resume().then(() => {
              this.audioEnabled = true
            })
          } else {
            this.audioEnabled = true
          }
        },
        { once: true },
      )
    } catch (e) {
      console.log("Web Audio API not supported")
      this.audioContext = null
    }
  }

  toggleMusic() {
    if (this.musicEnabled) {
      this.musicEnabled = false
      this.musicToggle.innerHTML = '<span class="btn-icon">🎵</span><span class="btn-text">MUSIC OFF</span>'
      this.musicToggle.classList.remove("active")
      this.playCommentSound("off")
    } else {
      this.musicEnabled = true
      this.musicToggle.innerHTML = '<span class="btn-icon">🎵</span><span class="btn-text">MUSIC ON</span>'
      this.musicToggle.classList.add("active")
      this.playCommentSound("on")
    }
  }

  playCommentSound(type) {
    if (!this.audioEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    switch (type) {
      case "success":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime)
        oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.4)
        break

      case "close":
      case "almost":
        oscillator.type = "triangle"
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.3)
        break

      case "laugh":
      case "sneaky":
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const osc = this.audioContext.createOscillator()
            const gain = this.audioContext.createGain()
            osc.connect(gain)
            gain.connect(this.audioContext.destination)
            osc.type = "square"
            osc.frequency.setValueAtTime(600 + i * 100, this.audioContext.currentTime)
            gain.gain.setValueAtTime(0.15, this.audioContext.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
            osc.start(this.audioContext.currentTime)
            osc.stop(this.audioContext.currentTime + 0.1)
          }, i * 100)
        }
        return

      case "motivate":
      case "inspire":
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime)
        oscillator.frequency.setValueAtTime(554, this.audioContext.currentTime + 0.15)
        oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.5)
        break

      default:
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.2)
    }
  }

  playGolfHitSound() {
    if (!this.audioEnabled || !this.audioContext) return

    const oscillator1 = this.audioContext.createOscillator()
    const oscillator2 = this.audioContext.createOscillator()
    const gainNode1 = this.audioContext.createGain()
    const gainNode2 = this.audioContext.createGain()

    oscillator1.connect(gainNode1)
    oscillator2.connect(gainNode2)
    gainNode1.connect(this.audioContext.destination)
    gainNode2.connect(this.audioContext.destination)

    oscillator1.type = "sawtooth"
    oscillator1.frequency.setValueAtTime(400, this.audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1)

    oscillator2.type = "sine"
    oscillator2.frequency.setValueAtTime(800, this.audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.08)

    gainNode1.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12)

    gainNode2.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)

    const currentTime = this.audioContext.currentTime
    oscillator1.start(currentTime)
    oscillator1.stop(currentTime + 0.12)
    oscillator2.start(currentTime)
    oscillator2.stop(currentTime + 0.1)
  }

  playHoleMoveSound() {
    if (!this.audioEnabled || !this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.type = "sine"
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(900, this.audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  init() {
    this.updateBallPosition()
    this.updateHolePosition()
    this.bindEvents()
    this.randomizeHolePosition()
    this.updateStats()
  }

  bindEvents() {
    this.course.addEventListener("mousemove", (e) => this.handleMouseMove(e))
    this.course.addEventListener("mousedown", (e) => this.startAiming(e))
    this.course.addEventListener("mouseup", (e) => this.shoot(e))
    this.course.addEventListener("mouseleave", () => this.hideArrow())
    window.addEventListener("resize", () => this.handleResize())
  }

  handleResize() {
    this.ballPos.y = window.innerHeight * 0.5
    this.holePos.x = window.innerWidth - 80
    this.holePos.y = window.innerHeight * 0.5
    this.updateBallPosition()
    this.updateHolePosition()
  }

  handleMouseMove(e) {
    if (this.isMoving) return

    const rect = this.course.getBoundingClientRect()
    this.mousePos.x = e.clientX - rect.left
    this.mousePos.y = e.clientY - rect.top

    this.updateArrow()
  }

  updateArrow() {
    const dx = this.mousePos.x - this.ballPos.x
    const dy = this.mousePos.y - this.ballPos.y
    const angle = Math.atan2(dy, dx)
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 25) {
      // Calculate power-based arrow size with reduced base size
      const powerScale = Math.max(0.4, Math.min(1.5, this.power / 60)) // Reduced scaling
      const arrowWidth = 40 * powerScale // Reduced from 60px
      const arrowHeight = 3 * powerScale // Reduced from 4px
      const headSize = 8 * powerScale // Reduced from 12px

      this.arrow.style.left = this.ballPos.x + "px"
      this.arrow.style.top = this.ballPos.y + "px"
      this.arrow.style.transform = `rotate(${angle}rad) scale(${powerScale})`
      this.arrow.style.width = arrowWidth + "px"
      this.arrow.style.height = arrowHeight + "px"

      // Update arrow shaft and head sizes
      const arrowShaft = this.arrow.querySelector(".arrow-shaft")
      const arrowHead = this.arrow.querySelector(".arrow-head")

      if (arrowShaft) {
        arrowShaft.style.width = 32 * powerScale + "px" // Reduced from 50px
        arrowShaft.style.height = 3 * powerScale + "px" // Reduced from 4px
      }

      if (arrowHead) {
        arrowHead.style.borderLeftWidth = headSize + "px"
        arrowHead.style.borderTopWidth = 4 * powerScale + "px" // Reduced from 6px
        arrowHead.style.borderBottomWidth = 4 * powerScale + "px" // Reduced from 6px
        arrowHead.style.right = -6 * powerScale + "px" // Reduced from -8px
      }

      this.arrow.classList.add("visible")
    } else {
      this.arrow.classList.remove("visible")
    }
  }

  startAiming(e) {
    if (this.isMoving) return

    this.isAiming = true
    this.power = 0
    this.powerDirection = 1
    this.powerMeter.classList.add("visible")
    this.animatePower()
  }

  animatePower() {
    if (!this.isAiming) return

    this.power += this.powerDirection * 2

    if (this.power >= 100) {
      this.power = 100
      this.powerDirection = -1
    } else if (this.power <= 0) {
      this.power = 0
      this.powerDirection = 1
    }

    this.powerBar.style.width = this.power + "%"
    this.powerPercentage.textContent = Math.round(this.power) + "%"

    // Update arrow size based on power
    this.updateArrow()

    requestAnimationFrame(() => this.animatePower())
  }

  shoot(e) {
    if (!this.isAiming || this.isMoving) return

    this.isAiming = false
    this.powerMeter.classList.remove("visible")
    this.arrow.classList.remove("visible")

    // Calculate direction based on mouse aim (not forced towards hole)
    const dx = this.mousePos.x - this.ballPos.x
    const dy = this.mousePos.y - this.ballPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > 25) {
      this.animateGolfClub(dx, dy, distance)
      this.playGolfHitSound()

      this.ball.classList.add("impact")
      setTimeout(() => this.ball.classList.remove("impact"), 400)

      // Store the hole's current position for reference (but don't force ball towards it)
      const originalHoleX = this.holePos.x
      const originalHoleY = this.holePos.y

      // Use actual mouse aiming direction
      const normalizedDx = dx / distance
      const normalizedDy = dy / distance
      const force = (this.power / 100) * 15

      // Move the hole to a new position when ball is hit
      this.moveHoleInstantly()

      setTimeout(() => {
        this.moveBall(normalizedDx * force, normalizedDy * force, originalHoleX, originalHoleY)
      }, 150)

      this.shots++
      this.updateStats()

      // Replace the existing showCommentWithSound call with:
      const useCinemaStyle = Math.random() > 0.4 // 60% chance for cinema style
      const usemalayalam = Math.random() > 0.3 // 70% chance for Malayalam
      let hitComments
      if (useCinemaStyle && usemalayalam) {
        hitComments = this.malayalamCinemaHitComments
      } else if (usemalayalam) {
        hitComments = this.malayalamHitComments
      }
      this.showCommentWithSound(this.getRandomComment(hitComments))

      // Show comedy dialog or special sequence based on shot count
      if (this.shots > 0 && (this.shots % 5 === 0 || this.shots === 10 || this.shots === 25)) {
        setTimeout(() => {
          // Show special comedy sequence on shots 10, 25, or multiples of 10
          if (this.shots === 10 || this.shots === 25 || this.shots % 10 === 0) {
            this.showSpecialComedySequence()
          } else {
            this.showComedyDialog()
          }
        }, 2000)
      }
    }
  }

  moveHoleInstantly() {
    this.calculateNewHolePosition()
    this.updateHolePosition()

    setTimeout(() => {
      const useCinemaStyle = Math.random() > 0.4 // 60% chance for cinema style
      const usemalayalam = Math.random() > 0.3 // 70% chance for Malayalam
      let missComments
      if (useCinemaStyle && usemalayalam) {
        missComments = this.malayalamCinemaMissComments
      } else if (usemalayalam) {
        missComments = this.malayalamMissComments
      }
      this.showCommentWithSound(this.getRandomComment(missComments))
    }, 800)

    this.playHoleMoveSound()
  }

  animateGolfClub(dx, dy, distance) {
    const angle = Math.atan2(dy, dx)

    // Better positioning for realistic club placement
    this.golfClub.style.left = this.ballPos.x - 45 + "px" // Adjusted for longer club
    this.golfClub.style.top = this.ballPos.y - 10 + "px" // Better vertical alignment
    this.golfClub.style.transform = `rotate(${angle - Math.PI / 2.5}rad)` // More natural angle

    this.golfClub.classList.add("swinging")

    setTimeout(() => {
      this.golfClub.classList.remove("swinging")
    }, 600)
  }

  moveBall(velocityX, velocityY, targetX, targetY) {
    this.isMoving = true
    this.ball.classList.add("moving")

    const friction = 0.98
    const minVelocity = 0.4
    const courseRect = this.course.getBoundingClientRect()

    const animate = () => {
      this.ballPos.x += velocityX
      this.ballPos.y += velocityY

      if (this.ballPos.x <= 25 || this.ballPos.x >= courseRect.width - 25) {
        velocityX *= -0.7
        this.ballPos.x = Math.max(25, Math.min(courseRect.width - 25, this.ballPos.x))
        this.ball.classList.add("bounce")
        setTimeout(() => this.ball.classList.remove("bounce"), 300)
      }

      if (this.ballPos.y <= 25 || this.ballPos.y >= courseRect.height - 25) {
        velocityY *= -0.7
        this.ballPos.y = Math.max(25, Math.min(courseRect.height - 25, this.ballPos.y))
        this.ball.classList.add("bounce")
        setTimeout(() => this.ball.classList.remove("bounce"), 300)
      }

      velocityX *= friction
      velocityY *= friction

      this.updateBallPosition()

      // Check if ball reached the original hole target position
      const distanceToTarget = Math.sqrt((this.ballPos.x - targetX) ** 2 + (this.ballPos.y - targetY) ** 2)
      if (distanceToTarget < 25 && Math.abs(velocityX) < 1.5 && Math.abs(velocityY) < 1.5) {
        this.showCommentWithSound({ text: "You hit where the hole was! 🎯", sound: "close", icon: "🎯" })
      }

      if (Math.abs(velocityX) > minVelocity || Math.abs(velocityY) > minVelocity) {
        requestAnimationFrame(animate)
      } else {
        this.stopBall()
        if (this.shots > 2 && Math.random() > 0.5) {
          setTimeout(() => {
            const usemalayalam = Math.random() > 0.4 // 60% chance for Malayalam
            const encouragementComments = usemalayalam
              ? this.malayalamEncouragementComments
              : this.malayalamEncouragementComments
            this.showCommentWithSound(this.getRandomComment(encouragementComments))
          }, 1200)
        }
      }
    }

    animate()
  }

  showCommentWithSound(commentObj) {
    const commentIcon = this.commentDisplay.querySelector(".comment-icon")
    const commentText = this.commentDisplay.querySelector(".comment-text")

    commentIcon.textContent = commentObj.icon
    commentText.textContent = commentObj.text
    this.commentDisplay.classList.add("visible")

    this.playCommentSound(commentObj.sound)

    setTimeout(() => {
      this.commentDisplay.classList.remove("visible")
    }, 3500)
  }

  showComedyDialog() {
    // Randomly choose between English and Malayalam dialogs
    const usemalayalam = Math.random() > 0.5
    const dialogArray = usemalayalam ? this.malayalamComedyDialogs : this.comedyDialogs
    const comedyMessage = this.getRandomComment(dialogArray)

    this.comedyDialogTitle.textContent = comedyMessage.title
    this.comedyDialogEmoji.textContent = comedyMessage.emoji
    this.comedyDialogText.textContent = comedyMessage.text
    this.comedyDialogSubtext.textContent = comedyMessage.subtext

    this.comedyDialogDisplay.classList.add("visible")

    // Play comedy sound
    this.playCommentSound("laugh")

    setTimeout(() => {
      this.comedyDialogDisplay.classList.remove("visible")
    }, 6000) // Increased time for Malayalam text
  }

  // New method for special 5-hit comedy sequences
  showSpecialComedySequence() {
    const specialSequences = [
      {
        title: "🎬 CINEMA HALL ANNOUNCEMENT:",
        emoji: "📢",
        text: '"Interval കഴിഞ്ഞു! Second half ൽ golf hero comeback ആകുമോ?"',
        subtext: "Popcorn കഴിച്ച് suspense enjoy ചെയ്യൂ!",
      },
      {
        title: "🚗 AUTO DRIVER COMMENTARY:",
        emoji: "🚕",
        text: '"സാർ, ഈ route ൽ hole കിട്ടില്ല! Alternative route പോകാം!"',
        subtext: "Meter running ആണ്, time waste ചെയ്യരുത്!",
      },
      {
        title: "☕ TEA SHOP DISCUSSION:",
        emoji: "🍪",
        text: '"ഇവൻ golf കളിക്കുന്നത് കണ്ടോ? Daily entertainment ആയി!"',
        subtext: "Tea കുടിച്ച് commentary ചെയ്യാം!",
      },
      {
        title: "🐟 FISHERMAN'S WISDOM:",
        emoji: "⛵",
        text: '"സാർ, patience വേണം! Fish പിടിക്കാൻ പോലെ golf യും ആണ്!"',
        subtext: "Sea calm ആയാൽ luck കൂടും!",
      },
      {
        title: "🥥 COCONUT CLIMBER ADVICE:",
        emoji: "🌴",
        text: '"Height ൽ നിന്ന് കളിച്ചാൽ better view കിട്ടും! Tree ൽ കയറൂ!"',
        subtext: "Coconut water free ആയി കൊടുക്കാം!",
      },
      {
        title: "🍺 TODDY SHOP PHILOSOPHY:",
        emoji: "🌴",
        text: '"Natural kallu കുടിച്ച് കളിച്ചാൽ aim automatic ആകും!"',
        subtext: "Artificial ഒന്നും ഇല്ല, pure organic!",
      },
      {
        title: "🕉️ TEMPLE PRIEST BLESSING:",
        emoji: "🔔",
        text: '"Prayer ചെയ്ത് golf കളിച്ചാൽ divine intervention കിട്ടും!"',
        subtext: "Offering box ൽ donation ഇടാൻ മറക്കരുത്!",
      },
      {
        title: "🚤 BACKWATER GUIDE:",
        emoji: "🌅",
        text: '"Houseboat ൽ നിന്ന് golf കളിക്കാം! Romantic setting!"',
        subtext: "Family package available, food included!",
      },
    ]

    const sequence = this.getRandomComment(specialSequences)

    this.comedyDialogTitle.textContent = sequence.title
    this.comedyDialogEmoji.textContent = sequence.emoji
    this.comedyDialogText.textContent = sequence.text
    this.comedyDialogSubtext.textContent = sequence.subtext

    this.comedyDialogDisplay.classList.add("visible")
    this.playCommentSound("laugh")

    setTimeout(() => {
      this.comedyDialogDisplay.classList.remove("visible")
    }, 7000) // Longer display time for special sequences
  }

  getRandomComment(commentArray) {
    return commentArray[Math.floor(Math.random() * commentArray.length)]
  }

  getDistanceToHole() {
    const dx = this.ballPos.x - this.holePos.x
    const dy = this.ballPos.y - this.holePos.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  calculateNewHolePosition() {
    let newX,
      newY,
      attempts = 0
    const minDistance = 200
    const courseRect = this.course.getBoundingClientRect()

    do {
      newX = Math.random() * (courseRect.width - 120) + 60
      newY = Math.random() * (courseRect.height - 120) + 60
      attempts++
    } while (Math.sqrt((newX - this.ballPos.x) ** 2 + (newY - this.ballPos.y) ** 2) < minDistance && attempts < 25)

    this.holePos.x = newX
    this.holePos.y = newY
  }

  updateStats() {
    this.shotCount.textContent = this.shots

    const accuracy = this.shots > 0 ? Math.round((this.successfulShots / this.shots) * 100) : 100
    this.accuracy.textContent = accuracy + "%"

    const distanceToHole = Math.round(this.getDistanceToHole() / 8)
    this.distance.textContent = distanceToHole + "m"
  }

  stopBall() {
    this.isMoving = false
    this.ball.classList.remove("moving")
  }

  updateBallPosition() {
    this.ball.style.left = this.ballPos.x + "px"
    this.ball.style.top = this.ballPos.y + "px"
  }

  updateHolePosition() {
    this.holeContainer.style.left = this.holePos.x + "px"
    this.holeContainer.style.top = this.holePos.y + "px"
  }

  hideArrow() {
    this.arrow.classList.remove("visible")
  }

  randomizeHolePosition() {
    this.calculateNewHolePosition()
    this.updateHolePosition()
  }
}

// Initialize the 2D golf game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new Golf2DGame()
})