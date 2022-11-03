<template>
    <div>
        <div class="container">
            <div v-if="trainerList.length > 0" class="trainers text-center">
                <span class="content-title text-uppercase">{{ $t('Trainers') }}</span>
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-3" v-for="trainer in trainerList" :key="trainer.id">
                        <div class="trainer">
                            <div @click="setTrainerVisitId(trainer.id)" class="trainer-avatar">
                                <img :src="storage + trainer.avatar" class="img-fluid" alt="Trainer Picture">
                            </div>
                            <div class="trainer-info">
                                <h4>{{ trainer.firstname }} {{ trainer.lastname }}</h4>
                                <p>{{ trainer.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="what-we-de mr-auto ml-auto text-center">
                <span class="content-title text-uppercase">{{ $t('What we do') }}</span>
                <div class="row">
                    <div class="col-12 col-md-4">
                        <div class="item-round">
                            <div class="item-logo">
                                <i class="fa fa-pencil"></i>
                            </div>
                            <div class="item-text">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="item-round">
                            <div class="item-logo">
                                <i class="fa fa-address-book-o"></i>
                            </div>
                            <div class="item-text">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4">
                        <div class="item-round">
                            <div class="item-logo">
                                <i class="fa fa-cogs"></i>
                            </div>
                            <div class="item-text">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import config from "../../config";

    export default {
        name: "content-4trainer",
        data() {
            return {
                storage: config.hostname + "/storage/"
            };
        },
        computed: {
            ...mapState({
                trainerList: state => state.frontPage.trainerSearch.trainerList
            })
        },
        methods: {
            setTrainerVisitId(id) {
                this.$store.commit("setTrainerVisitId", id);
                $("#loginModal").modal("show");
            }
        }
    };
</script>

<style lang="scss">
    .input-field {
        background: none;
        outline: none;
        border: none;
        border-radius: 0;
        border-bottom: 2px solid #3da0d8;
    }

    .button {
        cursor: pointer;
        border-radius: 0;
        background: #3da0d8;
        color: white;
        padding: 5px 15px;
    }

    .content-title {
        @extend .button;
    }

    .trainers {
        margin: 40px auto;
        border-bottom: 1px solid #3da0d8;
        .trainer-avatar {
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .trainer {
            cursor: pointer;
            position: relative;
            height: 300px;
            margin-top: 60px;
            margin-bottom: 60px;
            transition: transform 0.3s;
            &:hover {
                box-shadow: 0 22px 35px rgba(0, 0, 0, 0.5);
                transform: scale(1.04);
            }
            .trainer-info {
                overflow: hidden;
                color: white;
                width: 100%;
                background: rgba(61, 160, 216, 0.78);
                min-height: 80px;
                height: 80px;
                max-height: 80px;
                position: absolute;
                bottom: 0;
                left: 0;
                h4 {
                    font-size: 20px;
                    border-bottom: 1px dotted white;
                    padding-bottom: 7px;
                }
                p {
                    font-size: 14px;
                }
            }
        }
    }

    .what-we-de {
        margin-top: 40px;
        max-width: 690px !important;
        .content-title {
            margin-bottom: 40px;
        }
        .item-round {
            margin-top: 40px;
            .item-logo {
                /*width: 100%;*/
                padding: 50px;
                border-radius: 100%;
                border: 2px solid #3da0d8;
                background: #3da0d8;
                color: white;
                transition: background 0.3s, color 0.3s;
                &:hover {
                    cursor: pointer;
                    background: white;
                    i {
                        color: #3da0d8;
                    }
                }
                i {
                    font-size: 100px;
                }
            }
            .item-text {
                p {
                    margin-top: 20px;
                    font-size: 15px;
                    color: #3da0d8;
                }
            }
        }
    }

    .footer {
        margin-top: 80px;
        padding: 38px 10px;
        background-image: url("../../assets/img/footer.png");
        background-size: 100% 110%;
        background-position-y: -10px;
        color: white;
    }

    .powered {
        padding: 10px;
    }

    @media screen and (max-width: 767px) {
        .item-logo {
            width: 200px;
            margin: 0 auto;
        }
    }
</style>
