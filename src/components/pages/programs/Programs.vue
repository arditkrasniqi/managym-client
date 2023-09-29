<template>
    <div>
        <h1 class="page-title">
            {{ $t('My Programs') }}
        </h1>
        <div>
            <div class="card">
                <div class="card-block">
                    <button @click="goToDefineProgram" class="btn primary-bg">
                        <i class="fa fa-plus"></i> {{ $t('New Program') }}
                    </button>
                    <div class="table-responsive">
                        <table class="table-hover table">
                            <thead>
                                <tr>
                                    <th>{{ $t('Title') }}</th>
                                    <th>{{ $t('Description') }}</th>
                                    <th>{{ $t('Duration') }}</th>
                                    <th>{{ $t('Price') }}</th>
                                    <th class="w50">
                                        <span>{{ $t('Edit') }}</span>
                                    </th>
                                    <th class="w50">
                                        <i class="fa fa-spinner fa-spin pull-right" v-if="removeSpinner"></i>
                                        <span v-else>{{ $t('Remove') }}</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="program in trainerPrograms" :key="program.id">
                                    <td>{{ program.title }}</td>
                                    <td>{{ program.description }}</td>
                                    <td>{{ program.duration }}</td>
                                    <td>{{ currency }} {{ program.price }}</td>
                                    <td class="icons text-center">
                                        <a v-if="program.organisationProgram === 0" href="javascript:void(0)"
                                            @click="editProgramModal(program)">
                                            <i class="fa fa-edit"></i>
                                        </a>
                                    </td>
                                    <td class="icons text-center">
                                        <a v-if="program.organisationProgram === 0" href="javascript:void(0)"
                                            @click="removeProgram(program)">
                                            <i class="text-danger fa fa-trash"></i>
                                        </a>
                                    </td>
                                </tr>
                                <tr v-if="typeof trainerPrograms == 'string' && trainerPrograms == ''">
                                    <td class="text-center" colspan="6">
                                        <i class="fa fa-spinner fa-spin"></i>
                                        <p>{{ $t('Loading programs') }}...</p>
                                    </td>
                                </tr>
                                <tr v-if="typeof trainerPrograms == 'object' && trainerPrograms.length == 0">
                                    <td colspan="6">
                                        <p>{{ $t('No programs defined yet') }}.</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <p class="programs-note">
                {{ $t('NOTE') }}:<br />{{ $t('Programs created by Organisation owners cant be edited nor removed') }}!
            </p>
        </div>

        <!-- Modal -->
        <div id="editProgramModal" class="modal fade" role="dialog">
            <div class="modal-dialog">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">{{ $t('Edit Program') }}</h4>
                    </div>
                    <form @submit.prevent="editProgram">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>{{ $t('Title') }}</label>
                                <input v-validate="'required'" v-model="programToEdit.title" name="title"
                                    :data-vv-as="$t('Title')" type="text" class="form-control">
                                <span v-show="errors.has('title')"
                                    class="text-danger">{{ errors.first('title') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Description') }}</label>
                                <textarea v-validate="'required'" v-model="programToEdit.description" type="text"
                                    name="description" :data-vv-as="$t('Description')" class="form-control"></textarea>
                                <span v-show="errors.has('description')"
                                    class="text-danger">{{ errors.first('description') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Duration') }}</label>
                                <input readonly v-validate="'required'" v-model="programToEdit.duration" type="text"
                                    name="duration" :data-vv-as="$t('Duration')" placeholder="hh:mm"
                                    id="programDuration" class="timepicker form-control"></input>
                                <span v-show="errors.has('duration')"
                                    class="text-danger">{{ errors.first('duration') }}</span>
                            </div>
                            <div class="form-group">
                                <label>{{ $t('Price') }}</label>
                                <div class="input-group">
                                    <span class="input-group-addon" id="basic-addon1">{{ currency }}</span>
                                    <input type="text" v-model="programToEdit.price" v-validate="'required|decimal'"
                                        class="form-control" name="price" :data-vv-as="$t('Price')">
                                </div>
                                <p v-show="errors.has('price')" class="text-danger">{{ errors.first('price') }}</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn primary-bg" type="submit">
                                <span v-if="editSpinner" class="fa fa-spinner fa-spin"></span>
                                <span v-else>{{ $t('Edit') }}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
    data() {
        return {
            trainerPrograms: '',
            removeSpinner: false,
            editSpinner: false,
            programToEdit: '',
        };
    },
    created() {
        this.getTrainerPrograms();
    },
    mounted() {
        let vm = this;
        $(".timepicker").each(function () {
            $(this).timepicker({
                maxHours: 24,
                showMeridian: false,
                // defaultTime:date
            });
        });

        $('#programDuration').on('change', function () {
            vm.programToEdit.duration = $(this).val();
        });
    },
    methods: {
        goToDefineProgram() {
            this.$router.push({ name: 'define.program' })
        },
        getTrainerPrograms() {
            let vm = this;
            axios.get(process.env.api_hostname + '/trainerPrograms')
                .then(response => {
                    vm.trainerPrograms = response.data.data;
                });
        },
        removeProgram(p) {
            let vm = this;
            this.$swal({
                title: this.$t('Confirm'),
                text: this.$t('Are you sure you want to remove this program') + ' ?',
                confirmButtonText: this.$t('Yes'),
                cancelButtonText: this.$t('Cancel'),
                showCancelButton: true,
                showCloseButton: true,
                target: $("#rtl-container")[0]
            }).then(
                result => {
                    this.removeSpinner = true;
                    axios.delete(process.env.api_hostname + '/removeProgram',
                        {
                            data: {
                                programId: p.id
                            }
                        }).then(response => {
                            vm.removeSpinner = false;
                            vm.trainerPrograms = response.data.data;
                            this.$notify({
                                group: "foo",
                                title: this.$t('Message'),
                                text: this.$t('Program removed') + "!"
                            });
                        });
                },
                dismiss => {
                }
            );
        },
        editProgramModal(p) {
            this.programToEdit = p;
            $('#editProgramModal').modal('show');
        },
        editProgram() {
            this.editSpinner = true;
            let vm = this;
            let program = this.programToEdit;
            axios.put(process.env.api_hostname + '/editProgram',
                {
                    programId: program.id,
                    title: program.title,
                    description: program.description,
                    duration: program.duration,
                    price: program.price,
                }).then(response => {
                    vm.editSpinner = false;
                    $('#editProgramModal').modal('hide');
                    // this.$notify
                });
        }
    },
    computed: {
        ...mapState({
            userStore: state => state.user,
            currency: state => state.currency
        })
    }
};
</script>
<style lang="scss">
.card {
    .card-block {
        padding: 15px;

        >button {
            margin-bottom: 20px;
        }

        .icons {
            font-size: 22px;
        }
    }
}

.programs-note {
    font-size: 14px;
    color: #505050;
    padding: 3px;
    margin-top: 6px;
}
</style>
