<template>
    <b-container fluid>
        <!-- User Interface controls -->
        <h2>Edit Invoice no. {{ $route.params.id }}</h2>
        <b-row>
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
                {{ row.item.name }}
            </template>

            <template #cell(quantity)="row">
                <b-input
                    v-if="userRow && userRow.id === row.item.id"
                    v-model="row.item.quantity"
                    :type="'number' || 'text'"
                    :number="true"
                    size="sm"
                    class="w-25 mx-auto"
                    :min="1"
                    :max="100"
                >
                </b-input>
                <template v-else>
                    {{ row.item.quantity }}
                </template>
            </template>
            <template #cell(actions)="row">
                <b-button-group v-if="userRow && userRow.id === row.item.id">
                    <b-btn size="sm" variant="success" @click="saveEdit">
                        Save
                    </b-btn>
                    <b-btn size="sm" variant="danger" @click="resetEdit">
                        Cancel
                    </b-btn>
                </b-button-group>
                <b-button-group v-else>
                    <b-button
                        style="margin-left: 4px"
                        size="sm"
                        variant="info"
                        @click="editUser(row.item)"
                    >
                        Edit
                    </b-button>
                    <b-button
                        size="sm"
                        variant="danger"
                        @click="deleteInvoicePos(row.item.id)"
                    >
                        X
                    </b-button>
                </b-button-group>
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
        <p class="h4 text-right">
            Total price:
            {{ items.reduce((a, { total }) => a + total, 0) }}
        </p>

        <b-button
            variant="success"
            size="sm"
            @click="$bvModal.show('bv-modal-example')"
        >
            Add product
        </b-button>
        <b-button
            variant="primary"
            class="ml-3"
            size="sm"
            @click="$bvModal.show('bv-modal-status')"
        >
            Change status
        </b-button>
        <!-- Modal div -->

        <b-modal id="bv-modal-example" hide-footer>
            <template #modal-title> Add Product </template>
            <div class="d-block text-center">
                <h3>New invoice position</h3>
            </div>
            <b-form>
                <b-form-group
                    id="input-group-1"
                    label="Product:"
                    label-for="input-1"
                >
                    <div>
                        <b-form-select
                            v-model="selectedProduct"
                            :options="products"
                        ></b-form-select>
                        <div class="mt-3">
                            Selected:
                            <strong>{{ selectedProduct.name }}</strong>
                        </div>
                    </div>
                </b-form-group>
            </b-form>
            <b-form>
                <b-form-group
                    id="input-group-2"
                    label="Quantity:"
                    v-model="quantity"
                    label-for="input-2"
                >
                    <div>
                        <b-input
                            v-model="quantity"
                            :type="'number' || 'text'"
                            :number="true"
                            :min="1"
                            :max="100"
                        >
                        </b-input>
                        <div class="mt-3">
                            Selected: <strong>{{ quantity }}</strong>
                        </div>
                    </div>
                </b-form-group>
            </b-form>
            <b-button class="mt-3" block @click="addPosition()"
                >Add Position

                <!-- $bvModal.hide('bv-modal-example') -->
            </b-button>
        </b-modal>

        <b-modal id="bv-modal-status" hide-footer>
            <template #modal-title> Change status </template>
            <div class="d-block text-center"></div>
            <b-form>
                <b-form-group
                    id="input-group-2"
                    label="Status:"
                    v-model="selectedStatus"
                    label-for="input-2"
                >
                    <div>
                        <b-form-select
                            v-model="selectedStatus"
                            :options="statuses"
                        ></b-form-select>
                    </div>
                </b-form-group>
            </b-form>
            <b-button class="mt-3" block @click="changeStatus()"
                >Add Position

                <!-- $bvModal.hide('bv-modal-example') -->
            </b-button>
        </b-modal>
    </b-container>
