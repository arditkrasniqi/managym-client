<template>
    <header id="mainNav" v-if="userStore.auth">
        <nav class="navbar navbar-expand-md navbar-dark fixed-top ">
            <a class="navbar-brand" href="javascript:void(0)">
                <img src="../../assets/img/logo-inverse.png" alt="">
                <i @click="toggleSidebar()" class="toggleMenu fa fa-chevron-circle-right"></i>
            </a>
            <!--<a class="toggleMenu" @click="toggleSidebar" href="javascript:void(0)">-->

                <!--<span class="sr-only">(current)</span>-->
            <!--</a>-->
            <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="fa fa-bars"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                    <!--<li class="nav-item">-->
                        <!--<a class="nav-link" href="#"><i class="fa fa-bars"></i><span class="sr-only">(current)</span></a>-->
                    <!--</li>-->
                </ul>
                <!--<div class="btn-group">-->
                    <!--<a class="dropdown-toggle nav-link nofitications" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
                        <!--<i class="fa fa-bell-o"></i>-->
                    <!--</a>-->
                    <!--<div class="dropdown-menu dropdown-menu-right">-->
                        <!--<button class="dropdown-item" type="button">Sent a request</button>-->
                        <!--<button class="dropdown-item" type="button">Sent a request</button>-->
                    <!--</div>-->
                <!--</div>-->
                <div class="btn-group">
                    <a class="dropdown-toggle nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ userStore.info.firstname }} {{ userStore.info.lastname }}
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="btn" @click="goToMyProfile" v-if="userStore.role === 'trainer'">{{$t('My Profile')}}</a>
                        <router-link to="/profile">{{$t('Settings')}}</router-link>
                        <a v-if="userStore.role === 'trainer'" href="javascript:void(0)" data-toggle="modal" data-target="#affiliateLinkModal" class="dropdown-item">{{$t('Affiliate Link')}}</a>
                        <router-link v-if="userStore.role === 'customer'" to="/become-trainer">{{$t('Become a Trainer')}}</router-link>
                        <button class="dropdown-item" @click="logout" type="button">{{$t('Logout')}}</button>
                    </div>
                </div>
                <div class="btn-group">
                    <a class="dropdown-toggle no-triangle nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-globe"></i>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a href="javascript:void(0)" @click="setLocale('en')">English</a>
                        <a href="javascript:void(0)" @click="setLocale('de')">Deutch</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Modal -->
        <div id="affiliateLinkModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{$t('Affiliate Link')}}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-12">
                                <div class="form-group">
                                    <input type="text" id="affiliateLink" :value="userStore.affiliateLink" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer mf">
                        <button @click="copyAffiliateLink" type="button" class="btn primary-bg" data-dismiss="modal">{{$t('Copy to Clipboard')}}</button>
                    </div>
                </div>

            </div>
        </div>
    </header>
</template>
<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    import config from '../../config.js'
    import URL from '../../assets/js/URL-Parser/js/URLParser'

    export default{
        created(){
            if(document.location.href.includes('become-trainer')){
                if(this.userStore.auth != 'customer'){
                    this.$router.push('/');
                }
            }
        },
        mounted(){
            $('*').on('click',function(e){
                if(!$(e.target).hasClass('dropdown-toggle')){
                    if($('#navbarsExampleDefault').hasClass('show')){
                        $('#navbarsExampleDefault').removeClass('show');
                    }
                }
            });
        },
        methods:{
            goToMyProfile(){
                let path = document.location.href;
                if(path.includes('trainer/')){
                    path = path.replace(path.substr(path.lastIndexOf('/')+1),this.userStore.info.id);
                    location.replace(path);
                }else {
                    this.$router.push(`/trainer/${this.userStore.info.id}`);
                }
            },
            logout(){
                this.$store.commit('logout');
                this.$store.commit('setTrainerVisitId',0);
                window.location.href = '/';
            },
            toggleSidebar:function(){
                if($('.sidebar').css('display') == 'none')
                    $('.sidebar').attr('style','display:block !important');
                else
                    $('.sidebar').attr('style','display:none !important');
            },
            home(){
                this.$router.push('/');
            },
            copyAffiliateLink(){
                $('#affiliateLink').select();
                document.execCommand('Copy');
                this.$notify({
                    group: 'foo',
                    title: this.$t('Message'),
                    text: this.$t('Copied to Clipboard') + '!'
                });
            },
            setLocale:function(lang){
                localStorage.setItem('locale',lang);
                this.$i18n.locale = lang;
                if(document.location.href.includes('calendar')){
                    location.reload();
                }
            }
        },
        computed:{
            ...mapState({
                userStore: state => state.user
            })
        }
    }
</script>
<style lang="scss">
    @import '../../styles/_variables.scss';
    header{
        margin-top:60px;
        nav{
            background-color:white;
            padding-top:0 !important;
            padding-bottom:0 !important;
            border-bottom:1px solid #cccccc52;
            *{
                color:#858c9e !important;
            }
            button{
                border-color:#858c9e !important;
            }
            .navbar-brand{
                position:relative;
                img{
                    width: 58px;
                    height: 41px;
                }
                i{
                    position: absolute;
                    top: 11px;
                    right: -30px;
                }
            }
            .navbar-brand a{
                margin-left:15px;
            }
            #navbarsExampleDefault{
                .btn-group{
                    float:right;
                }
            }
            .navbar-brand a{
                display:none;
            }
        }
        .dropdown-toggle{
            background:none;
            border:none;
            cursor:pointer;
            line-height:45px;
        }
        .dropdown-menu{
            left:auto;
            right:0;
            a{
                display: block;
                width: 100%;
                padding: .25rem 1.5rem;
                clear: both;
                font-weight: 400;
                color: #212529;
                text-align: inherit;
                white-space: nowrap;
                background: 0 0;
                border: 0;
                &:hover{
                    color: #16181b;
                    text-decoration: none;
                    background-color: #f8f9fa;
                }
            }
        }
        .nofitications{
            &:after{
                visibility:hidden;
            }
            &:before{
                content:"1";
                padding:0px 4px;
                line-height:0;
                margin-right:1px;
                border-radius:100%;
                font-size:9px;
                background:#e46464;
                color:white;
            }
        }
    }
    .mf{
        padding:0;
        .btn{
            width: 100%;
            border-top-right-radius: 0;
            border-top-left-radius: 0;
            padding: 16px;
            cursor:pointer;
        }
    }
    @media screen and (max-width:770px){
        .toggleMenu{
            display:block !important;
        }
    }
    .toggleMenu{
        display:none;
    }
    #mainNav{
        nav{
            border-bottom:1px solid #efefef;
            padding-right:0;
        }
    }
</style>