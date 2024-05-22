<template>
  <div class="main mb-5">
    <h1 class="is-size-1 has-text-centered pt-5">GitHub Repositories</h1>
    <div class="column is-three-quarters is-flex is-justify-content-space-center my-5 mx-auto">
      <div class="field is-grouped has-text-danger-light is-align-items-center is-two-fifths my-5 mx-auto">
        <p class="control is-expanded">
          <input class="input has-background-white has-text-black" type="text" placeholder="Input Query" v-model="filterQuery" @keyup.enter="loadRepos(loadQuery)" @change="changeFilter">
        </p>
        <p class="control">
          <button class="button is-info" @click="loadRepos(loadQuery)">Load Repos</button>
        </p>
      </div>
      <div class="column is-two-fifths field is-grouped is-flex is-align-items-center is-justify-content-center has-text-danger-light my-5 mx-auto">
        <p class="control is-expanded">
          <input class="input has-background-white has-text-black" type="text" placeholder="Find a repository" v-model="searchQuery" @keyup.enter="filter(searchQuery)">
        </p>
        <p class="control">
          <button class="button is-primary" @click="filter(searchQuery)">
            Search
          </button>
        </p>
      </div>
    </div>
    <RepositoryDetail
      v-for="(repo, index) in filteredData"
      :key="repo.id"
      :title="repo.name"
      :info="repo"
      :index="!this.isSearching && this.currentPage > 0 ? index + (currentPage - 1) * itemsPerPage : null"
    />
    <div class="column is-three-quarters hero is-medium is-flex is-justify-content-space-center m-auto " v-if="filteredData.length === 0" style=" border: 1px dashed">
      <p class="is-size-5 has-text-centered py-4">No data</p>
    </div>
    <div class="column is-three-quarters is-flex is-align-items-center is-justify-content-center my-5 mx-auto">
      <div class="is-flex is-align-items-center is-justify-content-center">
        <label for="itemsPerPage">Page:</label>
        <input class="input has-background-white has-text-black my-0 mx-4 per-page itermsPerPage" type="number" id="itemsPerPage" v-model="currentPage" @change="changeItemsPerPage" />
      </div>
      <button class="button is-link is-rounded mr-3" @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <button class="button is-link is-rounded" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import RepositoryDetail from "./RepositoryDetail.vue";
import "../../css/accordion.css";
import "../../css/fetchRepo.css";

export default {
  data() {
    return {
      searchQuery: '',
      filterQuery: 'python',
      loadQuery: {
        query: 'python',
        page: 1
      },
      fetchedData: [], // fetched data array
      filteredData: [],
      itemsPerPage: 30,
      currentPage: 1,
      isSearching: false
    };
  },

  computed: {
    ...mapState('gitRepo', ['myData'])
  },
  watch: {
    currentPage(newVal, oldVal) {
      if (newVal !== oldVal && newVal > 0) {
        this.loadRepos(this.loadQuery)
      }
    }
  },
  components: {
    RepositoryDetail,
  },
  methods: {
    ...mapActions('gitRepo', ['fetchData']),
    async loadRepos(param) {
      if (!param) {
        param.query = 'python'
        param.page = 1
      }
      const payload = {
        q: param.query,
        page: param.page
      }
      await this.fetchData(payload);
      this.filteredData = this.myData
      this.searchQuery = ''
      this.isSearching = false
    },
    filter(search_value) {
      search_value ? this.isSearching = true : this.isSearching = false;
      const query = typeof search_value === 'string' ? search_value.toLowerCase() : search_value;
      const temp =  this.myData.filter(repo => {
        return Object.values(repo).some(value => {
          if (typeof value === 'string' || typeof value === 'number') {
            if (typeof value === 'string')
              return value.toLowerCase().includes(query);
            else if (typeof value === 'number')
              return value.toString().includes(query);
          }
          return false;
        });
      });
      this.filteredData = temp
    },
    nextPage() {
      if (this.currentPage > 32) {
        alert('Only the first 1000 search results are available')
        return
      }
      this.currentPage++;
      this.searchQuery = ''
      this.isSearching = false
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      } else {
        return
      } 
      this.searchQuery = ''
      this.isSearching = false
    },
    changeItemsPerPage() {
      this.loadQuery.page = this.currentPage
      this.loadQuery.query = this.filterQuery
    },
    changeFilter() {
      this.loadQuery.query = this.filterQuery
    }
  }
};
</script>