const { createApp } = Vue;

createApp({
    data() {
        return {
            pokemon: {
                life: 351,
                maxLife: 351,
                name: 'Rayquaza',
                attack: 336,
                defense: 216,
                speed: 226,
                move: "",
                percent: 99,
            },

            oponent: {
                life: 441,
                maxLife: 441,
                name: 'Giratina',
                attack: 276,
                defense: 236,
                speed: 216,
                move: "",
                percent: 98,
            },

            // Variáveis -------------------------------------------------------------
            calms: 3, //Contador do Calm Mind
            fighting: false, // Verficador se "fight" está ativo
            bagStatus: false, // Verficador se "bag" está ativa
            battling: false, // Verficador se estão batalhando
            pokemonBar: false, // Verificador se a Pokemons Bar está ativa
            potion: true, // Contador da potion
            battle: 0, // Contador de turno de batalha
            runn: false, // Verificador de fuga

            moveStats: {
                name: "",
                pp: null,
                type: "",
                db: 0,
                modAtk: 1,
                modDef: 1,
            },

            // PP ----------------------------------------------------------------------
            thunder: {
                name: 'Thunder',
                pp: 10,
                type: "Eletric",
                db: 60,
                modAtk: 1,
                modDef: 1,
            },

            bulkUp: {
                name: 'Bulk Up',
                pp: 20,
                type: "Fighting",
                db: 0,
                modAtk: 1.2,
                modDef: 1.2,
            },

            crunch: {
                name: 'Crunch',
                pp: 15,
                type: "Dark",
                db: 100,
                modAtk: 1,
                modDef: 1,
            },

            twister: {
                name: 'Twister',
                pp: 20,
                type: "Dragon",
                db: 110,
                modAtk: 1,
                modDef: 1,
            },

            dragonClaw: {
                name: 'Dragon Claw',
                pp: 15,
                type: "Dragon",
                db: 110,
                modAtk: 1,
                modDef: 1,
            },

            shadowBall: {
                name: 'ShadowBall',
                pp: 15,
                type: "Ghost",
                db: 80,
                modAtk: 1,
                modDef: 1,
            },

            calmMind: {
                name: 'Calm Mind',
                pp: 20,
                type: "Psychic",
                db: 0,
                modAtk: 1.1,
                modDef: 1.1,
            },
        }
    },
    methods: {
        // Botões --------------------------------------------------------------------------------

        // Som do botão ------------------------------------------------------------------------------------
        buttonSound() {
            const som = new Audio('/sounds/notification.mp3')
            som.play()
        },

        // Abre o menu Fight ------------------------------------------------------------------------------
        fight() {
            this.fighting = !this.fighting
            this.buttonSound()
        },

        // Abre a Bag -----------------------------------------------------------------------------------------
        bag() {
            this.bagStatus = !this.bagStatus
            this.buttonSound()
        },

        // Foge da batalha ------------------------------------------------------------------------------------
        run() {
            this.runn = true
            this.battle = 8
            this.buttonSound()
        },

        // Abre o menu de Pokemons ------------------------------------------------------------------------------
        showPokemonBar() {
            this.pokemonBar = !this.pokemonBar
            this.buttonSound()
        },

        // Método que usa a Potion ------------------------------------------------------------------------------
        usePotion() {
            this.bagStatus = false
            this.potion = false
            this.pokemon.life = this.pokemon.maxLife
            this.pokemon.percent = 99
            this.battle++
            this.pokemon.move = "Max potion"
            this.buttonSound()
        },

        // Botão que avança e verifica jogo -----------------------------------------------------------------------
        next() {
            if (this.oponent.life === 0) {
                this.battle = 6
            } else {
                this.battle++
                this.ia()
                if (this.battle === 4) {
                    this.battle = 0
                }
                this.buttonSound()
            }
        },

        // 2º Botão que avança e verifica jogo -----------------------------------------------------------------------
        next2() {
            if (this.pokemon.life === 0) {
                this.battle = 7
            } else {
                this.battle = 0
            }
            this.buttonSound()
        },

        // Botão que recarrega á página ------------------------------------------------------------------------------
        btnRestart() {
            this.buttonSound()
            window.location.reload();
        },

        // Mostra a quantidade de PPs na HotBar ------------------------------------------------------------------------
        showPP(name) {
            switch (name) {
                case 'thunder':
                    this.moveStats = this.thunder
                    break
                case 'twister':
                    this.moveStats = this.twister
                    break
                case 'bulkUp':
                    this.moveStats = this.bulkUp
                    break
                case 'crunch':
                    this.moveStats = this.crunch
                    break
            }
        },

        // Limpa os status da HotBar -----------------------------------------------------------------------------------
        clearDiv() {
            this.moveStats = ""
        },

        // Pokemon Ataques -------------------------------------------------------------
        attack(name) {
            const som = new Audio(`/MoveSounds/${name}.mp3`)
            som.play()

            switch (name) {
                case 'thunder':
                    this.moveStats = this.thunder
                    break
                case 'twister':
                    this.moveStats = this.twister
                    break
                case 'crunch':
                    this.moveStats = this.crunch
                    break
                case 'bulkUp':
                    this.moveStats = this.bulkUp
                    break
            }

            if (this.moveStats.pp === 0) {
            } else {
                this.moveStats.pp--

                this.oponent.life -= Math.floor(((this.pokemon.attack / this.oponent.defense) * this.moveStats.db))
                this.pokemon.attack *= this.moveStats.modAtk
                this.pokemon.defense *= this.moveStats.modDef

                if (this.oponent.life < 0) {
                    this.oponent.life = 0
                }

                this.battle++
                this.pokemon.move = this.moveStats.name
                this.calculaPercentOpo()
            }
        },

        // Oponent ataques --------------------------------------------------------------
        ia(name) {
            if (this.oponent.life <= (this.oponent.maxLife * 0.3)) {
                this.attackRecover()
            } else {
                var num = Math.floor(Math.random() * 3)

                switch (num) {
                    case 0:
                        this.moveStats = this.dragonClaw
                        break
                    case 1:
                        this.moveStats = this.shadowBall
                        break
                    case 2:
                        this.moveStats = this.calmMind
                        break
                }

                name = this.moveStats.name
                const som = new Audio(`/MoveSounds/${name}.mp3`)
                som.play()

                if (this.moveStats.pp === 0) {
                } else {
                    this.moveStats.pp--
    
                    this.pokemon.life -= Math.floor(((this.oponent.attack / this.pokemon.defense) * this.moveStats.db))
                    this.oponent.attack *= this.moveStats.modAtk
                    this.oponent.defense *= this.moveStats.modDef
    
                    if (this.pokemon.life < 0) {
                        this.pokemon.life = 0
                    }
    
                    this.battle++
                    this.oponent.move = this.moveStats.name
                    this.calculaPercentPoke()
                }
            }
        },

        attackRecover() {
            const som = new Audio('/MoveSounds/recover.mp3')
            som.play()

            this.oponent.life += Math.floor(this.oponent.maxLife / 2)

            this.battle++
            this.oponent.move = "Recover"
            this.calculaPercentOpo()
        },
    },

    computed: {
        lifeBarColorPoke() {
            if (this.pokemon.percent <= 10) {
                return "#a1382a"
            } else if (this.pokemon.percent > 10 && this.pokemon.percent <= 49) {
                return "#e0d753"
            } else if (this.pokemon.percent > 50) {
                return "#44dc75"
            }
        },

        lifeBarColorOpo() {
            if (this.oponent.percent <= 10) {
                return "#a1382a"
            } else if (this.oponent.percent > 10 && this.oponent.percent <= 49) {
                return "#e0d753"
            } else if (this.oponent.percent > 50) {
                return "#44dc75"
            }
        },

        calculaPercentPoke() {
            this.pokemon.percent = ((this.pokemon.life / this.pokemon.maxLife) * 100)
        },

        calculaPercentOpo() {
            this.oponent.percent = ((this.oponent.life / this.oponent.maxLife) * 100)
        },
    }
}).mount('#app')