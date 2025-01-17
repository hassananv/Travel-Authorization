<template>
  <v-app>
    <v-app-bar app color="#fff" flat height="70" style="left: 0; border-bottom: 3px #f3b228 solid">
      <img src="/yukon.svg" style="margin: -8px 85px 0 0" height="44" />
      <v-toolbar-title>
        <span style="font-weight: 700">{{ applicationName }}</span>

        <v-progress-circular
          :class="loadingClass"
          indeterminate
          color="#f3b228"
          size="20"
          width="2"
          class="ml-4"
        ></v-progress-circular>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <div>
        <v-menu offset-y class="ml-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text color="primary" v-bind="attrs" v-on="on"> {{ menuTitle }}<v-icon>mdi-menu-down</v-icon> </v-btn>
          </template>

          <v-list dense style="min-width: 200px">
            <v-list-item @click="menuItemSelected('Dashboard')" to="/dashboard">
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('My Travel Requests')" to="/my-travel-requests">
              <v-list-item-title>My Travel Requests</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('PreApproved')" to="/preapproved">
              <v-list-item-title>PreApproved</v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('Travel Desk')" to="/travel-desk">
              <v-list-item-title>Travel Desk </v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('Travel Request')" to="/travel-request">
              <v-list-item-title>Travel Request </v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('Flight Expense')" to="/flight-expense">
              <v-list-item-title>Flight Expense </v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('Reports')" to="/reporting-summary">
              <v-list-item-title>Reports </v-list-item-title>
            </v-list-item>
            <v-list-item @click="menuItemSelected('Manager View')" to="/managerView">
              <v-list-item-title>Manager View</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn icon color="primary" class="mr-2" title="Recently visited" @click="showHistory()">
          <v-icon>mdi-history</v-icon>
        </v-btn>

        <span>{{ username }}</span>
        <v-menu bottom left class="ml-0">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon color="primary" v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense style="min-width: 200px">
            <v-list-item to="/profile">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>My profile</v-list-item-title>
            </v-list-item>
            <v-list-item to="/administration">
              <v-list-item-icon>
                <v-icon>mdi-cogs</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Administration</v-list-item-title>
            </v-list-item>

            <v-divider />
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-exit-run</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign out</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-clock</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ appVersion }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon> -->
    </v-app-bar>

    <v-main v-bind:style="{ 'padding-left: 33px !important': !hasSidebar }">
      <!-- Provides the application the proper gutter -->
      <v-container fluid class="page-wrapper">
        <router-view></router-view>
        <RequestAlert />
      </v-container>
    </v-main>

    <v-overlay v-model="showOverlay">
      <div class="text-center">
        <v-progress-circular indeterminate size="64" class="mb-5"></v-progress-circular>
        <h1 class="title">Loading Travel Authorization</h1>
      </div>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import router from "@/router";
import store from "@/store";
import * as config from "@/config";
import RequestAlert from "@/components/RequestAlert.vue";
import { getInstance } from "@/auth";

const auth = getInstance();

export default {
  name: "App",
  components: {
    RequestAlert,
  },
  computed: {
    ...mapState(["isAuthenticated", "user", "showAppSidebar"]),
    username() {
      return store.getters.fullName;
    },
    isAuthenticated() {
      //return true; // until we get auth process to show sidebar
      return store.getters.isAuthenticated;
    },
    user() {
      return store.getters.user;
    },
    showAppSidebar() {
      return store.getters.showAppSidebar;
    },
  },
  data: () => ({
    appVersion: config.appVersion,
    dialog: false,
    drawer: null,
    drawerRight: null,
    headerShow: false,
    menuShow: false,
    loadingClass: "d-none",
    applicationName: config.applicationName,
    applicationIcon: config.applicationIcon,
    sections: config.sections,
    hasSidebar: config.hasSidebar,
    hasSidebarClosable: config.hasSidebarClosable,
    currentId: 0,
    menuTitle: "Dashboard",

    showOverlay: true,
  }),
  async mounted() {
    if (auth.auth0Client) {
      this.doInitialize();
      return;
    }

    this.interval = window.setInterval(() => {
      if (auth.auth0Client) {
        window.clearInterval(this.interval);
        this.doInitialize();
      }
    }, 200);
  },
  watch: {
    isAuthenticated: function(val) {
      if (!val) this.hasSidebar = false;
      else this.hasSidebar = store.getters.showAppSidebar;
    },
    showAppSidebar: function(val) {
      if (val) {
        this.currentId = this.$route.params.id;
      }

      this.hasSidebar = val && this.isAuthenticated;
    },
  },
  methods: {
    nav: function(location) {
      router.push(location);
    },
    signOut: function() {
      this.$auth.logout();
    },
    showHistory() {
      this.$refs.historySidebar.show();
    },
    showError: function(msg) {
      this.$refs.notifier.showError(msg);
    },
    showSuccess: function(msg) {
      this.$refs.notifier.showSuccess(msg);
    },
    showAPIMessages: function(msg) {
      this.$refs.notifier.showAPIMessages(msg);
    },
    menuItemSelected(title) {
      this.menuTitle = title;
    },
    async doInitialize() {
      //await this.initialize();
      this.showOverlay = false;
    },
  },
};
</script>
