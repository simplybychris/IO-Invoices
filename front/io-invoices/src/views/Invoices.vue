<template>
    <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
            <b-col lg="6" class="my-1">
                <b-form-group
                    label="Sort"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="sortBySelect"
                    class="mb-0"
                >
                    <b-input-group size="sm">
                        <b-form-select
                            v-model="sortBy"
                            id="sortBySelect"
                            :options="sortOptions"
                            class="w-75"
                        >
                            <template #first>
                                <option value="">-- none --</option>
                            </template>
                        </b-form-select>
                        <b-form-select
                            v-model="sortDesc"
                            size="sm"
                            :disabled="!sortBy"
                            class="w-25"
                        >
                            <option :value="false">Asc</option>
                            <option :value="true">Desc</option>
                        </b-form-select>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <b-col lg="6" class="my-1">
                <b-form-group
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="initialSortSelect"
                    class="mb-0"
                >
                    <!-- <b-form-select
                        v-model="sortDirection"
                        id="initialSortSelect"
                        size="sm"
                        :options="['asc', 'desc', 'last']"
                    ></b-form-select> -->
                </b-form-group>
            </b-col>

            <b-col lg="6" class="my-1">
                <b-form-group
                    label="Filter"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0"
                >
                    <b-input-group size="sm">
                        <b-form-input
                            v-model="filter"
                            type="search"
                            id="filterInput"
                            placeholder="Type to Search"
                        ></b-form-input>
                        <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''"
                                >Clear</b-button
                            >
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- <b-col lg="6" class="my-1">
                <b-form-group
                    label="Filter On"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    description="Leave all unchecked to filter on all data"
                    class="mb-0"
                >
                    <b-form-checkbox-group v-model="filterOn" class="mt-1">
                        <b-form-checkbox value="name">Name</b-form-checkbox>
                        <b-form-checkbox value="invoice-date"
                            >Date</b-form-checkbox
                        >
                        <b-form-checkbox value="isActive">Due</b-form-checkbox>
                    </b-form-checkbox-group>
                </b-form-group>
            </b-col> -->

            <b-col sm="5" md="6" class="my-1">
                <b-form-group
                    label="Per page"
                    label-cols-sm="6"
                    label-cols-md="4"
                    label-cols-lg="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0"
                >
                    <b-form-select
                        v-model="perPage"
                        id="perPageSelect"
                        size="sm"
                        :options="pageOptions"
                    ></b-form-select>
                </b-form-group>
            </b-col>

            <b-col sm="7" md="6" class="my-1">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="fill"
                    size="sm"
                    class="my-0"
                ></b-pagination>
            </b-col>
        </b-row>

        <!-- Main table element -->
        <b-table
            show-empty
            small
            stacked="md"
            striped
            hover
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
        >
            <template #cell(name)="row">
                {{ row.item.first_name + ' ' + row.item.last_name }}
            </template>

            <template #cell(actions)="row">
                <!-- <b-button
                    size="sm"
                    variant="outline-primary"
                    @click="info(row.item, row.index, $event.target)"
                    class="mr-1"
                >
                    Info modal
                </b-button>
                <b-button
                    size="sm"
                    variant="outline-primary"
                    @click="row.toggleDetails"
                >
                    {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                </b-button> -->
                <b-button
                    v-if="row.item.invoice_status_id === 1"
                    style="margin-left: 4px"
                    size="sm"
                    class="mr-1"
                    variant="info"
                    :to="{ path: '/edit/' + row.item.id }"
                >
                    Edit
                </b-button>
                <b-button
                    v-if="row.item.invoice_status_id !== 3"
                    style="margin-left: 4px"
                    size="sm"
                    class="mr-1"
                    variant="danger"
                    @click="deleteInvoice(row.item.id)"
                >
                    X
                </b-button>
            </template>

            <template #row-details="row">
                <b-card>
                    <ul>
                        <li v-for="(value, key) in row.item" :key="key">
                            {{ key }}: {{ value }}
                        </li>
                    </ul>
                </b-card>
            </template>
        </b-table>

        <!-- Info modal -->
        <!-- <b-modal
            :id="infoModal.id"
            :title="infoModal.title"
            ok-only
            @hide="resetInfoModal"
        >
            <pre>{{ infoModal.content }}</pre>
        </b-modal> -->
        <!-- <AddEmployee>Czesc</AddEmployee> -->
        <b-button
            variant="success"
            size="sm"
            class="float-right"
            @click="$bvModal.show('bv-modal-example')"
        >
            Add Invoice
        </b-button>

        <!-- Modal div -->
        <b-modal id="bv-modal-example" hide-footer>
            <template #modal-title> Add Invoice </template>
            <div class="d-block text-center">
                <h3>Insert invoice data</h3>
            </div>
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="Employee:"
                    v-model="employee_name"
                    label-for="input-1"
                >
                    <div>
                        <b-form-select
                            v-model="selected"
                            :options="customers"
                            v-bind:value="first_name"
                        ></b-form-select>
                        <div class="mt-3">
                            Selected:
                            <strong>{{
                                selected.first_name + ' ' + selected.last_name
                            }}</strong>
                        </div>
                    </div>
                </b-form-group>
            </b-form>
            <b-form>
                <b-form-group id="input-group-2" label-for="input-2">
                    <div>
                        <label for="example-datepicker"
                            >Choose invoice date:</label
                        >
                        <b-form-datepicker
                            id="example-datepicker"
                            v-model="dateVal"
                            class="mb-2"
                        ></b-form-datepicker>
                        <p>Choosed: {{ dateVal }}</p>
                    </div>
                </b-form-group>
            </b-form>
            <b-form>
                <b-form-group id="input-group-3" label-for="input-3">
                    <div>
                        <label for="example-datepicker2"
                            >Choose due date:</label
                        >
                        <b-form-datepicker
                            id="example-datepicker2"
                            v-model="dueDateVal"
                            class="mb-2"
                        ></b-form-datepicker>
                        <p>Choosed: {{ dueDateVal }}</p>
                    </div>
                </b-form-group>
            </b-form>
            <b-button class="mt-3" block @click="addInvoice()"
                >Add invoice

                <!-- $bvModal.hide('bv-modal-example') -->
            </b-button>
        </b-modal>
    </b-container>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
// import AddInvoice from './AddInvoice'
export default {
    components: {
        // AddInvoice,
    },
    data() {
        return {
            selected: { first_name: '', last_name: '' },
            dateVal: '',
            dueDateVal: '',
            items: [],
            customers: [],
            fields: [
                {
                    key: 'name',
                    label: 'Person full name',
                    sortable: true,
                    sortDirection: 'desc',
                },
                {
                    key: 'invoice_date',
                    label: 'Invoice date',
                    sortable: true,
                    formatter: value => {
                        return moment(value).format('DD-MM-YYYY')
                    },
                },
                {
                    key: 'due_date',
                    label: 'Due',
                    // formatter: (value) => {
                    //     return value ? 'Yes' : 'No'
                    // },
                    sortable: true,
                    // sortByFormatted: true,
                    // filterByFormatted: true,
                    formatter: value => {
                        return moment(value).format('DD-MM-YYYY')
                    },
                },
                {
                    key: 'total',
                    label: 'Total price',
                    sortable: true,
                },
                {
                    key: 'invoice_status_id',
                    label: 'Status',
                    formatter: value => {
                        if (value === 1) {
                            return 'Pending'
                        }
                        if (value === 2) {
                            return 'Canceled'
                        }
                        if (value === 3) {
                            return 'Paid'
                        } else {
                            return 'Error'
                        }
                    },
                },
                { key: 'actions', label: 'Actions' },
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            infoModal: {
                id: 'info-modal',
                title: '',
                content: '',
            },
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        },
    },
    async mounted() {
        // Set the initial number of items
        this.totalRows = this.items.length
        // await axios.get('http://localhost:4040/invoices').then((response) => {
        //     console.log(response.data)
        //     this.items = response.data
        // })
    },
    async created() {
        try {
            const res = await axios.get('http://localhost:4040/invoices')
            console.log(res.data)
            this.items = res.data
        } catch (e) {
            console.error(e)
        }

        try {
            const res = await axios.get('http://localhost:4040/customers')
            console.log(res.data)
            let customersList = res.data

            this.customers = customersList.map(item => {
                let obj = {}
                obj['value'] = item
                obj['text'] = item.first_name + ' ' + item.last_name
                return obj
            })

            console.log('customers: ', this.customers)
        } catch (e) {
            console.error(e)
        }
    },
    methods: {
        addInvoiceModal() {
            this.$root.$emit('add-invoice', {})
            this.$bvModal.show('addNewInvoice')
        },
        async addInvoice() {
            await axios
                .post('http://localhost:4040/invoices/', {
                    customer_id: this.selected.id,
                    seller_id: 1,
                    invoice_date: this.dateVal,
                    due_date: this.dueDateVal,
                    invoice_status_id: 1,
                    total: 0,
                })
                .then(response => {
                    // redirect to new invoice
                    console.log(response.data.id)
                    this.$router.push({ path: '/edit/' + response.data.id })
                })
                .catch(function(error) {
                    console.log(error)
                })
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        showMsgBoxTwo() {
            this.boxTwo = ''
            this.$bvModal
                .msgBoxOk('Invoice deleted successfully', {
                    title: 'Confirmation',
                    size: 'sm',
                    buttonSize: 'sm',
                    okVariant: 'success',
                    headerClass: 'p-2 border-bottom-0',
                    footerClass: 'p-2 border-top-0',
                    centered: true,
                })
                .then(value => {
                    this.boxTwo = value
                })
                .catch(err => {
                    console.log(err)
                })
        },
        deleteInvoice(id) {
            if (
                confirm(
                    'Are you sure you want to delete this invoice? ' +
                        'This cannot be undone.',
                    'Warning',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                )
            ) {
                const request_url = console.log(request_url, id)
                axios
                    .delete('http://localhost:4040/invoices/' + id)
                    .then(response => {
                        // Logic to delete local state
                        const invoiceIndex = this.items.findIndex(
                            n => n.id === id
                        )
                        this.items.splice(invoiceIndex, 1)
                        return response
                    })
                    .catch(function(error) {
                        console.log(error)
                    })
                this.showMsgBoxTwo()
            }
        },
    },
}
</script>
