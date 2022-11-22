<template>
<div>
    <div v-if="!sendEmail">
        <div id="calendar">
            <DatePicker @dayclick="getChartData()" class="inline-block h-full" style="margin-bottom: 1em;" v-model="date" :min-date='new Date("2020-1-13")' :max-date='new Date("2021-3-7")'>
                <template v-slot="{ togglePopover }">
                    <div class="flex items-center">
                        <button class="p-2 bg-blue-100 border border-blue-200 hover:bg-blue-200 text-blue-600 rounded-l focus:bg-blue-500 focus:text-white focus:border-blue-500 focus:outline-none" @click="togglePopover()">
                            <span class="material-symbols-outlined">
                                calendar_month
                            </span>
                        </button>
                    </div>
                </template>
            </DatePicker>
        </div>
        <div id="chartBox">
            <Bar v-if="loaded" :chart-data="chartData" :width="400" :height="400" :chart-options="chartOptions" />
        </div>
        <button type="button" v-if="this.loaded" id="btnOpenEmail" style="margin-top: 1em;" @click="this.sendEmail=true">Send data by email</button>
    </div>
    <div v-else id="emailDiv">
        <h1>Enter Emails</h1>
        <VueMultiselect v-model="selected" track-by="code" tag-placeholder="Add this email" label="name" placeholder="Add email(s)" :taggable="true" :options="options" :multiple="true" @tag="addTag">
        </VueMultiselect>
        <div id="btnDiv">
            <button type="button" style="margin: 1em 1em 0 0;" @click="postEmail()">Send</button>
            <button type="button" style="margin: 1em 0 0 1em;" @click="this.sendEmail=false">Cancel</button>
        </div>
    </div>
</div>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import 'v-calendar/dist/style.css';
import {
    DatePicker
} from 'v-calendar';
import {
    Bar
} from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import axios from 'axios';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'HelloWorld',
    components: {
        VueMultiselect,
        DatePicker,
        Bar
    },
    data() {
        return {
            selected: [{
                name: 'example@example.com',
                code: 'ex'
            }],
            options: [{
                name: 'example@example.com',
                code: 'ex'
            }],
            date: new Date('2020-3-4'),
            loaded: false,
            sendEmail: false,
            chartData: {
                labels: ['Positive', 'Negatives', 'Pending', 'Death'],
                datasets: [{
                    label: 'CovidDaily',
                    backgroundColor: '#3182ce',
                    data: [40, 20, 12]
                }]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    async mounted() {
        this.getChartData()
    },
    methods: {
        addTag(newTag) {
            if (!newTag.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Incorrect Email',
                    icon: 'error',
                    confirmButtonText: 'Try again'
                })
            } else {
                const tag = {
                    name: newTag,
                    code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
                }
                this.options.push(tag)
                this.selected.push(tag)
            }
        },
        padTo2Digits(num) {
            return num.toString().padStart(2, '0');
        },
        formatDate(date) {
            return [
                date.getFullYear(),
                this.padTo2Digits(date.getMonth() + 1),
                this.padTo2Digits(date.getDate()),
            ].join('-');
        },
        getChartData: async function () {
            const self = this
            self.date = self.formatDate(self.date)
            self.loaded = false
            try {
                await axios({
                    method: 'get',
                    url: 'http://localhost:3000/coviddaily',
                    params: {
                        date: this.date
                    }
                }).then(function (response) {
                    console.log(response.data);
                    let algo = Object.values(response.data)
                    algo.shift()
                    self.chartData.datasets[0].data = algo
                    self.loaded = true
                });
            } catch (error) {
                console.error(error);
            }
        },
        postEmail: async function () {
            try {
                await axios({
                    method: 'post',
                    url: 'http://localhost:3000/sendNotification',
                    params: {
                        destinatarios: this.selected,
                        mensaje: this.chartData.datasets[0].data
                    }
                }).then(function (response) {
                    console.log(response.data);
                    this.sendEmail = false
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Opps, Something goes wrong',
                    icon: 'error',
                    confirmButtonText: 'Try again'
                })
            }
        }

    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
#chartBox {
    background-color: rgba(255, 255, 255, 0.5);
}

button {
    background-color: #008CBA;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}

button:hover{
    cursor: pointer;
}

h1 {
    color: white;
}

#emailDiv {
    margin: auto;
    width: 50%;
    padding: 5em;
}
</style>