</template>
<script>
import axios from 'axios'
export default {
    data() {
        return {
            userRow: null,
            selectedProduct: { name: '' },
            selectedStatus: '',
            quantity: null,
            products: [],
            statuses: [],
            options: ['paid', 'pending', 'canceled'],
            items: [],
            fields: [
                {
                    key: 'name',
                    label: 'Product name',
                    sortable: true,
                    sortDirection: 'desc',
                },
                {
                    key: 'unit_price',
                    label: 'Unit price',
                    sortable: true,
                },
                {
                    key: 'quantity',
                    label: 'Quantity',
                    sortable: true,
                },
                {
                    key: 'total',
                    label: 'Total',
                    sortable: true,
                },
                { key: 'actions', label: 'Actions' },
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,
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
            invoice_id: this.$route.params.id,
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter((f) => f.sortable)
                .map((f) => {
                    return { text: f.label, value: f.key }
                })
        },
    },
    async created() {
        try {
            const res = await axios.get(
                'http://localhost:4040/invoices/' + this.$route.params.id
            )
            console.log(res.data)
            this.items = res.data.products
        } catch (e) {
            console.error(e)
        }

        try {
            const res = await axios.get('http://localhost:4040/products/')
            let productsList = res.data

            this.products = productsList.map((item) => {
                let obj = {}
                obj['value'] = item
                obj['text'] = item.name
                return obj
            })
        } catch (e) {
            console.error(e)
        }

        try {
            const res = await axios.get(
                'http://localhost:4040/invoice_statuses'
            )
            let statusesList = res.data

            this.statuses = statusesList.map((item) => {
                let obj = {}
                obj['value'] = item
                obj['text'] = item.name
                return obj
            })
        } catch (e) {
            console.error(e)
        }
    },
    methods: {
        info(item, index, button) {
            this.infoModal.title = `Row index: ${index}`
            this.infoModal.content = JSON.stringify(item, null, 2)
            this.$root.$emit('bv::show::modal', this.infoModal.id, button)
        },
        resetInfoModal() {
            this.infoModal.title = ''
            this.infoModal.content = ''
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        updateQuantity(id) {
            axios
                .put('http://localhost:4040/invoice_positions/' + id, {
                    quantity: this.editedQuantity,
                })
                .then((response) => {
                    // Logic to update local state
                    return response
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        deleteInvoicePos(id) {
            if (
                confirm(
                    'Are you sure you want to delete this product? ' +
                        'This cannot be undone.',
                    'Warning',
                    {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                    }
                )
            ) {
                axios
                    .delete('http://localhost:4040/invoice_positions/' + id)
                    .then((response) => {
                        // Logic to delete local state
                        const invoicePosIndex = this.items.findIndex(
                            (n) => n.id === id
                        )
                        this.items.splice(invoicePosIndex, 1)
                        return response
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
            }
        },
        async addPosition() {
            console.log({
                invoice_id: this.$route.params.id,
                name: this.selectedProduct.name,
                product_id: this.selectedProduct.id,
                quantity: this.quantity,
                unit_price: this.selectedProduct.price,
                total: this.quantity * this.selectedProduct.unit_price,
            })
            await axios
                .post('http://localhost:4040/invoice_positions/', {
                    invoice_id: this.$route.params.id,
                    name: this.selectedProduct.name,
                    product_id: this.selectedProduct.id,
                    quantity: this.quantity,
                    unit_price: this.selectedProduct.price,
                    total: this.quantity * this.selectedProduct.price,
                })
                .then((response) => {
                    // redirect to new invoice
                    console.log(response.data.id)
                    this.$router.go(this.$router.currentRoute)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        async changeStatus() {
            console.log('selectedStatus id = ', this.selectedStatus.id)
            console.log('id = ', this.$route.params.id)
            await axios
                .put(
                    'http://localhost:4040/invoices/' +
                        this.$route.params.id +
                        '/status/' +
                        this.selectedStatus.id
                )
                .then((response) => {
                    if (this.selectedStatus.id != 1) {
                        this.$router.push({
                            name: 'Invoices',
                        })
                    } else {
                        this.$router.go(this.$router.currentRoute)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        editUser(user) {
            let doEdit = true
            if (
                this.userRow &&
                !confirm(
                    'You have unsaved changes, are you sure you want to continue?'
                )
            ) {
                doEdit = false
            }

            if (doEdit) {
                console.log('user', user)
                this.userRow = { ...user }
                console.log('userRow: ', this.userRow)
            }
        },
        saveEdit() {
            let user = this.items.find((u) => u.id === this.userRow.id)
            console.log('user ', user)
            console.log('user quantity: ', this.editedQuantity)
            user.quantity = this.editedQuantity

            user.total = user.quantity * user.unit_price

            this.resetEdit()
            this.updateQuantity(user.id)
        },
        resetEdit() {
            this.userRow = null
        },
    },
}
</script>
