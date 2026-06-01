<template>
<div>
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
</div>
</template>

<script>
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
        DatePicker,
        Bar
    },
    data() {
        return {
            date: new Date('2020-3-4'),
            loaded: false,
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
                    url: '/coviddaily',
                    params: {
                        date: this.date
                    }
                }).then(function (response) {
                    let algo = Object.values(response.data)
                    algo.shift()
                    self.chartData.datasets[0].data = algo
                    self.loaded = true
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
}
</script>

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
</style>
